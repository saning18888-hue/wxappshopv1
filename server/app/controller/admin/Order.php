<?php
namespace app\controller\admin;

use app\common\controller\AdminController;

/**
 * 订单管理（后台）：全部订单列表、详情、改状态（取消时回滚库存）
 */
class Order extends AdminController
{
    public function index()
    {
        $status = input('get.status/d', -1);
        $page   = input('get.page/d', 1);
        $size   = input('get.page_size/d', 20);
        $data   = (new \app\service\OrderService())->adminList(
            $page, $size, $status < 0 ? null : $status
        );
        return $this->ok($data);
    }

    public function detail($id)
    {
        $d = (new \app\service\OrderService())->adminDetail(intval($id));
        if (!$d) {
            return $this->fail('订单不存在', 404);
        }
        return $this->ok($d);
    }

    public function changeStatus($id)
    {
        $d     = $this->body();
        $status = intval($d['status'] ?? 0);
        (new \app\service\OrderService())->changeStatus(intval($id), $status);
        return $this->ok();
    }
}
