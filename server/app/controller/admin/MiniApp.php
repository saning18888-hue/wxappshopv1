<?php
namespace app\controller\admin;

use app\common\controller\AdminController;
use think\facade\Db;

/**
 * 跳转小程序管理
 */
class MiniApp extends AdminController
{
    public function index()
    {
        $kw       = input('get.keyword/s', '');
        $platform = input('get.platform/s', '');
        $status   = input('get.status/d', -1);
        $page     = input('get.page/d', 1);
        $size     = input('get.page_size/d', 10);

        $q = Db::name('mini_apps');
        if ($kw !== '') {
            $q->where('name|appid', 'like', '%' . $kw . '%');
        }
        if ($platform !== '') {
            $q->where('platform', $platform);
        }
        if ($status >= 0) {
            $q->where('status', $status);
        }

        $total    = $q->count();
        $lastPage = max((int) ceil($total / $size), 1);
        $page     = min(max(1, $page), $lastPage);

        $list = $q->order('sort asc, id desc')
                  ->page($page, $size)
                  ->select()
                  ->toArray();

        return $this->ok([
            'list'       => $list,
            'pagination' => [
                'page'      => $page,
                'page_size' => $size,
                'total'     => $total,
                'last_page' => $lastPage,
            ],
        ]);
    }

    public function all()
    {
        $rows = Db::name('mini_apps')
                  ->where('status', 1)
                  ->order('sort asc, id desc')
                  ->column('name', 'id');

        $list = [];
        foreach ($rows as $id => $name) {
            $list[] = ['id' => $id, 'name' => $name];
        }
        return $this->ok($list);
    }

    public function info($id)
    {
        $id  = intval($id);
        $row = Db::name('mini_apps')->where('id', $id)->find();
        if (!$row) {
            return $this->fail('记录不存在');
        }
        return $this->ok($row);
    }

    public function save($id = 0)
    {
        $d        = $this->body();
        $id       = $id ?: intval($d['id'] ?? 0);
        $name     = trim($d['name'] ?? '');
        $appid    = trim($d['appid'] ?? '');
        $path     = trim($d['path'] ?? '');
        $platform = trim($d['platform'] ?? 'wechat');

        if ($name === '') {
            return $this->fail('名称不能为空');
        }
        if ($appid === '') {
            return $this->fail('APPID 不能为空');
        }
        if (!in_array($platform, ['wechat', 'baidu', 'alipay', 'bytedance'])) {
            return $this->fail('平台类型错误');
        }

        $fields = [
            'name'     => $name,
            'appid'    => $appid,
            'path'     => $path,
            'platform' => $platform,
            'sort'     => intval($d['sort'] ?? 0),
            'status'   => intval($d['status'] ?? 1),
        ];

        if ($id) {
            Db::name('mini_apps')->where('id', $id)->update($fields);
        } else {
            $id = Db::name('mini_apps')->insertGetId($fields);
        }

        return $this->ok(['id' => $id]);
    }

    public function remove($id)
    {
        $id = intval($id);
        if (!$id) {
            return $this->fail('参数错误');
        }
        Db::name('mini_apps')->where('id', $id)->delete();
        return $this->ok();
    }

    public function batchDelete()
    {
        $d   = $this->body();
        $ids = array_filter(array_map('intval', $d['ids'] ?? []));
        if (empty($ids)) {
            return $this->fail('请选择要删除的记录');
        }
        Db::name('mini_apps')->whereIn('id', $ids)->delete();
        return $this->ok();
    }

    public function toggleStatus($id)
    {
        $id     = intval($id);
        $d      = $this->body();
        $status = intval($d['status'] ?? 1);
        Db::name('mini_apps')->where('id', $id)->update(['status' => $status]);
        return $this->ok();
    }
}
