<?php
namespace app\controller\api\v1;

use app\common\controller\ApiController;
use app\service\PageService;

/**
 * 首页 DIY 装修配置下发
 * 优先读取「已发布」的 page_versions 配置；无配置时回退默认
 */
class Home extends ApiController
{
    /** GET /api/v1/home */
    public function index()
    {
        $cfg = (new PageService())->publishedConfig('home');
        if ($cfg) {
            return $this->ok($cfg);
        }
        return $this->ok((new PageService())->defaultHome());
    }
}
