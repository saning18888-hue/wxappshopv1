<?php
namespace app\controller\admin;

use app\common\controller\AdminController;
use think\facade\Db;

/**
 * 相册图片管理（后台）
 */
class AlbumImage extends AdminController
{
    public function index()
    {
        $albumId = input('get.album_id/d', 0);
        $page    = input('get.page/d', 1);
        $size    = input('get.page_size/d', 50);

        if (!$albumId) {
            return $this->fail('相册ID不能为空');
        }

        $total    = Db::name('album_images')->where('album_id', $albumId)->count();
        $lastPage = max((int) ceil($total / $size), 1);
        $page     = min(max(1, $page), $lastPage);
        $list     = Db::name('album_images')->where('album_id', $albumId)
            ->order('sort asc, id desc')->page($page, $size)->select()->toArray();

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

    public function upload()
    {
        $d       = $this->body();
        $albumId = intval($d['album_id'] ?? 0);
        $url     = trim($d['image_url'] ?? '');

        if (!$albumId || !Db::name('albums')->where('id', $albumId)->find()) {
            return $this->fail('相册不存在');
        }
        if ($url === '') {
            return $this->fail('图片地址不能为空');
        }

        $id = Db::name('album_images')->insertGetId([
            'album_id'  => $albumId,
            'image_url' => $url,
            'name'      => $d['name'] ?? '',
            'is_cover'  => 0,
            'sort'      => 0,
        ]);

        $this->syncCover($albumId);
        $this->syncImageCount($albumId);

        return $this->ok(['id' => $id]);
    }

    public function save($id = 0)
    {
        $d  = $this->body();
        $id = $id ?: intval($d['id'] ?? 0);
        if (!$id) {
            return $this->fail('参数错误');
        }
        $row = Db::name('album_images')->where('id', $id)->find();
        if (!$row) {
            return $this->fail('图片不存在');
        }

        Db::name('album_images')->where('id', $id)->update([
            'name' => trim($d['name'] ?? ''),
            'sort' => intval($d['sort'] ?? 0),
        ]);

        $this->syncImageCount($row['album_id']);

        return $this->ok();
    }

    public function rename()
    {
        $d  = $this->body();
        $id = intval($d['id'] ?? 0);
        if (!$id) {
            return $this->fail('参数错误');
        }
        $row = Db::name('album_images')->where('id', $id)->find();
        if (!$row) {
            return $this->fail('图片不存在');
        }
        Db::name('album_images')->where('id', $id)->update(['name' => trim($d['name'] ?? '')]);
        return $this->ok();
    }

    public function remove($id)
    {
        $id = intval($id);
        if (!$id) {
            return $this->fail('参数错误');
        }
        $row = Db::name('album_images')->where('id', $id)->find();
        if (!$row) {
            return $this->fail('图片不存在');
        }
        $albumId = $row['album_id'];
        Db::name('album_images')->where('id', $id)->delete();
        $this->syncCover($albumId);
        $this->syncImageCount($albumId);
        return $this->ok();
    }

    public function batchDelete()
    {
        $d   = $this->body();
        $ids = array_filter(array_map('intval', $d['ids'] ?? []));
        if (empty($ids)) {
            return $this->fail('请选择要删除的图片');
        }
        $rows = Db::name('album_images')->whereIn('id', $ids)->column('album_id');
        Db::name('album_images')->whereIn('id', $ids)->delete();
        foreach (array_unique($rows) as $albumId) {
            $this->syncCover($albumId);
            $this->syncImageCount($albumId);
        }
        return $this->ok();
    }

    public function setCover()
    {
        $d       = $this->body();
        $id      = intval($d['id'] ?? 0);
        $albumId = intval($d['album_id'] ?? 0);
        if (!$id || !$albumId) {
            return $this->fail('参数错误');
        }
        Db::name('album_images')->where('album_id', $albumId)->update(['is_cover' => 0]);
        Db::name('album_images')->where('id', $id)->update(['is_cover' => 1]);

        $url = Db::name('album_images')->where('id', $id)->value('image_url');
        Db::name('albums')->where('id', $albumId)->update(['cover_image' => $url ?: '']);

        return $this->ok();
    }

    public function moveAlbum()
    {
        $d          = $this->body();
        $ids        = array_filter(array_map('intval', $d['ids'] ?? []));
        $targetId   = intval($d['target_album_id'] ?? 0);
        if (empty($ids) || !$targetId) {
            return $this->fail('参数错误');
        }
        if (!Db::name('albums')->where('id', $targetId)->find()) {
            return $this->fail('目标相册不存在');
        }

        $sourceIds = Db::name('album_images')->whereIn('id', $ids)->column('album_id');
        Db::name('album_images')->whereIn('id', $ids)->update(['album_id' => $targetId, 'is_cover' => 0]);

        foreach (array_unique(array_merge($sourceIds, [$targetId])) as $albumId) {
            $this->syncCover($albumId);
            $this->syncImageCount($albumId);
        }

        return $this->ok();
    }

    protected function syncCover($albumId)
    {
        $cover = Db::name('album_images')->where('album_id', $albumId)->where('is_cover', 1)->value('image_url');
        if (!$cover) {
            $cover = Db::name('album_images')->where('album_id', $albumId)->order('sort asc, id asc')->value('image_url');
        }
        Db::name('albums')->where('id', $albumId)->update(['cover_image' => $cover ?: '']);
    }

    protected function syncImageCount($albumId)
    {
        $cnt = Db::name('album_images')->where('album_id', $albumId)->count();
        Db::name('albums')->where('id', $albumId)->update(['image_count' => $cnt]);
    }
}
