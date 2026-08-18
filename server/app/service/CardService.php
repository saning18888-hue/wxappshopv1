<?php

namespace app\service;

use think\facade\Db;

class CardService
{
    const STATUS_UNUSED = 0;
    const STATUS_USED   = 1;
    const STATUS_GIFTED = 2;
    const STATUS_VOID   = 3;

    public function adminCardList(int $page, int $pageSize, ?string $keyword): array
    {
        $q = Db::name('order_cards');
        if ($keyword) {
            $q->where(function ($query) use ($keyword) {
                $query->where('order_no', 'like', "%{$keyword}%")
                      ->whereOr('code', 'like', "%{$keyword}%")
                      ->whereOr('goods_title', 'like', "%{$keyword}%")
                      ->whereOr('contact_phone', 'like', "%{$keyword}%");
            });
        }
        $total = $q->count();
        $rows  = $q->order('id desc')->page($page, $pageSize)->select()->toArray();
        $list  = array_map([$this, 'formatCard'], $rows);
        return [
            'list'      => $list,
            'total'     => (int) $total,
            'page'      => $page,
            'page_size' => $pageSize,
            'last_page' => max(1, (int) ceil($total / $pageSize)),
        ];
    }

    public function adminTransferList(int $page, int $pageSize, ?string $keyword): array
    {
        $q = Db::name('card_transfers')->alias('t')
            ->field('t.*,u1.nickname as from_name,u2.nickname as to_name')
            ->leftJoin('users u1', 'u1.id=t.from_user_id')
            ->leftJoin('users u2', 'u2.id=t.to_user_id');
        if ($keyword) {
            $q->where(function ($query) use ($keyword) {
                $query->where('t.order_no', 'like', "%{$keyword}%")
                      ->whereOr('t.goods_title', 'like', "%{$keyword}%")
                      ->whereOr('u1.nickname', 'like', "%{$keyword}%")
                      ->whereOr('u2.nickname', 'like', "%{$keyword}%");
            });
        }
        $total = $q->count();
        $rows  = $q->order('t.id desc')->page($page, $pageSize)->select()->toArray();
        $list  = array_map(function ($row) {
            $row['status_text'] = $this->transferStatusText($row['status']);
            return $row;
        }, $rows);
        return [
            'list'      => $list,
            'total'     => (int) $total,
            'page'      => $page,
            'page_size' => $pageSize,
            'last_page' => max(1, (int) ceil($total / $pageSize)),
        ];
    }

    public function formatCard(array $row): array
    {
        $row['status_text']  = $this->cardStatusText($row['status']);
        $row['status_class'] = $this->cardStatusClass($row['status']);
        return $row;
    }

    public function cardStatusText(int $status): string
    {
        $map = [
            self::STATUS_UNUSED => '未使用',
            self::STATUS_USED   => '已使用',
            self::STATUS_GIFTED => '已转赠',
            self::STATUS_VOID   => '已作废',
        ];
        return $map[$status] ?? '未知';
    }

    public function cardStatusClass(int $status): string
    {
        $map = [
            self::STATUS_UNUSED => 'blue',
            self::STATUS_USED   => 'gray',
            self::STATUS_GIFTED => 'orange',
            self::STATUS_VOID   => 'red',
        ];
        return $map[$status] ?? 'gray';
    }

    public function transferStatusText(int $status): string
    {
        $map = [0 => '待领取', 1 => '已领取', 2 => '已过期'];
        return $map[$status] ?? '未知';
    }

    public function voidCard(int $id): void
    {
        $card = Db::name('order_cards')->where('id', $id)->find();
        if (!$card) {
            throw new \Exception('卡券不存在');
        }
        if ((int) $card['status'] === self::STATUS_USED) {
            throw new \Exception('已使用的卡券不能作废');
        }
        Db::name('order_cards')->where('id', $id)->update([
            'status'     => self::STATUS_VOID,
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
    }
}
