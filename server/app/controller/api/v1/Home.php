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
        return $this->ok($this->defaultHome());
    }

    /** 兜底默认配置（首次未装修时使用） */
    private function defaultHome(): array
    {
        return [
            'page'    => 'home',
            'version' => 1,
            'components' => [
                [
                    'type' => 'banner',
                    'sort' => 1,
                    'props' => [
                        'items' => [
                            ['image' => 'https://placehold.co/750x320/FF6B35/ffffff?text=Banner1', 'link' => ['type' => 'goods', 'id' => 1]],
                            ['image' => 'https://placehold.co/750x320/00B86B/ffffff?text=Banner2', 'link' => ['type' => 'goods', 'id' => 2]],
                        ],
                        'interval' => 4,
                    ],
                ],
                [
                    'type' => 'nav_grid',
                    'sort' => 2,
                    'props' => [
                        'columns' => 5,
                        'items'   => [
                            ['icon' => 'https://placehold.co/96x96/FF6B35/fff?text=新', 'text' => '新品', 'link' => ['type' => 'category', 'id' => 1]],
                            ['icon' => 'https://placehold.co/96x96/00B86B/fff?text=热', 'text' => '热卖', 'link' => ['type' => 'category', 'id' => 2]],
                            ['icon' => 'https://placehold.co/96x96/FFB035/fff?text=券', 'text' => '领券', 'link' => ['type' => 'activity', 'id' => 1]],
                            ['icon' => 'https://placehold.co/96x96/4A90E2/fff?text=秒', 'text' => '秒杀', 'link' => ['type' => 'activity', 'id' => 2]],
                            ['icon' => 'https://placehold.co/96x96/9B59B6/fff?text=更', 'text' => '更多', 'link' => ['type' => 'category', 'id' => 3]],
                        ],
                    ],
                ],
                [
                    'type' => 'goods_group',
                    'sort' => 3,
                    'props' => [
                        'title'      => '精选好物',
                        'source'     => 'recommend',
                        'columns'    => 2,
                        'show_count' => 4,
                    ],
                ],
                [
                    'type' => 'category_nav',
                    'sort' => 4,
                    'props' => [
                        'title'        => '商品分类',
                        'columns'      => 4,
                        'source'       => 'all',
                        'category_ids' => [],
                    ],
                ],
            ],
        ];
    }
}
