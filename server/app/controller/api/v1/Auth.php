<?php
namespace app\controller\api\v1;

use app\common\controller\ApiController;

class Auth extends ApiController
{
    /** POST /api/v1/auth/dev_login  {code?} */
    public function devLogin()
    {
        $code = input('post.code', 'dev');
        if (env('DEV_MOCK_LOGIN', true) != true) {
            return $this->fail('Mock 登录已关闭，请使用真实微信登录', 403);
        }
        $res = (new \app\service\AuthService())->devLogin($code);
        return $this->ok($res);
    }

    /** GET /api/v1/user/info */
    public function info()
    {
        $user = $this->authUser();
        return $this->ok(['user' => $this->formatUser($user)]);
    }
}
