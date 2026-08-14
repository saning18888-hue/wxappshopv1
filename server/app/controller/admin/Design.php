<?php
namespace app\controller\admin;

use app\common\controller\AdminController;
use app\service\PageService;

/**
 * 首页装修（DIY）后台接口
 * GET  /admin/design/home        当前配置 + 草稿 + 版本历史
 * POST /admin/design/home/save   保存草稿 {config, remark?}
 * POST /admin/design/home/publish 发布/回滚 {version_id?}
 */
class Design extends AdminController
{
    private $svc;

    public function __construct()
    {
        parent::__construct();
        $this->svc = new PageService();
    }

    public function home()
    {
        $page      = 'home';
        $published = $this->svc->publishedConfig($page) ?: $this->svc->defaultHome();
        $draft     = $this->svc->latestDraft($page);
        $versions  = $this->svc->versions($page);
        $p         = $this->svc->getPageRow($page);
        $versions  = array_map(function ($v) use ($p) {
            $v['is_current'] = $p && intval($p['current_version']) === intval($v['id']);
            return $v;
        }, $versions);

        return $this->ok([
            'page'             => $page,
            'title'            => $p ? $p['title'] : '首页',
            'published_config' => $published,
            'draft'            => $draft,
            'versions'         => $versions,
        ]);
    }

    public function save()
    {
        $b = $this->body();
        $config = $b['config'] ?? [];
        if (!is_array($config) || !isset($config['components']) || !is_array($config['components'])) {
            return $this->fail('配置格式不正确：需包含 components 数组');
        }
        $config['page'] = 'home';
        $config['components'] = array_values($config['components']);
        $id = $this->svc->saveDraft('home', $config, $b['remark'] ?? '草稿', $this->adminName());
        return $this->ok(['version_id' => $id], '已保存草稿');
    }

    public function publish()
    {
        $b   = $this->body();
        $vid = isset($b['version_id']) ? intval($b['version_id']) : null;
        $r   = $this->svc->publish('home', $vid);
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
