<?php
namespace app\controller\admin;

use app\common\controller\AdminController;
use think\facade\Db;

/**
 * 文章管理（后台）
 */
class Article extends AdminController
{
    public function index()
    {
        $kw         = input('get.keyword/s', '');
        $categoryId = input('get.category_id/d', 0);
        $recommend  = input('get.is_recommend/d', -1);
        $show       = input('get.is_show/d', -1);
        $page       = input('get.page/d', 1);
        $size       = input('get.page_size/d', 20);

        $q = Db::name('articles');
        if ($kw !== '') {
            $q->where('title', 'like', '%' . $kw . '%');
        }
        if ($categoryId) {
            $q->where('category_id', $categoryId);
        }
        if ($recommend >= 0) {
            $q->where('is_recommend', $recommend);
        }
        if ($show >= 0) {
            $q->where('is_show', $show);
        }

        $total    = $q->count();
        $lastPage = max((int) ceil($total / $size), 1);
        $page     = min(max(1, $page), $lastPage);
        $list     = $q->order('id desc')->page($page, $size)->select()->toArray();

        $catMap = Db::name('article_categories')->column('name', 'id');
        foreach ($list as &$r) {
            $r['category_name'] = $catMap[$r['category_id']] ?? '';
        }

        return $this->ok([
            'list' => $list,
            'pagination' => [
                'page'      => $page,
                'page_size' => $size,
                'total'     => $total,
                'last_page' => $lastPage,
            ],
        ]);
    }

    public function info($id)
    {
        $id = intval($id);
        $row = Db::name('articles')->where('id', $id)->find();
        if (!$row) {
            return $this->fail('文章不存在');
        }
        return $this->ok($row);
    }

    public function save($id = 0)
    {
        $d   = $this->body();
        $id  = $id ?: intval($d['id'] ?? 0);
        $title = trim($d['title'] ?? '');
        $catId = intval($d['category_id'] ?? 0);
        if ($title === '') {
            return $this->fail('文章标题不能为空');
        }
        if ($catId && !Db::name('article_categories')->where('id', $catId)->find()) {
            return $this->fail('文章分类不存在');
        }

        $fields = [
            'title'         => $title,
            'category_id'   => $catId,
            'author'        => trim($d['author'] ?? ''),
            'source'        => trim($d['source'] ?? ''),
            'cover_image'   => trim($d['cover_image'] ?? ''),
            'intro'         => trim($d['intro'] ?? ''),
            'keywords'      => trim($d['keywords'] ?? ''),
            'content'       => $d['content'] ?? '',
            'external_link' => trim($d['external_link'] ?? ''),
            'display_mode'  => in_array($d['display_mode'] ?? 'native', ['native', 'webview']) ? ($d['display_mode'] ?? 'native') : 'native',
            'is_recommend'  => intval($d['is_recommend'] ?? 0),
            'is_show'       => intval($d['is_show'] ?? 1),
            'views'         => intval($d['views'] ?? 0),
            'video_type'    => in_array($d['video_type'] ?? 'none', ['none', 'mp4', 'tencent', 'douyin', 'weishi']) ? ($d['video_type'] ?? 'none') : 'none',
            'video_url'     => trim($d['video_url'] ?? ''),
        ];

        if ($id) {
            Db::name('articles')->where('id', $id)->update($fields);
        } else {
            $fields['publish_time'] = date('Y-m-d H:i:s');
            $id = Db::name('articles')->insertGetId($fields);
        }

        return $this->ok(['id' => $id]);
    }

    public function remove($id)
    {
        $id = intval($id);
        if (!$id) {
            return $this->fail('参数错误');
        }
        Db::name('articles')->where('id', $id)->delete();
        return $this->ok();
    }

    public function batchDelete()
    {
        $d = $this->body();
        $ids = array_filter(array_map('intval', $d['ids'] ?? []));
        if (empty($ids)) {
            return $this->fail('请选择要删除的文章');
        }
        Db::name('articles')->whereIn('id', $ids)->delete();
        return $this->ok();
    }

    public function toggleShow($id)
    {
        $id     = intval($id);
        $d      = $this->body();
        $isShow = intval($d['is_show'] ?? 1);
        Db::name('articles')->where('id', $id)->update(['is_show' => $isShow]);
        return $this->ok();
    }

    /** 导出文章列表为 CSV */
    public function export()
    {
        $kw         = input('get.keyword/s', '');
        $categoryId = input('get.category_id/d', 0);
        $recommend  = input('get.is_recommend/d', -1);
        $show       = input('get.is_show/d', -1);

        $q = Db::name('articles');
        if ($kw !== '') {
            $q->where('title', 'like', '%' . $kw . '%');
        }
        if ($categoryId) {
            $q->where('category_id', $categoryId);
        }
        if ($recommend >= 0) {
            $q->where('is_recommend', $recommend);
        }
        if ($show >= 0) {
            $q->where('is_show', $show);
        }
        $list = $q->order('id desc')->select()->toArray();

        $catMap = Db::name('article_categories')->column('name', 'id');
        $csv    = "ID,标题,分类,作者,来源,浏览量,推荐,显示,发布时间\n";
        foreach ($list as $r) {
            $row = [
                $r['id'],
                $r['title'],
                $catMap[$r['category_id']] ?? '',
                $r['author'],
                $r['source'],
                $r['views'],
                $r['is_recommend'] ? '是' : '否',
                $r['is_show'] ? '显示' : '隐藏',
                $r['publish_time'],
            ];
            $csv .= '"' . str_replace('"', '""', implode('","', $row)) . "\"\n";
        }

        $filename = 'articles_' . date('YmdHis') . '.csv';
        return response($csv)->header([
            'Content-Type'        => 'application/octet-stream; charset=gbk',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /** 基础设置：文章标题/发布时间/浏览量 显示开关 + 文章列表模块配置 */
    public function settings()
    {
        $d   = $this->body();
        $svc = new \app\service\SettingsService();
        $cur = $svc->get();
        $art = $cur['article'] ?? [];

        // 详情页字段显示
        $art['title_show']   = intval($d['title_show']   ?? 1);
        $art['publish_show'] = intval($d['publish_show'] ?? 1);
        $art['views_show']   = intval($d['views_show']   ?? 1);

        // 文章列表模块配置（首页 DIY 用的全局配置）
        $m = $d['article_list_module'] ?? null;
        if (is_array($m)) {
            $art['article_list_module'] = [
                'title'       => trim($m['title'] ?? '示例文章'),
                'hide_title'  => intval($m['hide_title'] ?? 0),
                'layout'      => in_array($m['layout'] ?? 'single', ['single', 'multi'], true) ? $m['layout'] : 'single',
                'source'      => in_array($m['source'] ?? 'specific', ['specific', 'category'], true) ? $m['source'] : 'specific',
                'category_id' => intval($m['category_id'] ?? 0),
                'article_ids' => array_values(array_filter(array_map('intval', $m['article_ids'] ?? []))),
                'show_intro'  => intval($m['show_intro'] ?? 1),
                'show_date'   => intval($m['show_date']  ?? 1),
                'show_views'  => intval($m['show_views'] ?? 0),
                'more_link'   => is_array($m['more_link'] ?? null) ? $m['more_link'] : ['type' => 'page', 'id' => 'article_list'],
            ];
        }

        try {
            $svc->save(['article' => $art]);
        } catch (\Throwable $e) {
            return $this->fail('保存失败：' . $e->getMessage());
        }
        return $this->ok();
    }
}
