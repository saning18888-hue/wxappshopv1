<?php
namespace app\controller\admin;

use app\common\controller\AdminController;
use think\facade\Db;

/**
 * 相册管理（后台）
 */
class Album extends AdminController
{
    public function index()
    {
        $kw         = input('get.keyword/s', '');
        $categoryId = input('get.category_id/d', 0);
        $status     = input('get.status/d', -1);
        $page       = input('get.page/d', 1);
        $size       = input('get.page_size/d', 20);

        $q = Db::name('albums')->alias('a');
        if ($kw !== '') {
            $q->where('a.name', 'like', '%' . $kw . '%');
        }
        if ($categoryId) {
            $q->where('a.category_id', $categoryId);
        }
        if ($status >= 0) {
            $q->where('a.status', $status);
        }

        $total    = $q->count();
        $lastPage = max((int) ceil($total / $size), 1);
        $page     = min(max(1, $page), $lastPage);
        $list     = $q->order('a.sort asc, a.id desc')->page($page, $size)
            ->field('a.*')
            ->select()->toArray();

        $catMap = Db::name('album_categories')->column('name', 'id');
        foreach ($list as &$r) {
            $r['category_name'] = $catMap[$r['category_id']] ?? '';
            if (empty($r['cover_image'])) {
                $cover = Db::name('album_images')->where('album_id', $r['id'])->where('is_cover', 1)->value('image_url');
                if (!$cover) {
                    $cover = Db::name('album_images')->where('album_id', $r['id'])->order('sort asc, id asc')->value('image_url');
                }
                $r['cover_image'] = $cover ?: '';
            }
            // 实时校正图片数量
            $r['image_count'] = Db::name('album_images')->where('album_id', $r['id'])->count();
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

    public function all()
    {
        $rows = Db::name('albums')->where('status', 1)->order('sort asc, id desc')->column('name', 'id');
        $list = [];
        foreach ($rows as $id => $name) {
            $list[] = ['id' => $id, 'name' => $name];
        }
        return $this->ok($list);
    }

    public function info($id)
    {
        $id  = intval($id);
        $row = Db::name('albums')->where('id', $id)->find();
        if (!$row) {
            return $this->fail('相册不存在');
        }
        $row['category_name'] = Db::name('album_categories')->where('id', $row['category_id'])->value('name') ?? '';
        return $this->ok($row);
    }

    public function save($id = 0)
    {
        $d    = $this->body();
        $id   = $id ?: intval($d['id'] ?? 0);
        $name = trim($d['name'] ?? '');
        $catId = intval($d['category_id'] ?? 0);

        if ($name === '') {
            return $this->fail('相册名称不能为空');
        }
        if ($catId && !Db::name('album_categories')->where('id', $catId)->find()) {
            return $this->fail('相册分类不存在');
        }

        $fields = [
            'name'        => $name,
            'category_id' => $catId,
            'cover_image' => trim($d['cover_image'] ?? ''),
            'sort'        => intval($d['sort'] ?? 0),
            'status'      => intval($d['status'] ?? 1),
        ];

        if ($id) {
            Db::name('albums')->where('id', $id)->update($fields);
        } else {
            $id = Db::name('albums')->insertGetId($fields);
        }

        $this->syncImageCount($id);

        return $this->ok(['id' => $id]);
    }

    public function remove($id)
    {
        $id = intval($id);
        if (!$id) {
            return $this->fail('参数错误');
        }
        Db::name('album_images')->where('album_id', $id)->delete();
        Db::name('albums')->where('id', $id)->delete();
        return $this->ok();
    }

    public function batchDelete()
    {
        $d   = $this->body();
        $ids = array_filter(array_map('intval', $d['ids'] ?? []));
        if (empty($ids)) {
            return $this->fail('请选择要删除的相册');
        }
        Db::name('album_images')->whereIn('album_id', $ids)->delete();
        Db::name('albums')->whereIn('id', $ids)->delete();
        return $this->ok();
    }

    public function toggleStatus($id)
    {
        $id     = intval($id);
        $d      = $this->body();
        $status = intval($d['status'] ?? 1);
        Db::name('albums')->where('id', $id)->update(['status' => $status]);
        return $this->ok();
    }

    protected function syncImageCount($albumId)
    {
        $cnt = Db::name('album_images')->where('album_id', $albumId)->count();
        Db::name('albums')->where('id', $albumId)->update(['image_count' => $cnt]);
    }
}
