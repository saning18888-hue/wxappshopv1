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

    /**
     * 远程附件配置连通性测试（仅校验必填项，真实连接需接入对应 SDK）
     */
    public function attachmentTest()
    {
        $cfg = $this->request->post('attachment/a', []);
        $mode = $cfg['mode'] ?? 'local';

        if ($mode === 'local') {
            return $this->ok([], '系统默认无需测试');
        }
        if ($mode === 'ftp') {
            if (empty($cfg['ftp']['host']) || empty($cfg['ftp']['user'])) {
                return $this->fail('FTP 服务器地址和账号不能为空');
            }
            // TODO: 接入 ftp_ssl_connect / ftp_connect 真实测试
            return $this->ok([], '配置格式校验通过（真实连接待接入 FTP 扩展）');
        }
        if ($mode === 'aliyun') {
            if (empty($cfg['aliyun']['access_key_id']) || empty($cfg['aliyun']['access_key_secret']) || empty($cfg['aliyun']['bucket'])) {
                return $this->fail('Access Key ID、Access Key Secret 和 Bucket 不能为空');
            }
            // TODO: 接入阿里云 OSS SDK 真实测试
            return $this->ok([], '配置格式校验通过（真实连接待接入阿里云 OSS SDK）');
        }
        if ($mode === 'qiniu') {
            if (empty($cfg['qiniu']['access_key']) || empty($cfg['qiniu']['secret_key']) || empty($cfg['qiniu']['bucket'])) {
                return $this->fail('Accesskey、Secretkey 和 Bucket 不能为空');
            }
            // TODO: 接入七牛 SDK 真实测试
            return $this->ok([], '配置格式校验通过（真实连接待接入七牛 SDK）');
        }
        if ($mode === 'tencent') {
            if (empty($cfg['tencent']['secret_id']) || empty($cfg['tencent']['secret_key']) || empty($cfg['tencent']['bucket'])) {
                return $this->fail('SecretID、SecretKEY 和 Bucket 不能为空');
            }
            // TODO: 接入腾讯云 COS SDK 真实测试
            return $this->ok([], '配置格式校验通过（真实连接待接入腾讯云 COS SDK）');
        }
        return $this->fail('不支持的存储类型');
    }
}
