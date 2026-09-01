<?php
namespace app\controller\admin;

use app\common\controller\AdminController;

/**
 * 商品管理（后台）：列表（含下架）、新增/编辑、详情、删除（软下架）
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

    public function detail($id)
    {
        $id = intval($id);
        $svc = new \app\service\GoodsService();
        $g = $svc->adminDetail($id);
        if (!$g) {
            return $this->fail('商品不存在');
        }
        return $this->ok($g);
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
        $cost   = intval(floatval($d['cost_price'] ?? 0) * 100);
        $stock  = intval($d['stock'] ?? 0);
        $images = isset($d['images']) && is_array($d['images']) ? $d['images'] : [];
        $cover  = $images[0] ?? '';

        $ext = isset($d['ext_json']) && is_array($d['ext_json']) ? $d['ext_json'] : [];

        $fields = [
            'title'        => $title,
            'subtitle'     => trim($d['subtitle'] ?? ''),
            'promotion'    => trim($ext['promo'] ?? ''),
            'category_id'  => intval($d['category_id'] ?? 0),
            'price'        => $price,
            'market_price' => $market,
            'stock'        => $stock,
            'images'       => json_encode($images, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
            'detail'       => $d['detail_html'] ?? '',
            'video'        => is_array($d['video'] ?? null) ? json_encode($d['video'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : ($d['video'] ?? ''),
            'ext_json'     => json_encode($ext, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
            'status'       => intval($d['status'] ?? 1),
            'updated_at'   => date('Y-m-d H:i:s'),
        ];

        $svc = new \app\service\GoodsService();
        if ($id) {
            $svc->update($id, $fields, $cover);
        } else {
            $id = $svc->create($fields, $cover, $price, $stock);
        }

        // 规格/SKU/属性
        $specs = isset($d['specs']) && is_array($d['specs']) ? $d['specs'] : [];
        $skus  = isset($d['skus']) && is_array($d['skus']) ? $d['skus'] : [];
        $attrs = isset($d['attrs']) && is_array($d['attrs']) ? $d['attrs'] : [];
        $svc->saveSpecsAndSkus($id, $specs, $skus);
        $svc->saveAttrs($id, $attrs);

        return $this->ok(['id' => $id]);
    }

    public function remove($id)
    {
        (new \app\service\GoodsService())->remove(intval($id));
        return $this->ok();
    }

    // ---------- 商品规格管理 ----------

    public function specList()
    {
        $kw = input('get.keyword/s', '');
        return $this->ok((new \app\service\GoodsService())->specList($kw ?: null));
    }

    public function specDetail($id)
    {
        $d = (new \app\service\GoodsService())->specDetail(intval($id));
        if (!$d) {
            return $this->fail('规格不存在');
        }
        return $this->ok($d);
    }

    public function specSave()
    {
        try {
            $d  = $this->body();
            $id = intval($d['id'] ?? 0);
            $newId = (new \app\service\GoodsService())->specSave($id ?: null, $d);
            return $this->ok(['id' => $newId]);
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function specDelete($id)
    {
        try {
            (new \app\service\GoodsService())->specDelete(intval($id));
            return $this->ok();
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function specSetDefault($id)
    {
        try {
            $d = $this->body();
            (new \app\service\GoodsService())->specSetDefault(intval($id), intval($d['default_spec'] ?? 1));
            return $this->ok();
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function specMove($id)
    {
        try {
            $d = $this->body();
            (new \app\service\GoodsService())->specMove(intval($id), $d['dir'] ?? 'up');
            return $this->ok();
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    // ---------- 商品属性管理 ----------

    public function attrList()
    {
        $kw = input('get.keyword/s', '');
        return $this->ok((new \app\service\GoodsService())->attrList($kw ?: null));
    }

    public function attrDetail($id)
    {
        $d = (new \app\service\GoodsService())->attrDetail(intval($id));
        if (!$d) {
            return $this->fail('属性不存在');
        }
        return $this->ok($d);
    }

    public function attrSave()
    {
        try {
            $d  = $this->body();
            $id = intval($d['id'] ?? 0);
            $newId = (new \app\service\GoodsService())->attrSave($id ?: null, $d);
            return $this->ok(['id' => $newId]);
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function attrDelete($id)
    {
        try {
            (new \app\service\GoodsService())->attrDelete(intval($id));
            return $this->ok();
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function attrSetDefault($id)
    {
        try {
            $d = $this->body();
            (new \app\service\GoodsService())->attrSetDefault(intval($id), intval($d['default_attr'] ?? 1));
            return $this->ok();
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function attrMove($id)
    {
        try {
            $d = $this->body();
            (new \app\service\GoodsService())->attrMove(intval($id), $d['dir'] ?? 'up');
            return $this->ok();
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }
}
