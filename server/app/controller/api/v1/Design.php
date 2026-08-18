<?php
namespace app\controller\api\v1;

use app\common\controller\ApiController;
use app\service\PageService;

/**
 * 页面装修配置下发（小程序端）
 */
class Design extends ApiController
{
    /** GET /api/v1/bottom_nav  下发已发布的底部导航配置 */
    public function bottomNav()
    {
        $svc  = new PageService();
        $cfg  = $svc->publishedConfig('bottom_nav');
        if (!$cfg) {
            $cfg = $svc->defaultBottomNav();
        }
        return $this->ok($cfg);
    }
}
