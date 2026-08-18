<?php

namespace app\controller\admin;

use app\common\controller\AdminController;

class Card extends AdminController
{
    public function index()
    {
        $keyword = input('get.keyword/s', '');
        $page    = input('get.page/d', 1);
        $size    = input('get.page_size/d', 20);
        $data    = (new \app\service\CardService())->adminCardList($page, $size, $keyword ?: null);
        return $this->ok($data);
    }

    public function transfers()
    {
        $keyword = input('get.keyword/s', '');
        $page    = input('get.page/d', 1);
        $size    = input('get.page_size/d', 20);
        $data    = (new \app\service\CardService())->adminTransferList($page, $size, $keyword ?: null);
        return $this->ok($data);
    }

    public function void($id)
    {
        try {
            (new \app\service\CardService())->voidCard(intval($id));
            return $this->ok();
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }
}
