<?php
namespace app\controller\admin;

use app\common\controller\AdminController;

/**
 * 商品管理（后台）：列表（含下架）、新增/编辑、删除（软下架）
 */
class Goods extends AdminController
{
    public function index()
    {
        $catId = input('get.category_id/d', 0);
        $kw    = input('get.keyword/s', '');
        $page  = input('get.page/d', 1);
        $size  = input('get.page_size/d', 20);
        $data  = (new \app\service\GoodsService())->adminList(
            $catId ?: null, $kw ?: null, $page, $size
        );
        return $this->ok($data);
    }

    public function save()
    {
        $d     = $this->body();
        $id    = intval($d['id'] ?? 0);
        $title = trim($d['title'] ?? '');
        if ($title === '') {
            return $this->fail('商品标题不能为空');
        }
        $price  = intval(floatval($d['price'] ?? 0) * 100);
        $market = intval(floatval($d['market_price'] ?? 0) * 100);
        $stock  = intval($d['stock'] ?? 0);
        $images = isset($d['images']) && is_array($d['images']) ? $d['images'] : [];
        $cover  = $images[0] ?? '';

        $fields = [
            'title'        => $title,
            'subtitle'     => trim($d['subtitle'] ?? ''),
            'category_id'  => intval($d['category_id'] ?? 0),
            'price'        => $price,
            'market_price' => $market,
            'stock'        => $stock,
            'images'       => json_encode($images, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
            'detail'       => $d['detail_html'] ?? '',
            'status'       => intval($d['status'] ?? 1),
            'updated_at'   => date('Y-m-d H:i:s'),
        ];

        $svc = new \app\service\GoodsService();
        if ($id) {
            $svc->update($id, $fields, $cover);
        } else {
            $id = $svc->create($fields, $cover, $price, $stock);
        }
        return $this->ok(['id' => $id]);
    }

    public function remove($id)
    {
        (new \app\service\GoodsService())->remove(intval($id));
        return $this->ok();
    }
}
