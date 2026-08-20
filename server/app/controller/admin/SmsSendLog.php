<?php
namespace app\controller\admin;

use app\common\controller\AdminController;
use think\facade\Db;
use think\Request;

/**
 * 短信发送日志
 */
class SmsSendLog extends AdminController
{
    /**
     * 列表 /admin/sms_send_logs
     */
    public function index(Request $request)
    {
        $page  = max(1, intval($request->get('page', 1)));
        $size  = max(1, min(100, intval($request->get('size', 10))));
        $kw    = trim($request->get('kw', ''));

        $query = Db::table('sms_send_logs')->order('id', 'desc');
        if ($kw !== '') {
            $query->where(function ($q) use ($kw) {
                $q->where('phone', 'like', "%{$kw}%")
                  ->whereOr('template_key', 'like', "%{$kw}%")
                  ->whereOr('content', 'like', "%{$kw}%");
            });
        }

        $total = $query->count();
        $lastPage = max(1, ceil($total / $size));
        $list  = $query->page($page, $size)->select()->toArray();

        return $this->ok([
            'list'       => $list,
            'total'      => $total,
            'page'       => $page,
            'size'       => $size,
            'last_page'  => $lastPage,
        ]);
    }
}
