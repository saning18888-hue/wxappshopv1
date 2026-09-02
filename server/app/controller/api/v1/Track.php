<?php
namespace app\controller\api\v1;

use app\common\controller\ApiController;
use think\facade\Db;

/**
 * 流量埋点（无需登录）
 * - visitor：冷启动时登记一次访客会话（唯一 session_id，is_new 区分新老访客）
 * - page_view：每次页面曝光插入一条，并累加会话浏览页数
 * 数据写入 page_views / visitor_sessions，供后台「网站分析 / 交易分析访客 / 商品分析浏览」使用。
 */
class Track extends ApiController
{
    private function clientIp(): string
    {
        $h = $this->request->header('X-Real-IP') ?: $this->request->header('X-Forwarded-For');
        if ($h) {
            $h = trim(explode(',', $h)[0]);
        }
        if (!$h) {
            $h = $this->request->ip();
        }
        return $h ?: '0.0.0.0';
    }

    /** 可选登录态：未登录返回 0 */
    private function optionalUserId(): int
    {
        $token = $this->bearerToken();
        if (!$token) {
            return 0;
        }
        $user = (new \app\service\AuthService())->getUserByToken($token);
        return $user ? (int) $user['id'] : 0;
    }

    /** POST /api/v1/track/visitor  {session_id, is_new} */
    public function visitor()
    {
        $sessionId = trim(input('post.session_id/s', ''));
        if (!$sessionId) {
            return $this->fail('缺少 session_id');
        }
        $userId = $this->optionalUserId();
        $isNew  = input('post.is_new/d', 1);
        $ip     = $this->clientIp();

        $ex = Db::name('visitor_sessions')->where('session_id', $sessionId)->find();
        if (!$ex) {
            Db::name('visitor_sessions')->insert([
                'session_id' => $sessionId,
                'user_id'    => $userId,
                'ip'         => $ip,
                'is_new'     => $isNew,
                'page_count' => 1,
                'created_at' => date('Y-m-d H:i:s'),
            ]);
        }
        return $this->ok([]);
    }

    /** POST /api/v1/track/page_view  {session_id, page, stay_time?} */
    public function pageView()
    {
        $sessionId = trim(input('post.session_id/s', ''));
        $page      = trim(input('post.page/s', ''));
        if (!$sessionId || !$page) {
            return $this->fail('参数错误');
        }
        $userId = $this->optionalUserId();
        $stay   = intval(input('post.stay_time/d', 0));
        $ip     = $this->clientIp();

        Db::name('page_views')->insert([
            'session_id' => $sessionId,
            'user_id'    => $userId,
            'page'       => $page,
            'ip'         => $ip,
            'stay_time'  => $stay,
            'is_bounce'  => 0,
            'created_at' => date('Y-m-d H:i:s'),
        ]);
        // 累加会话浏览页数（用于跳出率）
        Db::name('visitor_sessions')->where('session_id', $sessionId)->inc('page_count')->update();

        return $this->ok([]);
    }
}
