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
        $styleDefaults = [
            'text_color'     => '#999999',
            'selected_color' => '#FF6B35',
            'bg_color'       => '#FFFFFF',
            'border_color'   => '#EEEEEE',
        ];
        $cfg['style'] = array_merge($styleDefaults, $cfg['style'] ?? []);
        return $this->ok($cfg);
    }
}
