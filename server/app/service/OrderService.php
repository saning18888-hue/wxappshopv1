<?php
namespace app\service;

use think\facade\Db;

/**
 * 订单服务：价格预览（服务端重算）、下单、查询
 * 金额单位：分
 */
class OrderService
{
    /** 价格预览：必须以服务端计算结果为准（PRD 4.2） */
    public function preview(int $userId, array $items, array $address, string $delivery = 'express', ?int $couponId = null): array
    {
        $detail = $this->buildItems($items);
        $goodsAmount = (int) array_sum(array_column($detail, 'subtotal'));

        $s = SettingsService::get();
        $enabled = [];
        if (!empty($s['delivery_express_enabled'])) $enabled[] = 'express';
        if (!empty($s['delivery_pickup_enabled'])) $enabled[] = 'self_pickup';
        if (!empty($s['delivery_local_enabled'])) $enabled[] = 'same_city';
        if (!empty($enabled) && !in_array($delivery, $enabled, true)) {
            $delivery = $enabled[0];
        }

        [$shippingFee, $memberDiscount, $discount, $payAmount] = $this->calcTotals($userId, $goodsAmount, $delivery);

        return [
            'items'          => $detail,
            'goods_amount'   => $goodsAmount,
            'shipping_fee'   => $shippingFee,
            'discount'       => $discount,
            'member_discount'=> $memberDiscount,
            'pay_amount'     => $payAmount,
            'delivery'       => $delivery,
            'delivery_options' => $this->deliveryOptions($s, $goodsAmount),
            'address'        => $address,
        ];
    }

    /** 可用配送方式列表（按后台开关）+ 各方式运费 */
    private function deliveryOptions(array $s, int $goodsAmount): array
    {
        $opts = [];
        if (!empty($s['delivery_express_enabled'])) {
            $opts[] = ['type' => 'express', 'name' => '快递配送', 'fee' => $this->calcExpressFee($s, $goodsAmount)];
        }
        if (!empty($s['delivery_pickup_enabled'])) {
            $raw = $s['delivery_pickup_points'] ?? null;
            $points = is_string($raw) ? json_decode($raw, true) : ($raw ?? []);
            $opts[] = ['type' => 'self_pickup', 'name' => '到店自提', 'fee' => 0,
                       'points' => is_array($points) ? $points : []];
        }
        if (!empty($s['delivery_local_enabled'])) {
            $opts[] = ['type' => 'same_city', 'name' => '同城配送', 'fee' => $this->calcLocalFee($s, $goodsAmount)];
        }
        return $opts;
    }

