<?php
namespace app\service;

use think\facade\Db;

/**
 * 支付服务（开发态提供 Mock 回调，真实环境接入微信支付）
 */
class PaymentService
{
    /** 真实环境：服务端生成微信支付 JSAPI 参数（预留） */
    public function buildPayParams(int $orderId): array
    {
        // TODO: 调用微信统一下单，返回 wx.requestPayment 所需参数
        throw new \Exception('真实微信支付待配置商户号后接入');
    }

    /** 开发态 Mock 支付回调：幂等，重复调用安全 */
    public function mockNotify(string $orderNo): bool
    {
        $order = Db::name('orders')->where('order_no', $orderNo)->find();
        if (!$order) {
            return false;
        }
        if ($order['status'] != 0) {
            return true; // 已支付，幂等返回成功
        }
        Db::startTrans();
        try {
            Db::name('orders')->where('id', $order['id'])->update([
                'status'     => 1, // 已付款/待履约
                'pay_time'   => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ]);
            Db::name('order_payments')->where('order_id', $order['id'])->update([
                'status'  => 1,
                'pay_no'  => 'MOCK' . date('YmdHis'),
                'paid_at' => date('Y-m-d H:i:s'),
            ]);
            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            throw $e;
        }
        return true;
    }
}
