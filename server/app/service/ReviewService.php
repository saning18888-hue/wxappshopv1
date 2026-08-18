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
}
