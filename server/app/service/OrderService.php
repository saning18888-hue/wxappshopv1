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
    public function preview(int $userId, array $items, array $address, ?int $couponId = null): array
    {
        $detail = $this->buildItems($items);
        $goodsAmount = (int) array_sum(array_column($detail, 'subtotal'));

        // 运费：满 99 元(9900分)包邮，否则 10 元(1000分)
        $shippingFee = $goodsAmount >= 9900 ? 0 : 1000;
        // 优惠：MVP 预留优惠券/积分，此处为 0
        $discount = 0;
        $payAmount = $goodsAmount + $shippingFee - $discount;

        return [
            'items'         => $detail,
            'goods_amount'  => $goodsAmount / 100,
            'shipping_fee'  => $shippingFee / 100,
            'discount'      => $discount / 100,
            'pay_amount'    => $payAmount / 100,
            'address'       => $address,
        ];
    }

    public function create(int $userId, array $items, array $address): array
    {
        $detail = $this->buildItems($items);
        $goodsAmount = (int) array_sum(array_column($detail, 'subtotal'));
        $shippingFee = $goodsAmount >= 9900 ? 0 : 1000;
        $discount    = 0;
        $payAmount   = $goodsAmount + $shippingFee - $discount;

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

            $orderNo = $this->genOrderNo();
            $orderId = Db::name('orders')->insertGetId([
                'order_no'      => $orderNo,
                'user_id'       => $userId,
                'receiver_name' => $address['name'] ?? '',
                'receiver_phone'=> $address['phone'] ?? '',
                'address'       => $address['address'] ?? '',
                'goods_amount'  => $goodsAmount,
                'shipping_fee'  => $shippingFee,
                'discount'      => $discount,
                'pay_amount'    => $payAmount,
                'status'        => 0, // 待付款
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
                'channel'  => 'wechat',
                'amount'   => $payAmount,
                'status'   => 0,
                'created_at' => date('Y-m-d H:i:s'),
            ]);

            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            throw $e;
        }

        return [
            'order_id'  => $orderId,
            'order_no'  => $orderNo,
            'pay_amount'=> $payAmount / 100,
            'pay'       => ['mock' => true], // 开发态：由 mock_notify 完成支付
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

    // ---- 内部辅助 ----

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
}
