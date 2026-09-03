<?php
namespace app\controller\admin;

use app\common\controller\AdminController;
use think\facade\Db;

/**
 * 相册分类管理（后台）
 */
class AlbumCategory extends AdminController
{
    public function index()
    {
        $kw   = input('get.keyword/s', '');
        $page = input('get.page/d', 1);
        $size = input('get.page_size/d', 20);

        $q = Db::name('album_categories')->order('sort asc, id asc');
        if ($kw !== '') {
            $q->where('name', 'like', '%' . $kw . '%');
        }

        $total    = $q->count();
        $lastPage = max((int) ceil($total / $size), 1);
        $page     = min(max(1, $page), $lastPage);
        $list     = $q->page($page, $size)->select()->toArray();

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

    /** 全部分类（下拉） */
    public function all()
    {
        $rows = Db::name('album_categories')->where('status', 1)->order('sort asc, id asc')->column('name', 'id');
        $list = [];
        foreach ($rows as $id => $name) {
            $list[] = ['id' => $id, 'name' => $name];
        }
        return $this->ok($list);
    }

    public function info($id)
    {
        $id  = intval($id);
        $row = Db::name('album_categories')->where('id', $id)->find();
        if (!$row) {
            return $this->fail('分类不存在');
        }
        return $this->ok($row);
    }

    public function save($id = 0)
    {
        $d    = $this->body();
        $id   = $id ?: intval($d['id'] ?? 0);
        $name = trim($d['name'] ?? '');
        if ($name === '') {
            return $this->fail('分类名称不能为空');
        }

        $fields = [
            'name'  => $name,
            'icon'  => trim($d['icon'] ?? ''),
            'sort'  => intval($d['sort'] ?? 0),
        ];

        if ($id) {
            if (isset($d['status'])) {
                $fields['status'] = intval($d['status']);
            }
            Db::name('album_categories')->where('id', $id)->update($fields);
        } else {
            $fields['status'] = intval($d['status'] ?? 1);
            $id = Db::name('album_categories')->insertGetId($fields);
        }

        return $this->ok(['id' => $id]);
    }

    public function remove($id)
    {
        $id = intval($id);
        if (!$id) {
            return $this->fail('参数错误');
        }
        if (Db::name('albums')->where('category_id', $id)->find()) {
            return $this->fail('该分类下存在相册，无法删除');
        }
        Db::name('album_categories')->where('id', $id)->delete();
        return $this->ok();
    }

    public function toggleStatus($id)
    {
        $id     = intval($id);
        $d      = $this->body();
        $status = intval($d['status'] ?? 1);
        Db::name('album_categories')->where('id', $id)->update(['status' => $status]);
        return $this->ok();
    }

    public function batchDelete()
    {
        $d   = $this->body();
        $ids = array_filter(array_map('intval', $d['ids'] ?? []));
        if (empty($ids)) {
            return $this->fail('请选择要删除的分类');
        }
        foreach ($ids as $id) {
            if (Db::name('albums')->where('category_id', $id)->find()) {
                return $this->fail('分类下存在相册，无法删除');
            }
        }
        Db::name('album_categories')->whereIn('id', $ids)->delete();
        return $this->ok();
    }
}