    public function create(int $userId, array $items, array $address, array $meta = []): array
    {
        $payMethod = $meta['pay_method'] ?? 'wechat';
        $platform  = strtolower($meta['platform'] ?? '');
        $delivery  = $meta['delivery'] ?? 'express';
        $pickupPointId = (int) ($meta['pickup_point_id'] ?? 0);

        // iOS 端支付限制：被限制的支付方式在 iOS 上禁止下单
        if ($platform === 'ios') {
            $s = SettingsService::get();
            $limit = $s['ios_pay_limit'] ?? [];
            if ($payMethod === 'balance' && !empty($limit['balance'])) {
                throw new \Exception('iOS 端暂不支持储值余额支付');
            }
        }

        $detail = $this->buildItems($items);
        $goodsAmount = (int) array_sum(array_column($detail, 'subtotal'));
        [$shippingFee, $memberDiscount, $discount, $payAmount] = $this->calcTotals($userId, $goodsAmount, $delivery);

        // 锁库存 + 创建订单（事务）
        Db::startTrans();
        try {
            foreach ($detail as $it) {
                Db::name('goods_skus')->where('id', $it['sku_id'])
                    ->where('stock', '>=', $it['quantity'])
                    ->dec('stock', $it['quantity'])->update();
                $affected = Db::name('goods_skus')->where('id', $it['sku_id'])
                    ->where('stock', '>=', 0)->count();
                if ($affected == 0) {
                    throw new \Exception('库存不足：' . $it['title']);
                }
                Db::name('goods')->where('id', $it['goods_id'])->dec('stock', $it['quantity'])->update();
            }

            // 储值余额支付：扣减用户余额，订单直接置为已付款（status=1）
            $balanceUsed = 0;
            $orderStatus = 0;
            $paidAt      = null;
            if ($payMethod === 'balance') {
                $payer = Db::name('users')->where('id', $userId)->lock(true)->find();
                if (!$payer || $payer['balance'] < $payAmount) {
                    throw new \Exception('储值余额不足');
                }
                Db::name('users')->where('id', $userId)->dec('balance', $payAmount);
                $balanceUsed = $payAmount;
                $orderStatus = 1;
                $paidAt      = date('Y-m-d H:i:s');
            }

            $orderNo = $this->genOrderNo();
            $orderId = Db::name('orders')->insertGetId([
                'order_no'      => $orderNo,
                'user_id'       => $userId,
                'receiver_name' => $address['name'] ?? '',
                'receiver_phone'=> $address['phone'] ?? '',
                'address'       => $address['address'] ?? '',
                'delivery'      => $delivery,
                'pickup_point_id'=> $pickupPointId,
                'goods_amount'  => $goodsAmount,
                'shipping_fee'  => $shippingFee,
                'discount'      => $discount,
                'member_discount'=> $memberDiscount,
                'pay_amount'    => $payAmount,
                'balance_used'  => $balanceUsed,
                'status'        => $orderStatus,
                'pay_time'      => $paidAt,
                'created_at'    => date('Y-m-d H:i:s'),
                'updated_at'    => date('Y-m-d H:i:s'),
            ]);

            foreach ($detail as $it) {
                Db::name('order_items')->insert([
                    'order_id'    => $orderId,
                    'goods_id'    => $it['goods_id'],
                    'sku_id'      => $it['sku_id'],
                    'goods_title' => $it['title'],
                    'spec_desc'   => $it['spec_desc'],
                    'image'       => $it['image'],
                    'price'       => $it['price'],
                    'quantity'    => $it['quantity'],
                    'subtotal'    => $it['subtotal'],
                ]);
            }
            Db::name('order_payments')->insert([
                'order_id' => $orderId,
                'pay_no'   => '',
                'channel'  => $payMethod,
                'amount'   => $payAmount,
                'status'   => $orderStatus === 1 ? 1 : 0,
                'created_at' => date('Y-m-d H:i:s'),
            ]);

            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            throw $e;
        }

        return [
            'order_id'   => $orderId,
            'order_no'   => $orderNo,
            'pay_amount' => $payAmount,
            'pay_method' => $payMethod,
            'delivery'   => $delivery,
            'pickup_point_id' => $pickupPointId,
            'need_pay'   => $orderStatus !== 1,
            'paid'       => $orderStatus === 1,
        ];
    }

    public function index(int $userId, int $page, int $pageSize): array
    {
        $total = Db::name('orders')->where('user_id', $userId)->count();
        $rows  = Db::name('orders')->where('user_id', $userId)
            ->order('id desc')->page($page, $pageSize)->select()->toArray();
        $list = array_map(fn($o) => $this->formatOrder($o, []), $rows);
        return ['list' => $list, 'total' => (int) $total, 'page' => $page, 'page_size' => $pageSize];
    }

    public function detail(int $userId, int $id): ?array
    {
        $o = Db::name('orders')->where(['id' => $id, 'user_id' => $userId])->find();
        if (!$o) {
            return null;
        }
        $items = Db::name('order_items')->where('order_id', $id)->select()->toArray();
        return $this->formatOrder($o, $items);
    }

    /**
     * 会员中心各状态订单数量
     * 状态码：0待付款 1待发货 2待收货 3/5已完成(待评价) 11退款中 12已退款
     */
    public function counts(int $userId): array
    {
        $rows = Db::name('orders')
            ->where('user_id', $userId)
            ->where('is_deleted', 0)
            ->field('status, COUNT(*) AS cnt')
            ->group('status')
            ->select()
            ->toArray();

        $map = [];
        foreach ($rows as $r) {
            $map[(int) $r['status']] = (int) $r['cnt'];
        }
        $sum = function (array $statuses) use ($map) {
            $n = 0;
            foreach ($statuses as $s) {
                $n += $map[$s] ?? 0;
            }
            return $n;
        };

        return [
            'counts' => [
                'pending_payment' => $sum([0]),
                'pending_ship'    => $sum([1]),
                'pending_receive' => $sum([2]),
                'pending_review'  => $sum([3, 5]),
                'refund'          => $sum([11, 12]),
            ],
        ];
    }

