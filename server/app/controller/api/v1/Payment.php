<?php
namespace app\controller\api\v1;

use app\common\controller\ApiController;

class Payment extends ApiController
{
    /** POST /api/v1/payment/mock_notify  {order_no}  开发态模拟微信支付回调 */
    public function mockNotify()
    {
        $orderNo = input('post.order_no', '');
        if (!$orderNo) {
            return $this->fail('缺少 order_no', 422);
        }
        $ok = (new \app\service\PaymentService())->mockNotify($orderNo);
        if (!$ok) {
            return $this->fail('订单不存在', 404);
        }
        return $this->ok(['paid' => true], '支付成功');
    }
}
