<?php
namespace app\controller\api\v1;

use app\common\controller\ApiController;

class Order extends ApiController
{
    /** POST /api/v1/order/preview  {items:[{sku_id,quantity}], address:{...}} */
    public function preview()
    {
        $user   = $this->authUser();
        $items  = input('post.items/a', []);
        $address = input('post.address/a', []);
        $delivery = input('post.delivery', 'express');
        if (empty($items)) {
            return $this->fail('请选择商品', 422);
        }
        try {
            $data = (new \app\service\OrderService())->preview($user['id'], $items, $address, $delivery);
        } catch (\Exception $e) {
            return $this->fail($e->getMessage(), 400);
        }
        return $this->ok($data);
    }

    /** POST /api/v1/order  {items, address} */
    public function create()
    {
        $user    = $this->authUser();
        $items   = input('post.items/a', []);
        $address = input('post.address/a', []);
        if (empty($items)) {
            return $this->fail('请选择商品', 422);
        }
        $meta = [
            'pay_method' => input('post.pay_method', 'wechat'),
            'platform'   => input('post.platform', ''),
            'delivery'   => input('post.delivery', 'express'),
            'pickup_point_id' => input('post.pickup_point_id', 0),
        ];
        try {
            $data = (new \app\service\OrderService())->create($user['id'], $items, $address, $meta);
        } catch (\Exception $e) {
            return $this->fail($e->getMessage(), 400);
        }
        return $this->ok($data, '下单成功');
    }

    /** GET /api/v1/order */
    public function index()
    {
        $user = $this->authUser();
        $page = input('get.page/d', 1);
        $size = input('get.page_size/d', 10);
        $data = (new \app\service\OrderService())->index($user['id'], $page, $size);
        return $this->ok($data);
    }

    /** GET /api/v1/order/counts  会员中心各状态订单数量 */
    public function counts()
    {
        $user = $this->authUser();
        $data = (new \app\service\OrderService())->counts($user['id']);
        return $this->ok($data);
    }

    /** GET /api/v1/order/:id */
    public function detail($id)
    {
        $user = $this->authUser();
        $data = (new \app\service\OrderService())->detail($user['id'], (int) $id);
        if (!$data) {
            return $this->fail('订单不存在', 404);
        }
        return $this->ok($data);
    }
}