    // ---- 内部辅助 ----

    /** 会员分组折扣率（百分比，100=无折扣） */
    private function memberDiscountRate(int $userId): int
    {
        $u = Db::name('users')->where('id', $userId)->field('group_id')->find();
        if (!$u || empty($u['group_id'])) {
            return 100;
        }
        $g = Db::name('member_groups')->where('id', $u['group_id'])->field('discount')->find();
        return $g ? intval($g['discount']) : 100;
    }

    /**
     * 汇总金额：返回 [运费, 会员折扣额, 总优惠额, 应付额]（单位：分）
     * 目前优惠仅含会员分组折扣；后续可叠加优惠券/积分。
     */
    private function calcTotals(int $userId, int $goodsAmount, string $delivery = 'express'): array
    {
        if ($delivery === 'self_pickup') {
            $shippingFee = 0;
        } elseif ($delivery === 'same_city') {
            $shippingFee = $this->calcLocalFee(SettingsService::get(), $goodsAmount);
        } else {
            $shippingFee = $this->calcExpressFee(SettingsService::get(), $goodsAmount);
        }
        $rate = $this->memberDiscountRate($userId);
        $memberDiscount = (int) floor($goodsAmount * (100 - $rate) / 100);
        $discount = $memberDiscount;
        $payAmount = $goodsAmount + $shippingFee - $discount;
        return [$shippingFee, $memberDiscount, $discount, $payAmount];
    }

    /** 快递运费：取第一个运费模板（满 free_amount 包邮，否则 base_fee），无模板回退满99包邮 */
    private function calcExpressFee(array $s, int $goodsAmount): int
    {
        $tpl = $this->firstEntry($s['delivery_express_templates'] ?? null);
        if (!$tpl) {
            return $goodsAmount >= 9900 ? 0 : 1000;
        }
        $free = (int) ($tpl['free_amount'] ?? 0);
        $fee  = (int) ($tpl['fee'] ?? $tpl['base_fee'] ?? 1000);
        return ($free > 0 && $goodsAmount >= $free) ? 0 : $fee;
    }

    /** 同城运费：取第一个规则（满 free_amount 包邮，否则 base_fee），无规则回退 */
    private function calcLocalFee(array $s, int $goodsAmount): int
    {
        $rule = $this->firstEntry($s['delivery_local_rules'] ?? null);
        if (!$rule) {
            return $goodsAmount >= 9900 ? 0 : 1000;
        }
        $free = (int) ($rule['free_amount'] ?? 0);
        $fee  = (int) ($rule['base_fee'] ?? 1000);
        return ($free > 0 && $goodsAmount >= $free) ? 0 : $fee;
    }

    /** 模板/规则可能是 JSON 字符串或数组：统一取首条作为计费对象（兼容 [{...}] 或 {...}） */
    private function firstEntry($raw)
    {
        if (empty($raw)) return null;
        $arr = is_string($raw) ? json_decode($raw, true) : $raw;
        if (!is_array($arr)) return null;
        // 列表包裹（如后台存的是 [{...}]）取第一条；单个对象（{...}）直接返回
        return (isset($arr[0]) && is_array($arr[0])) ? $arr[0] : $arr;
    }

    private function buildItems(array $items): array
    {
        $detail = [];
        foreach ($items as $it) {
            $sku   = Db::name('goods_skus')->where('id', $it['sku_id'])->find();
            $goods = Db::name('goods')->where('id', $sku['goods_id'])->find();
            if (!$sku || !$goods) {
                throw new \Exception('商品不存在');
            }
            if ($sku['stock'] < $it['quantity']) {
                throw new \Exception('库存不足：' . $goods['title']);
            }
            $images = json_decode($goods['images'] ?? '[]', true) ?: [];
            $detail[] = [
                'sku_id'    => $sku['id'],
                'goods_id'  => $goods['id'],
                'title'     => $goods['title'],
                'image'     => $sku['image'] ?: ($images[0] ?? ''),
                'price'     => $sku['price'],
                'quantity'  => $it['quantity'],
                'subtotal'  => $sku['price'] * $it['quantity'],
                'spec_desc' => $this->specDesc($sku['spec_value_ids']),
            ];
        }
        return $detail;
    }

