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
        return [
            'id'           => $g['id'],
            'title'        => $g['title'],
            'subtitle'     => $g['subtitle'],
            'price'        => floatval($g['price'] / 100),
            'market_price' => floatval($g['market_price'] / 100),
            'stock'        => (int) $g['stock'],
            'sales'        => (int) $g['sales'],
            'cover'        => $images[0] ?? '',
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
        Db::name('goods_skus')->where(['goods_id' => $id, 'spec_value_ids' => ''])
            ->update(['price' => $fields['price'], 'stock' => $fields['stock'], 'image' => $cover]);
    }

    public function remove(int $id): void
    {
        Db::name('goods')->where('id', $id)->update(['status' => 0, 'updated_at' => date('Y-m-d H:i:s')]);
    }
}
