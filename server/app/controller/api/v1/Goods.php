<?php
namespace app\controller\api\v1;

use app\common\controller\ApiController;

class Goods extends ApiController
{
    /** GET /api/v1/goods  ?category_id=&keyword=&sort=&page= */
    public function index()
    {
        $catId    = input('get.category_id/d', 0);
        $keyword  = input('get.keyword/s', '');
        $sort     = input('get.sort/s', 'new');
        $page     = input('get.page/d', 1);
        $pageSize = input('get.page_size/d', 10);
        $data = (new \app\service\GoodsService())->list(
            $catId ?: null, $keyword ?: null, $sort, $page, $pageSize
        );
        return $this->ok($data);
    }

    /** GET /api/v1/goods/:id */
    public function detail($id)
    {
        $detail = (new \app\service\GoodsService())->detail((int) $id);
        if (!$detail) {
            return $this->fail('商品不存在或已下架', 404);
        }
        return $this->ok($detail);
    }
}
