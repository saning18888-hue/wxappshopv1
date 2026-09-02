<?php
namespace app\controller\api\v1;

use app\common\controller\ApiController;
use app\service\ArticleModuleService;
use think\facade\Db;

/**
 * 文章相关小程序端 API
 *  GET  /api/v1/article_list_module       读取首页「文章列表」模块配置 + 文章数据
 *  GET  /api/v1/articles                 文章列表页（小程序端可点击「更多」进入）
 *  GET  /api/v1/articles/:id             文章详情（小程序端点击进入）
 */
class Article extends ApiController
{
    /**
     * 首页文章列表模块数据（一次性下发配置 + 文章）
     * GET /api/v1/article_list_module
     */
    public function listModule()
    {
        $module   = ArticleModuleService::getConfig();
        $articles = ArticleModuleService::resolveArticles($module);

        // 浏览量 +1（仅用户访问列表时统计，记录到 article views 列）
        if ($articles) {
            $ids = array_column($articles, 'id');
            if ($ids) {
                Db::name('articles')->whereIn('id', $ids)->inc('views', 1)->update([]);
            }
        }

        return $this->ok([
            'module'   => $module,
            'articles' => $articles,
        ]);
    }

    /**
     * 文章列表页（小程序「更多」入口）
     * GET /api/v1/articles?category_id=&page=&page_size=
     */
    public function index()
    {
        $page       = max(1, intval(input('get.page/d', 1)));
        $size       = min(50, max(1, intval(input('get.page_size/d', 10))));
        $categoryId = intval(input('get.category_id/d', 0));

        $q = Db::name('articles')->where('is_show', 1);
        if ($categoryId) {
            $q->where('category_id', $categoryId);
        }
        $total = $q->count();
        $list  = $q->order('id desc')->page($page, $size)->select()->toArray();

        // 浏览量 +1（仅访问时自增一次）
        if ($list) {
            $ids = array_map('intval', array_column($list, 'id'));
            Db::name('articles')->whereIn('id', $ids)->inc('views', 1)->update([]);
        }

        $articles = array_map([ArticleModuleService::class, 'simplifyArticle'], $list);

        return $this->ok([
            'list'       => $articles,
            'pagination' => [
                'page'      => $page,
                'page_size' => $size,
                'total'     => $total,
                'last_page' => max(1, (int) ceil($total / $size)),
            ],
        ]);
    }

    /**
     * 文章详情
     * GET /api/v1/articles/:id
     */
    public function detail($id)
    {
        $id   = intval($id);
        $row  = Db::name('articles')->where('id', $id)->where('is_show', 1)->find();
        if (!$row) {
            return $this->fail('文章不存在或已下架');
        }

        // 浏览量 +1
        Db::name('articles')->where('id', $id)->inc('views', 1)->update([]);
        $row['views'] = intval($row['views']) + 1;

        // 注入分类名
        if (!empty($row['category_id'])) {
            $row['category_name'] = Db::name('article_categories')->where('id', $row['category_id'])->value('name') ?: '';
        }

        return $this->ok($row);
    }
}