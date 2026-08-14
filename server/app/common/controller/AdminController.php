<?php
namespace app\common\controller;

use think\facade\Request;

/**
 * 运营后台基类：统一 JSON 响应 + 简单口令 Token 校验
 * 登录后前端携带请求头 X-Admin-Token，后端按 ADMIN_USER/ADMIN_SECRET 派生校验
 */
class AdminController
{
    protected $request;

    public function __construct()
    {
        $this->request = Request::instance();
        $this->authAdmin();
    }

    protected function ok($data = [], $msg = 'success', $code = 0)
    {
        return json(['code' => $code, 'msg' => $msg, 'data' => $data]);
    }

    protected function fail($msg = 'error', $code = 1, $httpStatus = 200)
    {
        return json(['code' => $code, 'msg' => $msg, 'data' => null], $httpStatus);
    }

    protected function authAdmin()
    {
        $token    = $this->request->header('X-Admin-Token');
        $expected = hash('sha256', env('ADMIN_USER') . ':' . env('ADMIN_SECRET'));
        if (!$token || !hash_equals($expected, $token)) {
            $this->fail('未授权，请先登录', 401)->send();
            exit;
        }
    }

    /** 解析 JSON 请求体（不依赖框架输入过滤，最稳妥） */
    protected function body(): array
    {
        $raw = file_get_contents('php://input');
        $d   = json_decode($raw, true);
        return is_array($d) ? $d : [];
    }
}
