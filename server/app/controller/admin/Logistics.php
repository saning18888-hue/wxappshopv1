<?php
namespace app\controller\admin;

use app\common\controller\AdminController;
use app\service\LogisticsService;

/**
 * 物流对接（后台）：测试当前配置的接口是否可用
 */
class Logistics extends AdminController
{
    /** POST /admin/logistics/test */
    public function test()
    {
        $res = LogisticsService::test();
        if (!$res['success']) {
            return $this->fail($res['message']);
        }
        return $this->ok([], $res['message']);
    }
}
