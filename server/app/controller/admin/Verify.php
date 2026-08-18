<?php

namespace app\controller\admin;

use app\common\controller\AdminController;

class Verify extends AdminController
{
    public function index()
    {
        try {
            $body    = $this->body();
            $type    = trim($body['type'] ?? '');
            $code    = trim($body['code'] ?? '');
            $adminId = intval(request()->adminId ?? 0);
            if (!$type || !$code) {
                return $this->fail('核销类型和核销码不能为空');
            }
            $res = (new \app\service\VerifyService())->verify($type, $code, $adminId ?: 1);
            return $this->ok($res);
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function records()
    {
        $type    = input('get.type/s', 'all');
        $keyword = input('get.keyword/s', '');
        $page    = input('get.page/d', 1);
        $size    = input('get.page_size/d', 20);
        $data    = (new \app\service\VerifyService())->recordList($page, $size, $type, $keyword ?: null);
        return $this->ok($data);
    }
}
