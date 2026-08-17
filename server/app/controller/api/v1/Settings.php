<?php
namespace app\controller\api\v1;

use app\service\SettingsService;

class Settings extends ApiController
{
    // 下发基础设置给小程序（同样合并默认值）
    public function get()
    {
        return $this->ok(SettingsService::get());
    }
}
