<?php
namespace app\service;

use think\facade\Db;

/**
 * 购物车服务
 */
class CartService
{
    public function add(int $userId, int $skuId, int $qty): bool
    {
        $sku   = Db::name('goods_skus')->where('id', $skuId)->find();
        $goods = Db::name('goods')->where('id', $sku['goods_id'])->find();
        if (!$sku || !$goods) {
            throw new \Exception('商品或 SKU 不存在');
        }
        if ($sku['stock'] < $qty) {
            throw new \Exception('库存不足');
        }
        $row = Db::name('carts')->where(['user_id' => $userId, 'sku_id' => $skuId])->find();
        if ($row) {
            Db::name('carts')->where('id', $row['id'])
                ->inc('quantity', $qty)
                ->update(['updated_at' => date('Y-m-d H:i:s')]);
        } else {
            Db::name('carts')->insert([
                'user_id'    => $userId,
                'goods_id'   => $sku['goods_id'],
                'sku_id'     => $skuId,
                'quantity'   => $qty,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ]);
        }
        return true;
    }

    public function list(int $userId): array
    {
        $rows = Db::name('carts')->alias('c')
            ->join('goods g', 'g.id=c.goods_id')
            ->join('goods_skus s', 's.id=c.sku_id')
            ->where('c.user_id', $userId)
            ->field('c.id,c.quantity,c.goods_id,c.sku_id,g.title,g.images,s.price,s.stock,s.spec_value_ids,s.image as sku_image')
            ->order('c.id desc')
            ->select()
            ->toArray();

        $items = [];
        foreach ($rows as $r) {
            $images   = json_decode($r['images'] ?? '[]', true) ?: [];
            $cover    = $r['sku_image'] ?: ($images[0] ?? '');
            $items[]  = [
                'id'         => $r['id'],
                'goods_id'   => $r['goods_id'],
                'sku_id'     => $r['sku_id'],
                'title'      => $r['title'],
                'cover'      => $cover,
                'price'      => floatval($r['price'] / 100),
                'stock'      => (int) $r['stock'],
                'quantity'   => (int) $r['quantity'],
                'spec_desc'  => $this->specDesc($r['spec_value_ids']),
            ];
        }
        return [
            'list'           => $items,
            'total_count'    => count($items),
            'selected_amount' => 0,
        ];
    }

    public function update(int $id, int $userId, int $qty): bool
    {
        $row = Db::name('carts')->where(['id' => $id, 'user_id' => $userId])->find();
        if (!$row) {
            throw new \Exception('购物车项不存在');
        }
        if ($qty <= 0) {
            return $this->remove($id, $userId);
        }
        Db::name('carts')->where('id', $id)->update([
            'quantity'   => $qty,
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
        return true;
    }

    public function remove(int $id, int $userId): bool
    {
        Db::name('carts')->where(['id' => $id, 'user_id' => $userId])->delete();
        return true;
    }

    private function specDesc(?string $specValueIds): string
    {
        if (!$specValueIds) {
            return '';
        }
        $ids  = array_filter(explode(',', $specValueIds));
        $vals = Db::name('goods_spec_values')->whereIn('id', $ids)->column('value');
        return implode(' / ', $vals);
    }
}
