<?php
namespace app\controller\admin;

use app\common\controller\AdminController;
use think\facade\Db;

class OperationLog extends AdminController
{
    // 列表：支持账号/姓名/操作关键词、时间范围筛选、分页
    public function index()
    {
        $kw    = $this->request->get('keyword', '');
        $start = $this->request->get('time_start', '');
        $end   = $this->request->get('time_end', '');
        $page  = max(1, (int) $this->request->get('page', 1));
        $size  = max(1, (int) $this->request->get('page_size', 10));

        $db = Db::name('operation_logs');
        if ($kw !== '') {
            $db->where(function ($q) use ($kw) {
                $q->whereOr('admin_user', 'like', "%{$kw}%")
                  ->whereOr('admin_name', 'like', "%{$kw}%")
                  ->whereOr('action', 'like', "%{$kw}%");
            });
        }
        if ($start !== '') {
            $db->where('create_time', '>=', strtotime($start));
        }
        if ($end !== '') {
            $db->where('create_time', '<=', strtotime($end) + 86399);
        }

        $total = $db->count();
        $list  = $db->order('id', 'desc')
                    ->page($page, $size)
                    ->select()
                    ->toArray();

        return $this->ok([
            'list'       => $list,
            'pagination' => [
                'page'      => $page,
                'page_size' => $size,
                'total'     => $total,
                'pages'     => ceil($total / $size),
            ],
        ]);
    }

    // 详情
    public function info()
    {
        $id  = (int) $this->request->get('id', 0);
        $row = Db::name('operation_logs')->find($id);
        if (!$row) {
            return $this->fail('记录不存在');
        }
        return $this->ok($row);
    }

    // 批量删除（POST ids[]）
    public function batchDelete()
    {
        $ids = $this->request->post('ids/a', []);
        if (!is_array($ids) || !count($ids)) {
            return $this->fail('请选择要删除的记录');
        }
        $ids = array_map('intval', $ids);
        Db::name('operation_logs')->whereIn('id', $ids)->delete();
        return $this->ok([], '删除成功');
    }

    // 删除指定时间段内的日志（POST time_start/time_end/type=all）
    public function deleteByTime()
    {
        $type  = $this->request->post('type', '');
        $start = $this->request->post('time_start', '');
        $end   = $this->request->post('time_end', '');

        $db = Db::name('operation_logs');
        if ($type === 'all') {
            $db->where('id', '>', 0);
        } else {
            if ($start === '' && $end === '') {
                return $this->fail('请选择时间段');
            }
            if ($start !== '') {
                $db->where('create_time', '>=', strtotime($start));
            }
            if ($end !== '') {
                $db->where('create_time', '<=', strtotime($end) + 86399);
            }
        }
        $count = $db->delete();
        return $this->ok(['count' => $count], '删除成功');
    }
}
