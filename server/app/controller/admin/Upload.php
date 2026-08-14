<?php
namespace app\controller\admin;

use app\common\controller\AdminController;

/**
 * 通用图片上传（后台）
 */
class Upload extends AdminController
{
    public function image()
    {
        $file = request()->file('file');
        if (!$file) {
            return $this->fail('请选择文件');
        }

        try {
            validate(['file' => ['fileSize' => 2 * 1024 * 1024, 'fileExt' => 'jpg,jpeg,png,gif,webp']])
                ->check(['file' => $file]);
        } catch (\think\exception\ValidateException $e) {
            return $this->fail($e->getMessage());
        }

        $ext      = strtolower($file->extension() ?: 'png');
        $hash     = md5_file($file->getPathname());
        $date     = date('Ymd');
        $saveDir  = app()->getRootPath() . 'public/uploads/categories/' . $date;
        if (!is_dir($saveDir)) {
            mkdir($saveDir, 0755, true);
        }
        $filename = $hash . '.' . $ext;
        $info     = $file->move($saveDir, $filename);
        if (!$info) {
            return $this->fail($file->getError() ?: '上传失败');
        }

        $url = request()->domain() . '/uploads/categories/' . $date . '/' . $info->getFilename();
        return $this->ok(['url' => $url, 'path' => 'uploads/categories/' . $date . '/' . $info->getFilename()]);
    }

    /**
     * 首页轮播图图片上传
     */
    public function bannerImage()
    {
        return $this->store('banner', 2 * 1024 * 1024, 'jpg,jpeg,png,gif,webp');
    }

    /**
     * 首页轮播视频上传
     */
    public function video()
    {
        return $this->store('banner', 20 * 1024 * 1024, 'mp4,mov,webm,ogg');
    }

    /**
     * 通用存储：校验 -> 按日期哈希落盘 -> 返回可访问 URL
     */
    private function store(string $subdir, int $maxSize, string $exts)
    {
        $file = request()->file('file');
        if (!$file) {
            return $this->fail('请选择文件');
        }

        try {
            validate(['file' => ['fileSize' => $maxSize, 'fileExt' => $exts]])
                ->check(['file' => $file]);
        } catch (\think\exception\ValidateException $e) {
            return $this->fail($e->getMessage());
        }

        $ext     = strtolower($file->extension() ?: 'bin');
        $hash    = md5_file($file->getPathname());
        $date    = date('Ymd');
        $saveDir = app()->getRootPath() . 'public/uploads/' . $subdir . '/' . $date;
        if (!is_dir($saveDir)) {
            mkdir($saveDir, 0755, true);
        }
        $filename = $hash . '.' . $ext;
        $info     = $file->move($saveDir, $filename);
        if (!$info) {
            return $this->fail($file->getError() ?: '上传失败');
        }

        $rel = 'uploads/' . $subdir . '/' . $date . '/' . $info->getFilename();
        $url = request()->domain() . '/' . $rel;
        return $this->ok(['url' => $url, 'path' => $rel]);
    }
}
