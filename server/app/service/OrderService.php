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
        return [
            'id'             => $o['id'],
            'order_no'       => $o['order_no'],
            'status'         => (int) $o['status'],
            'status_text'    => $this->statusText($o['status']),
            'goods_amount'   => floatval($o['goods_amount'] / 100),
            'shipping_fee'   => floatval($o['shipping_fee'] / 100),
            'discount'       => floatval($o['discount'] / 100),
            'pay_amount'     => floatval($o['pay_amount'] / 100),
            'receiver_name'  => $o['receiver_name'],
            'receiver_phone' => $o['receiver_phone'],
            'address'        => $o['address'],
            'items'          => $items,
            'created_at'     => $o['created_at'],
        ];
    }

    private function statusText(int $status): string
    {
        return [
            0  => '待付款',
            1  => '已付款/待履约',
            2  => '配货中',
            3  => '已发货',
            4  => '待自提',
            5  => '已完成',
            10 => '已取消',
            11 => '退款中',
            12 => '已退款',
        ][$status] ?? '未知';
    }

    // ---------- 后台管理（全部订单）----------

    public function adminList(int $page, int $pageSize, ?int $status): array
    {
        $q = Db::name('orders');
        if ($status !== null) {
            $q->where('status', $status);
        }
        $total = $q->count();
        $rows  = $q->order('id desc')->page($page, $pageSize)->select()->toArray();
        $list  = array_map(fn($o) => $this->formatOrder($o, []), $rows);
        return ['list' => $list, 'total' => (int) $total, 'page' => $page, 'page_size' => $pageSize];
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

    public function changeStatus(int $id, int $status): void
    {
        $o = Db::name('orders')->where('id', $id)->find();
        // 取消订单时回滚库存
        if ($o && $status == 10 && intval($o['status']) != 10) {
            $items = Db::name('order_items')->where('order_id', $id)->select()->toArray();
            foreach ($items as $it) {
                Db::name('goods_skus')->where('id', $it['sku_id'])->inc('stock', $it['quantity'])->update();
                Db::name('goods')->where('id', $it['goods_id'])->inc('stock', $it['quantity'])->update();
            }
        }
        Db::name('orders')->where('id', $id)->update(['status' => $status, 'updated_at' => date('Y-m-d H:i:s')]);
    }
}
