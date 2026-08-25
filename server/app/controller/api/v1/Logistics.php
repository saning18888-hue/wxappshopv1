<?php
namespace app\controller\api\v1;

use app\common\controller\ApiController;
use app\service\LogisticsService;
use app\service\OrderService;

class Logistics extends ApiController
{
    /** GET /api/v1/logistics/track?order_id=xxx  或  ?company=顺丰速运&no=xxx&phone=1234 */
    public function track()
    {
        $orderId = input('order_id/d', 0);
        $company = (string) input('company/s', '');
        $no      = (string) input('no/s', '');
        $phone   = (string) input('phone/s', '');

        if ($orderId) {
            $user = $this->authUser();
            $order = (new OrderService())->detail($user['id'], $orderId);
            if (!$order) {
                return $this->fail('订单不存在', 404);
            }
            $company = $order['shipping_company'] ?? '';
            $no      = $order['shipping_no'] ?? '';
            $p = $order['receiver_phone'] ?? '';
            $phone = $p ? mb_substr($p, -4) : '';   // 取手机号后四位（部分接口需要）
        }

        if (!$no) {
            return $this->ok(['company' => $company, 'no' => '', 'state' => 0, 'state_text' => '未发货', 'traces' => []], '暂无物流信息');
        }

        $res = LogisticsService::track($company, $no, $phone);
        if (!$res['success']) {
            return $this->fail($res['message'], 400);
        }
        return $this->ok($res['data']);
    }
}
