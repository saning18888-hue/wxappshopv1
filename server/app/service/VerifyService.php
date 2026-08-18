<?php

namespace app\service;

use think\facade\Db;

class VerifyService
{
    public function verify(string $type, string $code, int $verifierId): array
    {
        $now = date('Y-m-d H:i:s');
        switch ($type) {
            case 'pickup':
                return $this->verifyPickup($code, $verifierId, $now);
            case 'card':
                return $this->verifyCard($code, $verifierId, $now);
            case 'coupon':
                return $this->verifyCoupon($code, $verifierId, $now);
            default:
                throw new \Exception('不支持的核销类型');
        }
    }

    private function verifyPickup(string $code, int $verifierId, string $now): array
    {
        $order = Db::name('orders')
            ->where(function ($q) use ($code) {
                $q->where('order_no', $code)
                  ->whereOr('pickup_code', $code);
            })
            ->find();
        if (!$order) {
            throw new \Exception('未找到到店自提订单');
        }
        if ((int) $order['status'] !== 4) {
            throw new \Exception('该订单不是待核销状态');
        }
        Db::name('orders')->where('id', $order['id'])->update([
            'status'      => 5,
            'verified_at' => $now,
            'updated_at'  => $now,
        ]);
        $record = $this->createRecord('pickup', $code, $order, $verifierId, $now);
        return ['record' => $record];
    }

    private function verifyCard(string $code, int $verifierId, string $now): array
    {
        $card = Db::name('order_cards')->where('code', $code)->find();
        if (!$card) {
            throw new \Exception('未找到电子卡券');
        }
        if ((int) $card['status'] !== 0) {
            throw new \Exception('该卡券状态不可核销');
        }
        Db::name('order_cards')->where('id', $card['id'])->update([
            'status'      => 1,
            'used_at'     => $now,
            'updated_at'  => $now,
        ]);
        $record = $this->createRecord('card', $code, [
            'id'             => $card['order_id'],
            'order_no'       => $card['order_no'],
            'user_id'        => $card['user_id'],
            'receiver_name'  => $card['contact_name'],
            'receiver_phone' => $card['contact_phone'],
        ], $verifierId, $now);
        return ['record' => $record];
    }

    private function verifyCoupon(string $code, int $verifierId, string $now): array
    {
        $coupon = Db::name('user_coupons')->where('code', $code)->find();
        if (!$coupon) {
            throw new \Exception('未找到优惠券');
        }
        if ((int) $coupon['status'] !== 0) {
            throw new \Exception('该优惠券已被使用');
        }
        Db::name('user_coupons')->where('id', $coupon['id'])->update([
            'status'     => 1,
            'used_at'    => $now,
            'updated_at' => $now,
        ]);
        $record = $this->createRecord('coupon', $code, [
            'id'             => 0,
            'order_no'       => '',
            'user_id'        => $coupon['user_id'],
            'receiver_name'  => '',
            'receiver_phone' => '',
        ], $verifierId, $now);
        return ['record' => $record];
    }

    private function createRecord(string $type, string $code, array $order, int $verifierId, string $now): array
    {
        $verifier = Db::name('admin_users')->where('id', $verifierId)->find();
        $data = [
            'verify_type'   => $type,
            'code'          => $code,
            'order_id'      => $order['id'] ?? 0,
            'order_no'      => $order['order_no'] ?? '',
            'user_id'       => $order['user_id'] ?? 0,
            'user_name'     => $order['receiver_name'] ?? '',
            'phone'         => $order['receiver_phone'] ?? '',
            'verifier_id'   => $verifierId,
            'verifier_name' => $verifier ? ($verifier['username'] ?? '') : '',
            'verified_at'   => $now,
        ];
        $id = Db::name('verify_records')->insertGetId($data);
        $data['id'] = $id;
        return $data;
    }

    public function recordList(int $page, int $pageSize, string $type, ?string $keyword): array
    {
        $q = Db::name('verify_records');
        if ($type && $type !== 'all') {
            $q->where('verify_type', $type);
        }
        if ($keyword) {
            $q->where(function ($query) use ($keyword) {
                $query->where('code', 'like', "%{$keyword}%")
                      ->whereOr('order_no', 'like', "%{$keyword}%")
                      ->whereOr('user_name', 'like', "%{$keyword}%")
                      ->whereOr('phone', 'like', "%{$keyword}%");
            });
        }
        $total = $q->count();
        $rows  = $q->order('id desc')->page($page, $pageSize)->select()->toArray();
        $list  = array_map(function ($row) {
            $row['type_text'] = $this->typeText($row['verify_type']);
            return $row;
        }, $rows);
        return [
            'list'      => $list,
            'total'     => (int) $total,
            'page'      => $page,
            'page_size' => $pageSize,
            'last_page' => max(1, (int) ceil($total / $pageSize)),
        ];
    }

    public function typeText(string $type): string
    {
        $map = ['pickup' => '到店自提', 'card' => '电子卡券', 'coupon' => '优惠券'];
        return $map[$type] ?? '未知';
    }
}
