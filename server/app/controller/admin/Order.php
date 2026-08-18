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
}
