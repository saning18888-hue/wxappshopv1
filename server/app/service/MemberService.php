<?php
namespace app\service;

use think\facade\Db;

/**
 * 会员（后台）服务：列表、详情、编辑、资产调整、分配员工/分销商、注销申请处理
 * 余额 balance 以「分」存储；成长值/积分/等级为整数。
 */
class MemberService
{
    // 注销申请状态
    const DELETE_PENDING = 1;   // 待审核
    const DELETE_APPROVED = 2;  // 已注销

    /** 列表（tab: all=全部, authorized=授权会员, logout=注销申请） */
    public function list($tab, $keyword, $page, $size)
    {
        $query = Db::table('users');
        if ($tab === 'authorized') {
            $query->where('auth_status', 1)->where('delete_status', 0);
        } elseif ($tab === 'logout') {
            $query->where('delete_status', self::DELETE_PENDING);
        } else {
            // all：默认可展示全部，但排除已注销
            $query->where('delete_status', '<>', self::DELETE_APPROVED);
        }
        if ($keyword !== null && $keyword !== '') {
            $query->where(function ($q) use ($keyword) {
                $q->where('nickname', 'like', "%{$keyword}%")
                  ->whereOr('phone', 'like', "%{$keyword}%");
            });
        }
        $total = $query->count();
        $rows = $query->order('id', 'desc')
            ->page($page, $size)
            ->select()
            ->toArray();

        $groups = $this->groupMap();
        $staff = $this->staffMap();
        $distributors = $this->distributorMap();

        foreach ($rows as &$r) {
            $r['balance_yuan'] = round($r['balance'] / 100, 2);
            $r['group_name'] = $groups[$r['group_id']] ?? '未分组';
            $r['staff_name'] = $staff[$r['staff_id']] ?? '';
            $r['distributor_name'] = $distributors[$r['distributor_id']] ?? '';
            $r['gender_text'] = $r['gender'] == 1 ? '男' : ($r['gender'] == 2 ? '女' : '未知');
            $r['auth_text'] = $r['auth_status'] == 1 ? '已授权' : '未授权';
        }
        return ['list' => $rows, 'total' => $total];
    }

    public function detail($id)
    {
        $r = Db::table('users')->where('id', $id)->find();
        if (!$r) return null;
        $r['balance_yuan'] = round($r['balance'] / 100, 2);
        $r['group_name'] = ($this->groupMap())[$r['group_id']] ?? '未分组';
        return $r;
    }

    /** 修改会员基本信息/资产/分组/备注 */
    public function update($id, $data)
    {
        $fields = [];
        $allow = ['nickname', 'phone', 'gender', 'level', 'growth', 'points',
                  'group_id', 'tags', 'staff_id', 'distributor_id'];
        foreach ($allow as $k) {
            if (array_key_exists($k, $data)) {
                $fields[$k] = $data[$k];
            }
        }
        if (array_key_exists('balance_yuan', $data)) {
            $fields['balance'] = intval(floatval($data['balance_yuan']) * 100);
        }
        if (empty($fields)) {
            return false;
        }
        $fields['updated_at'] = date('Y-m-d H:i:s');
        Db::table('users')->where('id', $id)->update($fields);
        return true;
    }

    /** 资产调整：type=growth|points|balance；action=add|subtract */
    public function adjust($id, $type, $action, $value)
    {
        $value = intval($value);
        if ($value <= 0) return false;
        if ($type === 'balance') {
            $value = intval(floatval($value) * 100); // 前端传元
        }
        $field = $type === 'growth' ? 'growth' : ($type === 'points' ? 'points' : 'balance');
        $current = Db::table('users')->where('id', $id)->value($field);
        $next = $action === 'subtract' ? max(0, $current - $value) : $current + $value;
        Db::table('users')->where('id', $id)->update([
            $field      => $next,
            'updated_at'=> date('Y-m-d H:i:s'),
        ]);
        return true;
    }

    public function assignStaff($id, $staffId)
    {
        Db::table('users')->where('id', $id)->update([
            'staff_id'   => intval($staffId),
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
        return true;
    }

    public function assignDistributor($id, $distributorId)
    {
        Db::table('users')->where('id', $id)->update([
            'distributor_id' => intval($distributorId),
            'updated_at'     => date('Y-m-d H:i:s'),
        ]);
        return true;
    }

    /** 处理注销申请：action=pass|reject */
    public function handleLogout($id, $action)
    {
        if ($action === 'pass') {
            Db::table('users')->where('id', $id)->update([
                'delete_status' => self::DELETE_APPROVED,
                'status'        => 0,
                'updated_at'    => date('Y-m-d H:i:s'),
            ]);
        } else {
            Db::table('users')->where('id', $id)->update([
                'delete_status'     => 0,
                'delete_reason'     => '',
                'delete_apply_time' => '',
                'updated_at'        => date('Y-m-d H:i:s'),
            ]);
        }
        return true;
    }

    public function groupMap()
    {
        $rows = Db::table('member_groups')->field('id,name')->select()->toArray();
        $m = [];
        foreach ($rows as $r) $m[$r['id']] = $r['name'];
        return $m;
    }

    public function staffMap()
    {
        $rows = Db::table('staff')->field('id,name')->select()->toArray();
        $m = [];
        foreach ($rows as $r) $m[$r['id']] = $r['name'];
        return $m;
    }

    public function distributorMap()
    {
        $rows = Db::table('distributors')->field('id,name')->select()->toArray();
        $m = [];
        foreach ($rows as $r) $m[$r['id']] = $r['name'];
        return $m;
    }

    public function groups()
    {
        return Db::table('member_groups')->order('level', 'asc')->select()->toArray();
    }

    public function staff()
    {
        return Db::table('staff')->order('id', 'asc')->select()->toArray();
    }

    public function distributors()
    {
        return Db::table('distributors')->order('id', 'asc')->select()->toArray();
    }
}
