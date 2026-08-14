<?php
namespace app\controller\api\v1;

use app\common\controller\ApiController;

class Cart extends ApiController
{
    /** GET /api/v1/cart */
    public function index()
    {
        $user = $this->authUser();
        $data = (new \app\service\CartService())->list($user['id']);
        return $this->ok($data);
    }

    /** POST /api/v1/cart  {sku_id, quantity} */
    public function add()
    {
        $user = $this->authUser();
        $skuId = input('post.sku_id/d', 0);
        $qty   = input('post.quantity/d', 1);
        if ($skuId <= 0 || $qty <= 0) {
            return $this->fail('参数错误', 422);
        }
        try {
            (new \app\service\CartService())->add($user['id'], $skuId, $qty);
        } catch (\Exception $e) {
            return $this->fail($e->getMessage(), 400);
        }
        return $this->ok([], '已加入购物车');
    }

    /** PUT /api/v1/cart/:id  {quantity} */
    public function update($id)
    {
        $user = $this->authUser();
        $qty  = input('put.quantity/d', 1);
        try {
            (new \app\service\CartService())->update((int) $id, $user['id'], $qty);
        } catch (\Exception $e) {
            return $this->fail($e->getMessage(), 400);
        }
        return $this->ok([], 'ok');
    }

    /** DELETE /api/v1/cart/:id */
    public function remove($id)
    {
        $user = $this->authUser();
        (new \app\service\CartService())->remove((int) $id, $user['id']);
        return $this->ok([], '已移除');
    }
}
