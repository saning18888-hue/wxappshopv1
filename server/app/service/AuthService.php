<?php
namespace app\service;

use think\facade\Db;

/**
 * 会员与登录态（开发态使用 Mock 登录，真实环境替换为微信 code2Session）
 */
class AuthService
{
    /** 开发态登录：用任意 code 换取会员与 token */
    public function devLogin(string $code): array
    {
        $openid = 'mock_' . md5($code ?: 'dev');
        $user   = Db::name('users')->where('openid', $openid)->find();
        if (!$user) {
            $uid  = Db::name('users')->insertGetId([
                'openid'        => $openid,
                'nickname'      => '微信用户' . substr($openid, -4),
                'avatar'        => '/default-avatar.svg',
                'phone'         => '',
                'gender'        => 0,
                'level'         => 1,
                'growth'        => 0,
                'points'        => 0,
                'balance'       => 0.00,
                'group_id'      => 1,
                'source'        => '微信小程序',
                'auth_status'   => 1,
                'delete_status' => 0,
                'status'        => 1,
                'created_at'    => date('Y-m-d H:i:s'),
                'updated_at'    => date('Y-m-d H:i:s'),
            ]);
            $user = Db::name('users')->find($uid);
        } else {
            // 补齐早期开发态创建的会员可能缺失的字段
            $fill = [];
            if (empty($user['avatar']))       $fill['avatar'] = '/default-avatar.svg';
            if (empty($user['source']))       $fill['source'] = '微信小程序';
            if (empty($user['group_id']))     $fill['group_id'] = 1;
            if (empty($user['level']))        $fill['level'] = 1;
            if (!isset($user['auth_status'])) $fill['auth_status'] = 1;
            if (!empty($fill)) {
                $fill['updated_at'] = date('Y-m-d H:i:s');
                Db::name('users')->where('id', $user['id'])->update($fill);
                $user = array_merge($user, $fill);
            }
        }
        $token = $this->createToken($user['id']);
        return ['token' => $token, 'user' => $this->formatUser($user)];
    }

    /** 真实环境：用微信 code 换 openid 后建立会员绑定（预留） */
    public function wechatLogin(string $code): array
    {
        // TODO: 调用微信 jscode2session，用 AppId/AppSecret 换取 openid/unionid
        // $session = wx_jscode2session($code);
        // return $this->bindByOpenid($session['openid'], $session['unionid'] ?? '');
        throw new \Exception('真实微信登录待配置 AppId/AppSecret 后接入');
    }

    public function getUserByToken(?string $token): ?array
    {
        if (!$token) {
            return null;
        }
        $row = Db::name('user_tokens')->where('token', $token)->find();
        if (!$row) {
            return null;
        }
        if ($row['expire_at'] && strtotime($row['expire_at']) < time()) {
            return null;
        }
        return Db::name('users')->where('id', $row['user_id'])->find();
    }

    private function createToken(int $userId): string
    {
        $token = bin2hex(random_bytes(16));
        Db::name('user_tokens')->insert([
            'user_id'    => $userId,
            'token'      => $token,
            'expire_at'  => date('Y-m-d H:i:s', time() + 86400 * 30),
            'created_at' => date('Y-m-d H:i:s'),
        ]);
        return $token;
    }

    public function formatUser($u): array
    {
        return [
            'id'       => $u['id'],
            'nickname' => $u['nickname'],
            'avatar'   => $u['avatar'],
        ];
    }
}
