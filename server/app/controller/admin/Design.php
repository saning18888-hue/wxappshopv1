<?php
namespace app\controller\admin;

use app\common\controller\AdminController;
use app\service\PageService;

/**
 * 页面装修（DIY）后台接口：首页 / 底部导航
 * GET  /admin/design/:page        当前配置 + 草稿 + 版本历史  (home|bottom_nav)
 * POST /admin/design/:page/save   保存草稿 {config, remark?}
 * POST /admin/design/:page/publish 发布/回滚 {version_id?}
 */
class Design extends AdminController
{
    private $svc;

    public function __construct()
    {
        parent::__construct();
        $this->svc = new PageService();
    }

    public function page()
    {
        $page = $this->request->param('page', 'home');
        $published = $this->svc->publishedConfig($page);
        if (!$published) {
            $defaultMap = [
                'bottom_nav' => 'defaultBottomNav',
                'category'   => 'defaultCategoryConfig',
                'member'     => 'defaultMember',
            ];
            $defaultFn = $defaultMap[$page] ?? 'defaultHome';
            $published = $this->svc->{$defaultFn}();
        }
        $draft    = $this->svc->latestDraft($page);
        $versions = $this->svc->versions($page);
        $p        = $this->svc->getPageRow($page);
        $versions = array_map(function ($v) use ($p) {
            $v['is_current'] = $p && intval($p['current_version']) === intval($v['id']);
            return $v;
        }, $versions);

        $titleMap = ['home' => '首页', 'bottom_nav' => '底部导航', 'category' => '分类页'];

        return $this->ok([
            'page'             => $page,
            'title'            => $p ? $p['title'] : ($titleMap[$page] ?? $page),
            'published_config' => $published,
            'draft'            => $draft,
            'versions'         => $versions,
        ]);
    }

    public function save()
    {
        $b    = $this->body();
        $page = $this->request->param('page', 'home');
        $config = $b['config'] ?? [];
        if (!is_array($config) || !isset($config['components']) || !is_array($config['components'])) {
            return $this->fail('配置格式不正确：需包含 components 数组');
        }
        $config['page'] = $page;
        $config['components'] = array_values($config['components']);
        $id = $this->svc->saveDraft($page, $config, $b['remark'] ?? '草稿', $this->adminName());
        return $this->ok(['version_id' => $id], '已保存草稿');
    }

    public function publish()
    {
        $b   = $this->body();
        $page = $this->request->param('page', 'home');
        $vid = isset($b['version_id']) ? intval($b['version_id']) : null;
        $r   = $this->svc->publish($page, $vid);
        if (!$r['ok']) {
            return $this->fail($r['msg']);
        }
        return $this->ok(['version_id' => $r['version_id']], '发布成功');
    }

    private function adminName(): string
    {
        return env('ADMIN_USER') ?: 'admin';
    }
}
