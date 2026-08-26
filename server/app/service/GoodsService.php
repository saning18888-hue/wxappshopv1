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
        // SKU 价格分→元
        $skus = array_map(function ($s) {
            $s['price'] = floatval($s['price'] / 100);
            return $s;
        }, $skus);

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

        // 商品属性（与后台 adminDetail 一致，直接按 goods_id 取）
        $attrs = Db::name('goods_attrs')->where('goods_id', $id)->order('sort asc, id asc')->select()->toArray();
        $attrs = array_map(function ($a) {
            return [
                'id'     => $a['id'],
                'name'   => $a['name'],
                'values' => json_decode($a['attr_values'] ?? '[]', true) ?: [],
            ];
        }, $attrs);

        // 商品评价（仅展示未隐藏的，最多 20 条）
        $reviews = Db::name('goods_reviews')
            ->where('goods_id', $id)
            ->where('is_hidden', 0)
            ->order('id desc')
            ->limit(20)
            ->select()->toArray();
        $reviews = array_map(function ($r) {
            return [
                'id'         => $r['id'],
                'user_name'  => $r['user_name'] ?: '匿名用户',
                'avatar'     => $r['avatar'] ?: '',
                'rating'     => (int) $r['rating'],
                'content'    => $r['content'],
                'images'     => json_decode($r['images'] ?? '[]', true) ?: [],
                'reply'      => $r['reply'] ?: '',
                'created_at' => $r['created_at'],
            ];
        }, $reviews);

        return [
            'id'           => $g['id'],
            'title'        => $g['title'],
            'subtitle'     => $g['subtitle'],
            'price'        => floatval($g['price'] / 100),
            'market_price' => floatval($g['market_price'] / 100),
            'stock'        => (int) $g['stock'],
            'sales'        => (int) $g['sales'],
            'promotion'    => $g['promotion'] ?? '',
            'images'       => $images,
            'video'        => $g['video'],
            'detail_html'  => $g['detail'],
            'spec_groups'  => $specGroups,
            'skus'         => $skus,
            'attrs'        => $attrs,
            'reviews'      => $reviews,
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
                'values'   => json_decode($a['attr_values'] ?? '[]', true) ?: [],
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
                'attr_values' => json_encode($a['values'] ?? [], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
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

    // ---------- 商品规格管理（独立菜单）----------

    public function specList(?string $keyword): array
    {
        $q = Db::name('goods_specs')->alias('s')
            ->field("s.*, GROUP_CONCAT(v.value, ',') as values_text")
            ->leftJoin('goods_spec_values v', 'v.spec_id=s.id')
            ->group('s.id')
            ->order('s.sort', 'asc')
            ->order('s.id', 'asc');
        if ($keyword) {
            $q->where('s.name', 'like', "%{$keyword}%");
        }
        $rows = $q->select()->toArray();
        foreach ($rows as &$r) {
            $r['values_text'] = trim(str_replace(',', ',', $r['values_text'] ?? ''), ',');
        }
        return $rows;
    }

    public function specDetail(int $id): ?array
    {
        $spec = Db::name('goods_specs')->where('id', $id)->find();
        if (!$spec) {
            return null;
        }
        $spec['values'] = Db::name('goods_spec_values')
            ->where('spec_id', $id)
            ->order('sort', 'asc')
            ->order('id', 'asc')
            ->select()
            ->toArray();
        return $spec;
    }

    public function specSave(?int $id, array $data): int
    {
        $name = trim($data['name'] ?? '');
        if ($name === '') {
            throw new \Exception('规格名称不能为空');
        }
        $values = array_values(array_filter(array_map(function ($v) {
            $value = trim($v['value'] ?? '');
            return $value === '' ? null : [
                'id'   => intval($v['id'] ?? 0),
                'value'=> $value,
                'sort' => intval($v['sort'] ?? 0),
            ];
        }, $data['values'] ?? [])));
        if (empty($values)) {
            throw new \Exception('至少需要一个规格值');
        }
        $default = intval($data['default_spec'] ?? 1);
        $sort    = intval($data['sort'] ?? 0);

        Db::startTrans();
        try {
            if ($id) {
                $exists = Db::name('goods_specs')->where('name', $name)->where('id', '<>', $id)->find();
                if ($exists) {
                    throw new \Exception('规格名称已存在');
                }
                Db::name('goods_specs')->where('id', $id)->update([
                    'name'         => $name,
                    'default_spec' => $default,
                    'sort'         => $sort,
                    'updated_at'   => date('Y-m-d H:i:s'),
                ]);
            } else {
                $exists = Db::name('goods_specs')->where('name', $name)->find();
                if ($exists) {
                    throw new \Exception('规格名称已存在');
                }
                $id = Db::name('goods_specs')->insertGetId([
                    'name'         => $name,
                    'default_spec' => $default,
                    'sort'         => $sort,
                    'created_at'   => date('Y-m-d H:i:s'),
                ]);
            }
            // 全量覆盖规格值
            Db::name('goods_spec_values')->where('spec_id', $id)->delete();
            foreach ($values as $i => $v) {
                Db::name('goods_spec_values')->insert([
                    'spec_id'    => $id,
                    'goods_id'   => 0,
                    'value'      => $v['value'],
                    'sort'       => $i,
                    'created_at' => date('Y-m-d H:i:s'),
                ]);
            }
            Db::commit();
            return $id;
        } catch (\Exception $e) {
            Db::rollback();
            throw $e;
        }
    }

    public function specDelete(int $id): void
    {
        // 已被商品引用的规格不能删除
        $used = Db::name('goods_skus')->whereLike('spec_value_ids', "%{$id}%")->count();
        if ($used > 0) {
            throw new \Exception('该规格已被商品使用，无法删除');
        }
        Db::name('goods_spec_values')->where('spec_id', $id)->delete();
        Db::name('goods_specs')->where('id', $id)->delete();
    }

    public function specSetDefault(int $id, int $default): void
    {
        Db::name('goods_specs')->where('id', $id)->update([
            'default_spec' => $default ? 1 : 0,
            'updated_at'   => date('Y-m-d H:i:s'),
        ]);
    }

    public function specMove(int $id, string $dir): void
    {
        $row = Db::name('goods_specs')->where('id', $id)->find();
        if (!$row) {
            throw new \Exception('规格不存在');
        }
        if ($dir === 'up') {
            $swap = Db::name('goods_specs')
                ->where('sort', '<=', $row['sort'])
                ->where('id', '<>', $id)
                ->order('sort', 'desc')
                ->order('id', 'desc')
                ->find();
        } else {
            $swap = Db::name('goods_specs')
                ->where('sort', '>=', $row['sort'])
                ->where('id', '<>', $id)
                ->order('sort', 'asc')
                ->order('id', 'asc')
                ->find();
        }
        if (!$swap) {
            return;
        }
        Db::name('goods_specs')->where('id', $id)->update(['sort' => $swap['sort'], 'updated_at' => date('Y-m-d H:i:s')]);
        Db::name('goods_specs')->where('id', $swap['id'])->update(['sort' => $row['sort'], 'updated_at' => date('Y-m-d H:i:s')]);
    }

    // ---------- 商品属性管理（独立菜单）----------

    public function attrList(?string $keyword): array
    {
        $q = Db::name('goods_attrs')
            ->where('goods_id', 0)
            ->order('sort', 'asc')
            ->order('id', 'asc');
        if ($keyword) {
            $q->where('name', 'like', "%{$keyword}%");
        }
        $rows = $q->select()->toArray();
        foreach ($rows as &$r) {
            $arr = json_decode($r['attr_values'] ?: '[]', true);
            $r['values_text'] = is_array($arr) ? implode(', ', array_column($arr, 'value')) : '';
            $r['values'] = is_array($arr) ? $arr : [];
        }
        return $rows;
    }

    public function attrDetail(int $id): ?array
    {
        $attr = Db::name('goods_attrs')->where('id', $id)->find();
        if (!$attr) {
            return null;
        }
        $attr['values'] = json_decode($attr['attr_values'] ?: '[]', true) ?: [];
        return $attr;
    }

    public function attrSave(?int $id, array $data): int
    {
        $name = trim($data['name'] ?? '');
        if ($name === '') {
            throw new \Exception('属性名称不能为空');
        }
        $values = array_values(array_filter(array_map(function ($v) {
            $value = trim($v['value'] ?? '');
            return $value === '' ? null : ['value' => $value, 'sort' => intval($v['sort'] ?? 0)];
        }, $data['values'] ?? [])));
        if (empty($values)) {
            throw new \Exception('至少需要一个属性值');
        }
        foreach ($values as $i => &$v) {
            $v['sort'] = $i;
        }
        unset($v);
        $default = intval($data['default_attr'] ?? 0);
        $sort    = intval($data['sort'] ?? 0);

        if ($id) {
            $exists = Db::name('goods_attrs')->where('name', $name)->where('goods_id', 0)->where('id', '<>', $id)->find();
            if ($exists) {
                throw new \Exception('属性名称已存在');
            }
            Db::name('goods_attrs')->where('id', $id)->update([
                'name'         => $name,
                'attr_values'  => json_encode($values, JSON_UNESCAPED_UNICODE),
                'default_attr' => $default,
                'sort'         => $sort,
                'updated_at'   => date('Y-m-d H:i:s'),
            ]);
        } else {
            $exists = Db::name('goods_attrs')->where('name', $name)->where('goods_id', 0)->find();
            if ($exists) {
                throw new \Exception('属性名称已存在');
            }
            $id = Db::name('goods_attrs')->insertGetId([
                'goods_id'     => 0,
                'name'         => $name,
                'attr_values'  => json_encode($values, JSON_UNESCAPED_UNICODE),
                'default_attr' => $default,
                'sort'         => $sort,
                'created_at'   => date('Y-m-d H:i:s'),
            ]);
        }
        return $id;
    }

    public function attrDelete(int $id): void
    {
        $row = Db::name('goods_attrs')->where('id', $id)->find();
        if (!$row) {
            throw new \Exception('属性不存在');
        }
        if (intval($row['used']) === 1) {
            throw new \Exception('该属性已被商品使用，无法删除');
        }
        Db::name('goods_attrs')->where('id', $id)->delete();
    }

    public function attrSetDefault(int $id, int $default): void
    {
        Db::name('goods_attrs')->where('id', $id)->update([
            'default_attr' => $default ? 1 : 0,
            'updated_at'   => date('Y-m-d H:i:s'),
        ]);
    }

    public function attrMove(int $id, string $dir): void
    {
        $row = Db::name('goods_attrs')->where('id', $id)->find();
        if (!$row) {
            throw new \Exception('属性不存在');
        }
        if ($dir === 'up') {
            $swap = Db::name('goods_attrs')
                ->where('goods_id', 0)
                ->where('sort', '<=', $row['sort'])
                ->where('id', '<>', $id)
                ->order('sort', 'desc')
                ->order('id', 'desc')
                ->find();
        } else {
            $swap = Db::name('goods_attrs')
                ->where('goods_id', 0)
                ->where('sort', '>=', $row['sort'])
                ->where('id', '<>', $id)
                ->order('sort', 'asc')
                ->order('id', 'asc')
                ->find();
        }
        if (!$swap) {
            return;
        }
        Db::name('goods_attrs')->where('id', $id)->update(['sort' => $swap['sort'], 'updated_at' => date('Y-m-d H:i:s')]);
        Db::name('goods_attrs')->where('id', $swap['id'])->update(['sort' => $row['sort'], 'updated_at' => date('Y-m-d H:i:s')]);
    }
}
