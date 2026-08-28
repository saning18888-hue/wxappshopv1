<?php
namespace app\common\controller;

use think\facade\Request;

/**
 * API 基类：统一 JSON 响应与登录态校验
 * 响应信封：{ code:0, msg:"success", data:{} }  （code=0 表示成功）
 */
class ApiController
{
    protected $request;

    public function __construct()
    {
        $this->request = Request::instance();
    }

    protected function ok($data = [], $msg = 'success', $code = 0)
    {
        return json(['code' => $code, 'msg' => $msg, 'data' => $data]);
    }

    protected function fail($msg = 'error', $code = 1, $httpStatus = 200)
    {
        return json(['code' => $code, 'msg' => $msg, 'data' => null], $httpStatus);
    }

    protected function bearerToken(): string
    {
        $h = $this->request->header('Authorization');
        if (!$h) {
            return '';
        }
        return preg_replace('/^Bearer\s+/i', '', $h);
    }

    /** 校验登录态，未登录直接返回 401 信封并终止 */
    protected function authUser()
    {
        $token = $this->bearerToken();
        $user  = (new \app\service\AuthService())->getUserByToken($token);
        if (!$user) {
            $this->fail('未登录或登录已过期', 401)->send();
            exit;
        }
        return $user;
    }

    protected function formatUser($u): array
    {
        return [
            'id'        => $u['id'],
            'nickname'  => $u['nickname'],
            'avatar'    => $u['avatar'],
            'points'    => intval($u['points'] ?? 0),
            'balance'   => floatval($u['balance'] ?? 0),
            'coupon'    => 0, // MVP 预留，后续接入优惠券统计
        ];
    }
}
