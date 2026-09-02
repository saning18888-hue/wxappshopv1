<?php
namespace app\service;

use think\facade\Db;

/**
 * 文章列表模块服务：
 *   全局配置（article.article_list_module）+ 解析为前台消费的数据结构。
 * 单实例模块：同一时刻小程序首页只读这一份配置。
 */
class ArticleModuleService
{
    /** 默认配置（首次保存或缺字段时使用） */
    public const DEFAULTS = [
        'title'       => '示例文章',
        'hide_title'  => 0,                              // 隐藏模块顶部标题
        'layout'      => 'single',                       // single=单图+文字、multi=双图横排
        'source'      => 'specific',                     // specific=指定文章、category=按分类
        'category_id' => 0,
        'article_ids' => [],                             // 指定文章时按此顺序排序
        'show_intro'  => 1,                              // 显示简介
        'show_date'   => 1,                              // 显示发布日期
        'show_views'  => 0,                              // 显示浏览量
        'more_link'   => ['type' => 'page', 'id' => 'article_list'],
    ];

    /** 读取全局配置（永远返回完整结构，缺字段用默认补齐） */
    public static function getConfig(): array
    {
        $settings = SettingsService::get();
        $module   = $settings['article']['article_list_module'] ?? null;
        if (!is_array($module)) {
            return self::DEFAULTS;
        }
        // 合并默认值，防止老数据缺字段导致前端拿到 undefined
        return array_merge(self::DEFAULTS, $module);
    }

    /**
     * 根据配置解析文章列表，返回前台展示所需的精简字段。
     * 指定文章模式按 article_ids 的顺序返回；按分类模式按 id 倒序。
     */
    public static function resolveArticles(array $module): array
    {
        $source = $module['source'] ?? 'specific';
        $db     = Db::name('articles')->where('is_show', 1);

        if ($source === 'category' && !empty($module['category_id'])) {
            $list = $db->where('category_id', intval($module['category_id']))
                ->order('id desc')
                ->limit(20)
                ->select()
                ->toArray();
        } else {
            $ids = array_values(array_filter(array_map('intval', $module['article_ids'] ?? [])));
            if (!$ids) {
                return [];
            }
            $list  = $db->whereIn('id', $ids)->select()->toArray();
            $byId  = [];
            foreach ($list as $r) {
                $byId[intval($r['id'])] = $r;
            }
            $ordered = [];
            foreach ($ids as $id) {
                if (isset($byId[$id])) {
                    $ordered[] = $byId[$id];
                }
            }
            $list = $ordered;
        }

        return array_map([self::class, 'simplifyArticle'], $list);
    }

    /** 把 articles 表行映射为前台列表项 */
    public static function simplifyArticle(array $a): array
    {
        $catName = '';
        if (!empty($a['category_id'])) {
            static $catMap = null;
            if ($catMap === null) {
                $catMap = Db::name('article_categories')->column('name', 'id');
            }
            $catName = $catMap[intval($a['category_id'])] ?? '';
        }
        return [
            'id'            => intval($a['id']),
            'title'         => $a['title'] ?? '',
            'intro'         => $a['intro'] ?? '',
            'cover_image'   => $a['cover_image'] ?? '',
            'publish_time'  => $a['publish_time'] ?? '',
            'views'         => intval($a['views'] ?? 0),
            'category_name' => $catName,
        ];
    }
}