<?php
namespace app\service;

use think\facade\Db;

/**
 * 商品服务：列表、详情、SKU/规格
 * 金额统一以「分」存储，对外输出转换为「元」
 */
class GoodsService
{
    public function list(?int $catId, ?string $keyword, ?string $sort, int $page, int $pageSize): array
    {
        $q = Db::name('goods')->where('status', 1);
        if ($catId) {
            $q->where('category_id', $catId);
        }
        if ($keyword) {
            $q->where('title', 'like', "%{$keyword}%");
        }
        $total = $q->count();
        $sortMap = [
            'new'        => 'id desc',
            'price_asc'  => 'price asc',
            'price_desc' => 'price desc',
            'sales'      => 'sales desc',
        ];
        $order = $sortMap[$sort] ?? 'id desc';
        $rows  = $q->order($order)->page($page, $pageSize)->select();

        return [
            'list'      => array_map([$this, 'formatList'], $rows->toArray()),
            'total'     => (int) $total,
            'page'      => $page,
            'page_size' => $pageSize,
        ];
    }

    public function detail(int $id): ?array
    {
        $g = Db::name('goods')->where('id', $id)->where('status', 1)->find();
        if (!$g) {
            return null;
        }
        $specs  = Db::name('goods_specs')->where('goods_id', $id)->select()->toArray();
        $values = Db::name('goods_spec_values')->where('goods_id', $id)->select()->toArray();
        $skus   = Db::name('goods_skus')->where('goods_id', $id)->select()->toArray();

        $specGroups = [];
        foreach ($specs as $s) {
            $vals = array_values(array_filter($values, fn($v) => $v['spec_id'] == $s['id']));
            $specGroups[] = [
                'id'     => $s['id'],
                'name'   => $s['name'],
                'values' => $vals,
            ];
        }
        $images = json_decode($g['images'] ?? '[]', true) ?: [];

        return [
            'id'           => $g['id'],
            'title'        => $g['title'],
            'subtitle'     => $g['subtitle'],
            'price'        => floatval($g['price'] / 100),
            'market_price' => floatval($g['market_price'] / 100),
            'stock'        => (int) $g['stock'],
            'sales'        => (int) $g['sales'],
            'images'       => $images,
            'video'        => $g['video'],
            'detail_html'  => $g['detail'],
            'spec_groups'  => $specGroups,
            'skus'         => $skus,
        ];
    }

    private function formatList($g): array
    {
        $images = json_decode($g['images'] ?? '[]', true) ?: [];
        $ext    = json_decode($g['ext_json'] ?? '{}', true) ?: [];
        return [
            'id'           => $g['id'],
            'title'        => $g['title'],
            'subtitle'     => $g['subtitle'],
            'price'        => floatval($g['price'] / 100),
            'market_price' => floatval($g['market_price'] / 100),
            'stock'        => (int) $g['stock'],
            'sales'        => (int) $g['sales'],
            'cover'        => $images[0] ?? '',
            'ext_json'     => $ext,
        ];
    }

    // ---------- 后台管理（含下架商品）----------

    public function adminList(?int $catId, ?string $keyword, int $page, int $pageSize): array
    {
        $q = Db::name('goods');
        if ($catId) {
            $q->where('category_id', $catId);
        }
        if ($keyword) {
            $q->where('title', 'like', "%{$keyword}%");
        }
        $total = $q->count();
        $rows  = $q->order('id desc')->page($page, $pageSize)->select();
        return [
            'list'      => array_map([$this, 'formatList'], $rows->toArray()),
            'total'     => (int) $total,
            'page'      => $page,
            'page_size' => $pageSize,
        ];
    }

    public function create(array $fields, string $cover, int $price, int $stock): int
    {
        $fields['created_at'] = date('Y-m-d H:i:s');
        $id = Db::name('goods')->insertGetId($fields);
        // 默认 SKU（保证小程序下单可用）
        Db::name('goods_skus')->insert([
            'goods_id'       => $id,
            'price'          => $price,
            'stock'          => $stock,
            'spec_value_ids' => '',
            'image'          => $cover,
            'created_at'     => date('Y-m-d H:i:s'),
        ]);
        return $id;
    }

    public function update(int $id, array $fields, string $cover): void
    {
        Db::name('goods')->where('id', $id)->update($fields);
    }