    private function specDesc(?string $specValueIds): string
    {
        if (!$specValueIds) {
            return '';
        }
        $ids  = array_filter(explode(',', $specValueIds));
        $vals = Db::name('goods_spec_values')->whereIn('id', $ids)->column('value');
        return implode(' / ', $vals);
    }

    private function genOrderNo(): string
    {
        return date('YmdHis') . str_pad((string) mt_rand(0, 9999), 4, '0', STR_PAD_LEFT);
    }

    private function formatOrder($o, array $items): array
    {
        $user = null;
        if (!empty($o['user_id'])) {
            $user = Db::name('users')->where('id', $o['user_id'])->field('nickname, avatar')->find();
        }
        return [
            'id'              => $o['id'],
            'order_no'        => $o['order_no'],
            'trade_no'        => $o['trade_no'] ?? '',
            'user_id'         => $o['user_id'],
            'user_name'       => $user['nickname'] ?? '',
            'user_avatar'     => $user['avatar'] ?? '',
            'status'          => (int) $o['status'],
            'status_text'     => $this->statusText($o['status']),
            'order_type'      => (int) ($o['order_type'] ?? 0),
            'order_type_text' => ($o['order_type'] ?? 0) == 0 ? '普通订单' : '其他',
            'source'          => $o['source'] ?? 'wechat',
            'source_text'     => ($o['source'] ?? 'wechat') === 'wechat' ? '微信' : '其他',
            'delivery'        => $o['delivery'] ?? 'express',
            'delivery_text'   => (['express' => '快递配送', 'self_pickup' => '到店自提', 'same_city' => '同城配送'][$o['delivery'] ?? 'express'] ?? '快递配送'),
            'pickup_point_id' => (int) ($o['pickup_point_id'] ?? 0),
            'goods_amount'    => floatval($o['goods_amount'] / 100),
            'shipping_fee'    => floatval($o['shipping_fee'] / 100),
            'discount'        => floatval($o['discount'] / 100),
            'member_discount' => floatval(($o['member_discount'] ?? 0) / 100),
            'coupon_amount'   => floatval(($o['coupon_amount'] ?? 0) / 100),
            'balance_used'    => floatval(($o['balance_used'] ?? 0) / 100),
            'pay_amount'      => floatval($o['pay_amount'] / 100),
            'receiver_name'   => $o['receiver_name'],
            'receiver_phone'  => $o['receiver_phone'],
            'address'         => $o['address'],
            'buyer_message'   => $o['buyer_message'] ?? '',
            'remark'          => $o['remark'] ?? '',
            'shipping_company'=> $o['shipping_company'] ?? '',
            'shipping_no'     => $o['shipping_no'] ?? '',
            'items'           => $items,
            'created_at'      => $o['created_at'],
            'updated_at'      => $o['updated_at'] ?? $o['created_at'],
        ];
    }

    private function statusText(int $status): string
    {
        return [
            0  => '待付款',
            1  => '待发货',
            2  => '待收货',
            3  => '已完成',
            4  => '待核销',
            5  => '已完成',
            10 => '已取消',
            11 => '退款中',
            12 => '已退款',
            20 => '已关闭',
        ][$status] ?? '未知';
    }

    // ---------- 后台管理（全部订单）----------

    public function adminList(int $page, int $pageSize, ?int $status, ?string $keyword): array
    {
        $q = Db::name('orders');
        if ($status !== null) {
            $q->where('status', $status);
        }
        if ($keyword) {
            $q->where(function ($query) use ($keyword) {
                $query->where('order_no', 'like', "%{$keyword}%")
                      ->whereOr('trade_no', 'like', "%{$keyword}%")
                      ->whereOr('receiver_name', 'like', "%{$keyword}%")
                      ->whereOr('receiver_phone', 'like', "%{$keyword}%");
            });
        }
        $total = $q->count();
        $rows  = $q->order('id desc')->page($page, $pageSize)->select()->toArray();
        $list  = array_map(fn($o) => $this->formatOrder($o, []), $rows);
        return ['list' => $list, 'total' => (int) $total, 'page' => $page, 'page_size' => $pageSize, 'last_page' => max(1, (int) ceil($total / $pageSize))];
    }

