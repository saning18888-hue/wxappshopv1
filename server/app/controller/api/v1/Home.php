<?php
namespace app\controller\api\v1;

use app\common\controller\ApiController;
use app\service\ArticleModuleService;
use app\service\PageService;

/**
 * 首页 DIY 装修配置下发
 * 优先读取「已发布」的 page_versions 配置；无配置时回退默认
 * 渲染时根据组件类型合入额外数据（如 article_list → 文章数据）
 */
class Home extends ApiController
{
    /** GET /api/v1/home */
    public function index()
    {
        $svc = new PageService();
        $cfg = $svc->publishedConfig('home');
        if (!$cfg) {
            $cfg = $svc->defaultHome();
        }
        $cfg = $this->enrich($cfg);
        return $this->ok($cfg);
    }

    /**
     * 根据组件类型合入额外数据（目前只处理 article_list）
     * 合入后组件结构：{ type, sort, props, moduleConfig, articles }
     */
    private function enrich(array $cfg): array
    {
        if (!isset($cfg['components']) || !is_array($cfg['components'])) {
            return $cfg;
        }
        foreach ($cfg['components'] as &$c) {
            if (!is_array($c) || ($c['type'] ?? '') !== 'article_list') {
                continue;
            }
            $module              = ArticleModuleService::getConfig();
            $c['moduleConfig']   = $module;
            $c['articles']       = ArticleModuleService::resolveArticles($module);
        }
        unset($c);
        return $cfg;
    }
}