    public function adminDetail(int $id): ?array
    {
        $g = Db::name('goods')->where('id', $id)->find();
        if (!$g) {
            return null;
        }
        $images = json_decode($g['images'] ?? '[]', true) ?: [];
        $video  = $g['video'] ?? '';
        if ($video !== '' && ($video[0] === '{' || $video[0] === '[')) {
            $video = json_decode($video, true) ?: [];
        }
        $ext = json_decode($g['ext_json'] ?? '{}', true) ?: [];

        // 规格与 SKU
        $specs  = Db::name('goods_specs')->where('goods_id', $id)->order('sort asc,id asc')->select()->toArray();
        $values = Db::name('goods_spec_values')->where('goods_id', $id)->order('sort asc,id asc')->select()->toArray();
        $skus   = Db::name('goods_skus')->where('goods_id', $id)->order('id asc')->select()->toArray();
        $specGroups = [];
        foreach ($specs as $s) {
            $vals = array_values(array_filter($values, fn($v) => $v['spec_id'] == $s['id']));
            $specGroups[] = [
                'id'     => $s['id'],
                'name'   => $s['name'],
                'values' => array_map(fn($v) => ['id' => $v['id'], 'value' => $v['value']], $vals),
            ];
        }
        $skus = array_map(function ($s) {
            return [
                'id'               => $s['id'],
                'spec_value_ids'   => $s['spec_value_ids'],
                'price'            => floatval($s['price'] / 100),
                'market_price'     => floatval($s['market_price'] / 100),
                'stock'            => (int) $s['stock'],
                'image'            => $s['image'],
            ];
        }, $skus);

        // 商品属性
        $attrs = Db::name('goods_attrs')->where('goods_id', $id)->order('sort asc,id asc')->select()->toArray();
        $attrs = array_map(function ($a) {
            return [
                'id'       => $a['id'],
                'name'     => $a['name'],
                'values'   => json_decode($a['values'] ?? '[]', true) ?: [],
                'used'     => (int) $a['used'],
                'sort'     => (int) $a['sort'],
            ];
        }, $attrs);

        return [
            'id'           => $g['id'],
            'title'        => $g['title'],
            'subtitle'     => $g['subtitle'],
            'category_id'  => (int) $g['category_id'],
            'price'        => floatval($g['price'] / 100),
            'market_price' => floatval($g['market_price'] / 100),
            'stock'        => (int) $g['stock'],
            'sales'        => (int) $g['sales'],
            'images'       => $images,
            'video'        => $video,
            'detail_html'  => $g['detail'],
            'status'       => (int) $g['status'],
            'ext_json'     => $ext,
            'spec_groups'  => $specGroups,
            'skus'         => $skus,
            'attrs'        => $attrs,
        ];
    }

    /**
     * 保存规格与 SKU（全量覆盖）
     */
    public function saveSpecsAndSkus(int $goodsId, array $specs, array $skus): void
    {
        Db::name('goods_spec_values')->where('goods_id', $goodsId)->delete();
        Db::name('goods_specs')->where('goods_id', $goodsId)->delete();
        Db::name('goods_skus')->where('goods_id', $goodsId)->delete();

        $vidMap = []; // tempId => realId
        $sort = 0;
        foreach ($specs as $sp) {
            $specId = Db::name('goods_specs')->insertGetId([
                'goods_id'   => $goodsId,
                'name'       => $sp['name'] ?? '',
                'sort'       => $sort++,
                'created_at' => date('Y-m-d H:i:s'),
            ]);
            foreach ($sp['values'] ?? [] as $i => $v) {
                $tid = $v['id'] ?? ('tmp_' . $i);
                $vid = Db::name('goods_spec_values')->insertGetId([
                    'goods_id'   => $goodsId,
                    'spec_id'    => $specId,
                    'value'      => $v['value'] ?? '',
                    'sort'       => $i,
                    'created_at' => date('Y-m-d H:i:s'),
                ]);
                $vidMap[(string) $tid] = (string) $vid;
            }
        }

        if (empty($specs) && empty($skus)) {
            // 保持默认 SKU
            $g = Db::name('goods')->where('id', $goodsId)->find();
            Db::name('goods_skus')->insert([
                'goods_id'       => $goodsId,
                'price'          => $g['price'],
                'market_price'   => $g['market_price'],
                'stock'          => $g['stock'],
                'spec_value_ids' => '',
                'image'          => json_decode($g['images'] ?? '[]', true)[0] ?? '',
                'created_at'     => date('Y-m-d H:i:s'),
            ]);
            return;
        }

        foreach ($skus as $s) {
            $ids = $s['spec_value_ids'] ?? '';
            if (is_array($ids)) {
                $ids = implode(',', array_map(fn($x) => $vidMap[(string) $x] ?? $x, $ids));
            }
            Db::name('goods_skus')->insert([
                'goods_id'       => $goodsId,
                'price'          => intval(floatval($s['price'] ?? 0) * 100),
                'market_price'   => intval(floatval($s['market_price'] ?? 0) * 100),
                'stock'          => intval($s['stock'] ?? 0),
                'spec_value_ids' => $ids,
                'image'          => $s['image'] ?? '',
                'created_at'     => date('Y-m-d H:i:s'),
            ]);
        }
    }

    /**
     * 保存商品属性（全量覆盖）
     */
    public function saveAttrs(int $goodsId, array $attrs): void
    {
        Db::name('goods_attrs')->where('goods_id', $goodsId)->delete();
        foreach ($attrs as $i => $a) {
            Db::name('goods_attrs')->insert([
                'goods_id'   => $goodsId,
                'name'       => $a['name'] ?? '',
                'values'     => json_encode($a['values'] ?? [], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                'used'       => intval($a['used'] ?? 0),
                'sort'       => intval($a['sort'] ?? $i),
                'created_at' => date('Y-m-d H:i:s'),
            ]);
        }
    }

    public function remove(int $id): void
    {
        Db::name('goods')->where('id', $id)->update(['status' => 0, 'updated_at' => date('Y-m-d H:i:s')]);
    }
}
