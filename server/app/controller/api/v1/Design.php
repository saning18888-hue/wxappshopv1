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

    /** GET /api/v1/category_page  下发已发布的分类页装修配置 */
    public function categoryPage()
    {
        $svc = new PageService();
        $cfg = $svc->publishedConfig('category');
        if (!$cfg) {
            $cfg = $svc->defaultCategoryConfig();
        }
        // 保证前端拿到 styles 列表（空数组或脏数据都兜底）
        $defStyles = $svc->defaultCategoryConfig()['styles'];
        $stylesDirty = empty($cfg['styles']) || !is_array($cfg['styles'])
            || array_filter($cfg['styles'], fn($s) => empty($s['name']) || preg_match('/^\?+$/', (string)($s['name'] ?? '')));
        if ($stylesDirty) {
            $cfg['styles'] = $defStyles;
        }
        // 保证 settings 默认值齐全
        $cfg['settings'] = array_merge([
            'page_size'    => 50,
            'sort'         => 'new',
            'order'        => 'desc',
            'show_ad'      => true,
            'show_promo'   => true,
            'category_ids' => [],
            'view_style'   => 'vertical',
        ], $cfg['settings'] ?? []);
        return $this->ok($cfg);
    }
}