    public function adminDetail(int $id): ?array
    {
        $o = Db::name('orders')->where('id', $id)->find();
        if (!$o) {
            return null;
        }
        $items = Db::name('order_items')->where('order_id', $id)->select()->toArray();
        return $this->formatOrder($o, $items);
    }

    public function adminSave(int $id, array $data): void
    {
        $o = Db::name('orders')->where('id', $id)->find();
        if (!$o) {
            throw new \Exception('订单不存在');
        }
        $payAmount = isset($data['pay_amount']) ? intval(round(floatval($data['pay_amount']) * 100)) : (int) $o['pay_amount'];
        $update = [
            'receiver_name'  => trim($data['receiver_name'] ?? $o['receiver_name']),
            'receiver_phone' => trim($data['receiver_phone'] ?? $o['receiver_phone']),
            'address'        => trim($data['address'] ?? $o['address']),
            'buyer_message'  => trim($data['buyer_message'] ?? ($o['buyer_message'] ?? '')),
            'remark'         => trim($data['remark'] ?? ($o['remark'] ?? '')),
            'pay_amount'     => $payAmount,
            'updated_at'     => date('Y-m-d H:i:s'),
        ];
        Db::name('orders')->where('id', $id)->update($update);
    }

    public function changeStatus(int $id, int $status): void
    {
        $o = Db::name('orders')->where('id', $id)->find();
        if (!$o) {
            throw new \Exception('订单不存在');
        }
        // 取消订单时回滚库存
        if ($status == 10 && intval($o['status']) != 10) {
            $items = Db::name('order_items')->where('order_id', $id)->select()->toArray();
            foreach ($items as $it) {
                Db::name('goods_skus')->where('id', $it['sku_id'])->inc('stock', $it['quantity'])->update();
                Db::name('goods')->where('id', $it['goods_id'])->inc('stock', $it['quantity'])->update();
            }
        }
        Db::name('orders')->where('id', $id)->update(['status' => $status, 'updated_at' => date('Y-m-d H:i:s')]);
    }

    public function batchDelete(array $ids): void
    {
        if (empty($ids)) {
            throw new \Exception('请选择要删除的订单');
        }
        Db::name('orders')->whereIn('id', $ids)->delete();
        Db::name('order_items')->whereIn('order_id', $ids)->delete();
    }

    public function batchShip(array $orders, string $shipType = 'express', string $defaultCompany = '', string $defaultNo = '', array $rows = []): void
    {
        if (empty($orders)) {
            throw new \Exception('请选择要发货的订单');
        }
        $status = $shipType === 'none' ? 2 : 3;
        $updateMap = [];
        foreach ($rows as $r) {
            $orderNo = trim($r['order_no'] ?? '');
            if ($orderNo !== '') {
                $updateMap[$orderNo] = [
                    'shipping_company' => trim($r['shipping_company'] ?? '') ?: $defaultCompany,
                    'shipping_no'      => trim($r['shipping_no'] ?? '') ?: $defaultNo,
                ];
            }
        }
        foreach ($orders as $o) {
            $id = intval($o['id'] ?? 0);
            if (!$id) continue;
            $order = Db::name('orders')->where('id', $id)->whereIn('status', [1, 2])->find();
            if (!$order) continue;
            $data = [
                'status'     => $status,
                'updated_at' => date('Y-m-d H:i:s'),
            ];
            if ($shipType !== 'none') {
                $map = $updateMap[$order['order_no']] ?? [
                    'shipping_company' => $defaultCompany,
                    'shipping_no'      => $defaultNo,
                ];
                $data['shipping_company'] = $map['shipping_company'];
                $data['shipping_no']      = $map['shipping_no'];
            }
            Db::name('orders')->where('id', $id)->update($data);
        }
    }

    public function adminCreate(array $data): array
    {
        $userId   = intval($data['user_id'] ?? 0);
        $itemsIn  = $data['items'] ?? [];
        $address  = $data['address'] ?? [];
        if (!$userId || empty($itemsIn) || empty($address['name']) || empty($address['phone']) || empty($address['address'])) {
            throw new \Exception('用户、商品或地址信息不完整');
        }
        return $this->create($userId, $itemsIn, $address);
    }

