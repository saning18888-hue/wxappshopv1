<?php
namespace app\controller\admin;

use app\common\controller\AdminController;
use app\service\SettingsService;
use think\facade\Db;
use think\Request;

/**
 * 短信发送接口
 * 当前为模拟发送（演示/测试环境），真实环境需接入阿里云/腾讯云 SDK。
 */
class SmsSend extends AdminController
{
    /**
     * 单条发送测试 /admin/sms_send
     */
    public function send(Request $request)
    {
        $phone       = trim($request->post('phone', ''));
        $templateKey = trim($request->post('template_key', ''));
        $platform    = trim($request->post('platform', ''));
        $params      = (array) $request->post('params', []);

        if (!preg_match('/^1\d{10}$/', $phone)) {
            return $this->fail('手机号格式不正确');
        }
        if ($templateKey === '') {
            return $this->fail('请选择模板');
        }
        if (!in_array($platform, ['aliyun', 'tencent'])) {
            return $this->fail('请选择短信平台');
        }

        $result = $this->doSend($platform, $phone, $templateKey, $params);
        return $this->ok($result, $result['ok'] ? '发送成功（演示模式）' : '发送失败：' . $result['message']);
    }

    /**
     * 按联系人批量发送 /admin/sms_send_batch
     */
    public function batch(Request $request)
    {
        $templateKey = trim($request->post('template_key', ''));
        $platform    = trim($request->post('platform', ''));
        $params      = (array) $request->post('params', []);

        if ($templateKey === '') {
            return $this->fail('请选择模板');
        }
        if (!in_array($platform, ['aliyun', 'tencent'])) {
            return $this->fail('请选择短信平台');
        }

        $contacts = Db::table('sms_contacts')
            ->where('enabled', 1)
            ->whereLike('subscribe', "%\"{$templateKey}\"%")
            ->select()
            ->toArray();

        $success = 0;
        $fail    = 0;
        foreach ($contacts as $c) {
            $r = $this->doSend($platform, $c['phone'], $templateKey, $params, true);
            $r['ok'] ? $success++ : $fail++;
        }

        return $this->ok([
            'total'   => count($contacts),
            'success' => $success,
            'fail'    => $fail,
        ], '批量发送完成');
    }

    /**
     * 内部发送逻辑
     */
    private function doSend($platform, $phone, $templateKey, $params = [], $silent = false)
    {
        $settings  = SettingsService::get();
        $templates = ($settings['sms_templates'] ?? [])[$platform] ?? [];
        $tpl       = $templates[$templateKey] ?? null;

        if (!$tpl || !is_array($tpl)) {
            return ['ok' => false, 'message' => '模板不存在', 'config_key' => ''];
        }

        $content = $tpl['content'] ?? '';
        if ($platform === 'aliyun') {
            foreach ((array) $params as $k => $v) {
                $content = str_replace('${' . $k . '}', $v, $content);
            }
        } else {
            $i = 1;
            foreach ((array) $params as $v) {
                $content = str_replace('{' . $i . '}', $v, $content);
                $i++;
            }
        }

        $configKey   = $platform === 'aliyun' ? 'ALI_SMS_CONFIG' : 'TENCENT_SMS_CONFIG';
        $providerCfg = $settings['sms'][$platform] ?? [];

        // 校验是否启用及配置完整
        $missing = [];
        if (empty($providerCfg['enabled'])) {
            $missing[] = '平台未启用';
        }
        if ($platform === 'aliyun') {
            if (empty($providerCfg['access_key_id']))     $missing[] = 'AccessKeyId';
            if (empty($providerCfg['access_key_secret'])) $missing[] = 'AccessKeySecret';
            if (empty($providerCfg['sign_name']))          $missing[] = '短信签名';
        } elseif ($platform === 'tencent') {
            if (empty($providerCfg['app_id']))     $missing[] = 'AppId';
            if (empty($providerCfg['app_key']))      $missing[] = 'AppKey';
            if (empty($providerCfg['sign_name']))    $missing[] = '短信签名';
        }

        if (!empty($missing)) {
            $result = ['ok' => false, 'Message' => '配置不完整：' . implode('、', $missing), 'RequestId' => ''];
            $this->recordLog($phone, $templateKey, $content, $result, $configKey);
            return $result;
        }

        // 模拟发送成功（演示环境）
        $result = [
            'ok'        => true,
            'Message'   => 'OK',
            'RequestId' => 'MOCK-' . strtoupper(substr(uniqid(), -10)),
            'provider'  => $platform,
        ];

        $this->recordLog($phone, $templateKey, $content, $result, $configKey);
        return $result;
    }

    /**
     * 写入发送日志
     */
    private function recordLog($phone, $templateKey, $content, $result, $configKey)
    {
        Db::table('sms_send_logs')->insert([
            'phone'        => $phone,
            'template_key' => $templateKey,
            'content'      => $content,
            'result'       => json_encode($result, JSON_UNESCAPED_UNICODE),
            'config_key'   => $configKey,
            'create_time'  => time(),
        ]);
    }
}
