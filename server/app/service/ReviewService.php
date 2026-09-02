<?php

namespace app\service;

use think\facade\Db;

class ReviewService
{
    public function adminList(int $page, int $pageSize, ?string $keyword): array
    {
        $q = Db::name('goods_reviews');
        if ($keyword) {
            $q->where(function ($query) use ($keyword) {
                $query->where('goods_title', 'like', "%{$keyword}%")
                      ->whereOr('content', 'like', "%{$keyword}%")
                      ->whereOr('user_name', 'like', "%{$keyword}%");
            });
        }
        $total = $q->count();
        $rows  = $q->order('id desc')->page($page, $pageSize)->select()->toArray();
        $list  = array_map(fn($row) => $this->format($row), $rows);
        return [
            'list'      => $list,
            'total'     => (int) $total,
            'page'      => $page,
            'page_size' => $pageSize,
            'last_page' => max(1, (int) ceil($total / $pageSize)),
        ];
    }

    public function format(array $row): array
    {
        $row['images'] = json_decode($row['images'] ?: '[]', true) ?: [];
        return $row;
    }

    public function reply(int $id, string $reply): void
    {
        $review = Db::name('goods_reviews')->where('id', $id)->find();
        if (!$review) {
            throw new \Exception('评论不存在');
        }
        Db::name('goods_reviews')->where('id', $id)->update([
            'reply'      => $reply,
            'reply_at'   => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
    }

    public function toggleHidden(int $id): array
    {
        $review = Db::name('goods_reviews')->where('id', $id)->find();
        if (!$review) {
            throw new \Exception('评论不存在');
        }
        $hidden = (int) $review['is_hidden'] === 0 ? 1 : 0;
        Db::name('goods_reviews')->where('id', $id)->update([
            'is_hidden'  => $hidden,
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
        return ['is_hidden' => $hidden];
    }

    public function batchDelete(array $ids): void
    {
        if (empty($ids)) {
            throw new \Exception('请选择要删除的评论');
        }
        Db::name('goods_reviews')->whereIn('id', array_map('intval', $ids))->delete();
    }

    public function batchToggleHidden(array $ids, int $hidden): void
    {
        if (empty($ids)) {
            throw new \Exception('请选择要操作的评论');
        }
        Db::name('goods_reviews')->whereIn('id', array_map('intval', $ids))->update([
            'is_hidden'  => $hidden,
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
    }

    /**
     * 用户提交评价（评价闭环）
     * 仅限本人「已完成」订单（status 3/5），且同一订单同一商品不可重复评价。
     */
    public function create(array $user, array $data): int
    {
        $orderId = intval($data['order_id'] ?? 0);
        $goodsId = intval($data['goods_id'] ?? 0);
        $rating  = max(1, min(5, intval($data['rating'] ?? 5)));
        $content = trim($data['content'] ?? '');
        if ($orderId <= 0 || $goodsId <= 0) {
            throw new \Exception('参数错误');
        }
        if ($content === '') {
            throw new \Exception('请输入评价内容');
        }

        $order = Db::name('orders')
            ->where('id', $orderId)
            ->where('user_id', $user['id'])
            ->where('is_deleted', 0)
            ->find();
        if (!$order) {
            throw new \Exception('订单不存在');
        }
        if (!in_array((int) $order['status'], [3, 5], true)) {
            throw new \Exception('仅已完成订单可评价');
        }

        $exists = Db::name('goods_reviews')
            ->where('order_id', $orderId)
            ->where('goods_id', $goodsId)
            ->where('user_id', $user['id'])
            ->find();
        if ($exists) {
            throw new \Exception('该商品已评价');
        }

        $item  = Db::name('order_items')->where('order_id', $orderId)->where('goods_id', $goodsId)->find();
        $goods = Db::name('goods')->where('id', $goodsId)->field('title,images')->find();
        $title = $item['goods_title'] ?? ($goods['title'] ?? '');
        $image = $item['image'] ?? '';
        if (!$image && !empty($goods['images'])) {
            $imgs  = json_decode($goods['images'], true) ?: [];
            $image = $imgs[0] ?? '';
        }
        $images = json_encode($data['images'] ?? [], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        return Db::name('goods_reviews')->insertGetId([
            'order_id'    => $orderId,
            'order_no'    => $order['order_no'] ?? '',
            'user_id'     => $user['id'],
            'user_name'   => $user['nickname'] ?? '匿名用户',
            'avatar'      => $user['avatar'] ?? '',
            'goods_id'    => $goodsId,
            'goods_title' => $title,
            'goods_image' => $image,
            'content'     => $content,
            'images'      => $images,
            'rating'      => $rating,
            'is_hidden'   => 0,
            'reply'       => '',
            'reply_at'    => null,
            'created_at'  => date('Y-m-d H:i:s'),
            'updated_at'  => date('Y-m-d H:i:s'),
        ]);
    }

    /** 我的评价列表 */
    public function mine(int $userId, int $page, int $pageSize): array
    {
        $q     = Db::name('goods_reviews')->where('user_id', $userId);
        $total = $q->count();
        $rows  = $q->order('id desc')->page($page, $pageSize)->select()->toArray();
        $list  = array_map([$this, 'format'], $rows);
        return [
            'list'       => $list,
            'total'      => (int) $total,
            'page'       => $page,
            'page_size'  => $pageSize,
            'last_page'  => max(1, (int) ceil($total / $pageSize)),
        ];
    }
}