    // ---------- 后台管理：售后订单 ----------

    public function adminAftersaleList(int $page, int $pageSize, string $tab, ?string $keyword): array
    {
        $q = Db::name('orders');
        switch ($tab) {
            case 'recycle':
                $q->where('is_deleted', 1);
                break;
            case 'pending':
                $q->where('status', 11)->where('is_deleted', 0);
                break;
            case 'refunded':
                $q->where('status', 12)->where('is_deleted', 0);
                break;
            case 'all':
            default:
                $q->whereIn('status', [11, 12])->where('is_deleted', 0);
                break;
        }
        if ($keyword) {
            $q->where(function ($query) use ($keyword) {
                $query->where('order_no', 'like', "%{$keyword}%")
                      ->whereOr('trade_no', 'like', "%{$keyword}%")
                      ->whereOr('receiver_name', 'like', "%{$keyword}%")
                      ->whereOr('receiver_phone', 'like', "%{$keyword}%");
            });
        }
        $total = $q->count();
        $rows  = $q->order('id desc')->page($page, $pageSize)->select()->toArray();
        $list  = array_map(fn($o) => $this->formatOrder($o, []), $rows);
        return [
            'list'      => $list,
            'total'     => (int) $total,
            'page'      => $page,
            'page_size' => $pageSize,
            'last_page' => max(1, (int) ceil($total / $pageSize)),
        ];
    }

    public function softDeleteOrders(array $ids): void
    {
        if (empty($ids)) {
            throw new \Exception('请选择要删除的订单');
        }
        Db::name('orders')->whereIn('id', $ids)->where('is_deleted', 0)->update([
            'is_deleted' => 1,
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
    }

    public function restoreOrders(array $ids): void
    {
        if (empty($ids)) {
            throw new \Exception('请选择要恢复的订单');
        }
        Db::name('orders')->whereIn('id', $ids)->where('is_deleted', 1)->update([
            'is_deleted' => 0,
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
    }

    public function refundOrder(int $id, float $amount, string $reason): void
    {
        $o = Db::name('orders')->where('id', $id)->where('is_deleted', 0)->find();
        if (!$o) {
            throw new \Exception('订单不存在');
        }
        if (!in_array((int) $o['status'], [11, 12], true)) {
            // 非售后状态也可以发起退款：统一变更为退款中
        }
        $refundAmount = intval(round($amount * 100));
        $now = date('Y-m-d H:i:s');
        Db::name('orders')->where('id', $id)->update([
            'status'          => 12,
            'refund_amount'   => $refundAmount,
            'refund_reason'   => $reason,
            'refund_finish_at'=> $now,
            'refund_apply_at' => $o['refund_apply_at'] ?: $now,
            'updated_at'      => $now,
        ]);
    }

    // ---------- 定时任务：交易自动化 ----------

    /** 扫描未支付超时订单并自动取消（minutes 分钟） */
    public static function cancelExpiredOrders(int $minutes): int
    {
        if ($minutes <= 0) {
            return 0;
        }
        $deadline = date('Y-m-d H:i:s', time() - $minutes * 60);
        $rows = Db::name('orders')->where('status', 0)
            ->where('created_at', '<', $deadline)
            ->field('id')->select()->toArray();
        $svc = new self();
        $count = 0;
        foreach ($rows as $o) {
            $svc->changeStatus((int) $o['id'], 10); // 取消并回滚库存
            $count++;
        }
        return $count;
    }

    /** 扫描已发货超时未确认收货订单并自动完成（days 天） */
    public static function autoConfirmReceived(int $days): int
    {
        if ($days <= 0) {
            return 0;
        }
        $deadline = date('Y-m-d H:i:s', time() - $days * 86400);
        $rows = Db::name('orders')->where('status', 3) // 已发货
            ->where('updated_at', '<', $deadline)
            ->field('id')->select()->toArray();
        $svc = new self();
        $count = 0;
        foreach ($rows as $o) {
            $svc->changeStatus((int) $o['id'], 5); // 自动确认收货 → 已完成
            $count++;
        }
        return $count;
    }
}
