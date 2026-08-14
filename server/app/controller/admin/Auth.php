<?php
namespace app\controller\admin;

use app\common\controller\ApiController;

/**
 * 后台登录：校验 .env 中的 ADMIN_USER / ADMIN_PASS，返回派生 Token
 */
class Auth extends ApiController
{
    public function login()
    {
        $data = $this->request->post();
        if (empty($data)) {
            $raw  = $this->request->getInput();
            $data = json_decode($raw, true) ?: [];
        }
        $user = trim($data['username'] ?? '');
        $pass = (string) ($data['password'] ?? '');

        if ($user === env('ADMIN_USER') && $pass === env('ADMIN_PASS')) {
            $token = hash('sha256', $user . ':' . env('ADMIN_SECRET'));
            return $this->ok(['token' => $token, 'username' => $user]);
        }
        return $this->fail('账号或密码错误', 401);
    }
}
