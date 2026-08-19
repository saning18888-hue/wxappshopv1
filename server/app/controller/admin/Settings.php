<?php
namespace app\controller\admin;

use app\common\controller\AdminController;
use app\service\SettingsService;
use think\facade\Request;

class Settings extends AdminController
{
    // 读取当前基础设置（含默认值合并）
    public function get()
    {
        return $this->ok(SettingsService::get());
    }

    // 保存基础设置
    public function save()
    {
        $data = Request::post('config/a', []);
        if (!is_array($data)) $data = [];
        $cfg = SettingsService::save($data);
        return $this->ok($cfg);
    }
}
