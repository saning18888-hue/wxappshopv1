<?php
namespace app\controller\api\v1;

use app\common\controller\ApiController;

/**
 * 商品评价（用户端）
 * 评价闭环：用户在「已完成」订单下对购买的商品发表评价 → 写入 goods_reviews
 * → 商品详情页展示 → 运营后台「评论管理」可回复/隐藏/删除。
 */
class Review extends ApiController
{
    /** POST /api/v1/reviews  {order_id, goods_id, rating, content, images?} */
    public function create()
    {
        $user = $this->authUser();
        $post = input('post.');
        try {
            $id = (new \app\service\ReviewService())->create($user, $post);
        } catch (\Exception $e) {
            return $this->fail($e->getMessage(), 400);
        }
        return $this->ok(['id' => $id], '评价成功');
    }

    /** GET /api/v1/reviews/mine  我的评价列表 */
    public function mine()
    {
        $user = $this->authUser();
        $page = input('get.page/d', 1);
        $size = input('get.page_size/d', 20);
        $data = (new \app\service\ReviewService())->mine($user['id'], $page, $size);
        return $this->ok($data);
    }
}
