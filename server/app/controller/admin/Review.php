<?php

namespace app\controller\admin;

use app\common\controller\AdminController;

class Review extends AdminController
{
    public function index()
    {
        $keyword = input('get.keyword/s', '');
        $page    = input('get.page/d', 1);
        $size    = input('get.page_size/d', 20);
        $data    = (new \app\service\ReviewService())->adminList($page, $size, $keyword ?: null);
        return $this->ok($data);
    }

    public function reply($id)
    {
        try {
            $reply = trim($this->body()['reply'] ?? '');
            if ($reply === '') {
                return $this->fail('请输入回复内容');
            }
            (new \app\service\ReviewService())->reply(intval($id), $reply);
            return $this->ok();
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function toggleHidden($id)
    {
        try {
            $res = (new \app\service\ReviewService())->toggleHidden(intval($id));
            return $this->ok($res);
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function batchDelete()
    {
        try {
            $ids = $this->body()['ids'] ?? [];
            (new \app\service\ReviewService())->batchDelete($ids);
            return $this->ok();
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function batchToggleHidden()
    {
        try {
            $ids    = $this->body()['ids'] ?? [];
            $hidden = intval($this->body()['hidden'] ?? 0);
            (new \app\service\ReviewService())->batchToggleHidden($ids, $hidden);
            return $this->ok();
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }
}
