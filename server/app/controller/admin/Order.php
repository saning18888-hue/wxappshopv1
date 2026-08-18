<?php
namespace app\controller\admin;

use app\common\controller\AdminController;

/**
 * 订单管理（后台）
 */
class Order extends AdminController
{
    public function index()
    {
        $status   = input('get.status/d', -1);
        $keyword  = input('get.keyword/s', '');
        $page     = input('get.page/d', 1);
        $size     = input('get.page_size/d', 20);
        $data     = (new \app\service\OrderService())->adminList(
            $page, $size, $status < 0 ? null : $status, $keyword
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

    public function save($id)
    {
        try {
            $d = $this->body();
            (new \app\service\OrderService())->adminSave(intval($id), $d);
            return $this->ok();
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function changeStatus($id)
    {
        try {
            $d      = $this->body();
            $status = intval($d['status'] ?? 0);
            (new \app\service\OrderService())->changeStatus(intval($id), $status);
            return $this->ok();
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function batchDelete()
    {
        try {
            $ids = $this->body()['ids'] ?? [];
            (new \app\service\OrderService())->batchDelete(array_map('intval', $ids));
            return $this->ok();
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function batchShip()
    {
        try {
            $data = $this->body();
            (new \app\service\OrderService())->batchShip(
                $data['orders'] ?? [],
                $data['ship_type'] ?? 'express',
                $data['shipping_company'] ?? '',
                $data['shipping_no'] ?? '',
                $data['rows'] ?? []
            );
            return $this->ok();
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function create()
    {
        try {
            $d = $this->body();
            $res = (new \app\service\OrderService())->adminCreate($d);
            return $this->ok($res);
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    /**
     * 售后订单列表
     */
    public function aftersale()
    {
        $tab     = input('get.tab/s', 'all');
        $keyword = input('get.keyword/s', '');
        $page    = input('get.page/d', 1);
        $size    = input('get.page_size/d', 20);
        $data    = (new \app\service\OrderService())->adminAftersaleList(
            $page, $size, $tab, $keyword
        );
        return $this->ok($data);
    }

    /**
     * 售后订单：标记退款完成
     */
    public function refund($id)
    {
        try {
            $d      = $this->body();
            $amount = floatval($d['amount'] ?? 0);
            $reason = trim($d['reason'] ?? '');
            (new \app\service\OrderService())->refundOrder(intval($id), $amount, $reason);
            return $this->ok();
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    /**
     * 售后订单：软删除（移入回收站）
     */
    public function softDelete()
    {
        try {
            $ids = $this->body()['ids'] ?? [];
            (new \app\service\OrderService())->softDeleteOrders(array_map('intval', $ids));
            return $this->ok();
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    /**
     * 售后订单：恢复（从回收站移出）
     */
    public function restore()
    {
        try {
            $ids = $this->body()['ids'] ?? [];
            (new \app\service\OrderService())->restoreOrders(array_map('intval', $ids));
            return $this->ok();
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }
}
