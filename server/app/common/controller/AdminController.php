<?php
namespace app\common\controller;

use think\facade\Db;
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
        // 自动记录非查询类操作日志
        $this->recordOperationLog();
    }

    /**
     * 自动记录管理员操作日志（仅记录 POST/PUT/DELETE/PATCH 写操作）
     */
    protected function recordOperationLog()
    {
        $method = $this->request->method();
        if (in_array($method, ['GET', 'HEAD', 'OPTIONS'])) {
            return;
        }
        $path = $this->request->pathinfo();
        if (strpos($path, 'operation_logs') !== false) {
            return; // 不记录日志管理自身的写操作，避免噪声
        }

        try {
            $moduleMap = [
                'goods_specs'   => '商品规格',
                'goods_attrs'   => '商品属性',
                'goods'         => '商品',
                'orders'        => '订单',
                'members'       => '会员',
                'member_groups' => '会员分组',
                'albums'        => '相册',
                'album'         => '相册',
                'mini_apps'     => '跳转小程序',
                'settings'      => '站点设置',
                'upload'        => '上传',
                'coupons'       => '卡券',
                'banners'       => 'Banner',
                'articles'      => '文章',
            ];
            $module = '其他';
            foreach ($moduleMap as $k => $label) {
                if (strpos($path, $k) !== false) {
                    $module = $label;
                    break;
                }
            }
            $actionType = '操作';
            if (stripos($path, 'delete') !== false || stripos($path, 'remove') !== false
                || $method === 'DELETE') {
                $actionType = '删除';
            } elseif (stripos($path, 'save') !== false || stripos($path, 'edit') !== false
                || in_array($method, ['POST', 'PUT', 'PATCH'])) {
                $actionType = '编辑';
            }
            $action = $actionType . $module;

            $param = $this->request->getInput();
            if (strlen($param) > 2000) {
                $param = substr($param, 0, 2000);
            }

            Db::name('operation_logs')->insert([
                'admin_user'  => env('ADMIN_USER', 'admin'),
                'admin_name'  => '超级管理员',
                'role'        => '超级管理员',
                'action'      => $action,
                'method'      => $method,
                'url'         => '/' . ltrim($path, '/'),
                'ip'          => $this->request->ip(),
                'param'       => $param,
                'create_time' => time(),
            ]);
        } catch (\Throwable $e) {
            // 日志记录失败不影响主流程
            trace($e->getMessage(), 'error');
        }
    }

    /** 解析 JSON/表单请求体 */
    protected function body(): array
    {
        $method = $this->request->method();
        if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'])) {
            $d = $this->request->post();
            if (empty($d)) {
                $raw = $this->request->getInput();
                $d   = json_decode($raw, true);
            }
        } else {
            $d = $this->request->get();
        }
        return is_array($d) ? $d : [];
    }
}
