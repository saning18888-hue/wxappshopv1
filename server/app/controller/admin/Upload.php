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
}
