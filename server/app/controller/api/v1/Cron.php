<?php
namespace app\controller\api\v1;

use app\common\controller\ApiController;
use app\service\OrderService;
use app\service\SettingsService;

class Cron extends ApiController
{
    /**
     * GET /api/v1/cron/trade?token=xxx
     * 交易自动化定时任务：未支付超时取消 + 已发货超时自动确认收货
     * 由外部计划任务（crontab / 宝塔 / 云函数）按固定频率带 token 触发。
     */
    public function trade()
    {
        $token = input('get.token', '');
        $expect = env('CRON_TOKEN', 'trade2026');
        if ($token !== $expect) {
            return $this->fail('unauthorized', 401);
        }
        $s = SettingsService::load();
        $cancel  = OrderService::cancelExpiredOrders((int) ($s['auto_cancel_minutes'] ?? 0));
        $confirm = OrderService::autoConfirmReceived((int) ($s['auto_receive_days'] ?? 0));
        return $this->ok([
            'canceled'       => $cancel,
            'auto_confirmed' => $confirm,
        ], 'ok');
    }
}
