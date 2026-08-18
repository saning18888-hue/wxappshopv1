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
            $r['staff_name'] = $staff[$r['staff_id']]['name'] ?? '';
            $r['staff_account'] = $staff[$r['staff_id']]['account'] ?? '';
            $r['distributor_name'] = $distributors[$r['distributor_id']]['name'] ?? '';
            $r['distributor_nickname'] = $distributors[$r['distributor_id']]['nickname'] ?? '';
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
        $staff = ($this->staffMap())[$r['staff_id']] ?? [];
        $r['staff_name'] = $staff['name'] ?? '';
        $r['staff_account'] = $staff['account'] ?? '';
        return $r;
    }

    /** 修改会员基本信息/资产/分组/备注 */
    public function update($id, $data)
    {
        $fields = [];
        $allow = ['nickname', 'phone', 'gender', 'level', 'growth', 'points',
                  'group_id', 'tags', 'staff_id', 'distributor_id', 'avatar'];
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

    /** 资产调整：type=growth|points|balance；mode=add 增加 / sub 减少 / final 最终值 */
    public function adjust($id, $type, $mode, $value)
    {
        $raw = floatval($value);
        if ($raw <= 0) return false;
        $field = $type === 'growth' ? 'growth' : ($type === 'points' ? 'points' : 'balance');
        $unit = $type === 'balance' ? 100 : 1; // 余额前端传元，需转分
        $delta = intval(round($raw * $unit));
        $current = Db::table('users')->where('id', $id)->value($field);
        if ($mode === 'final') {
            $next = max(0, $delta);
        } elseif ($mode === 'sub') {
            $next = max(0, $current - $delta);
        } else {
            $next = $current + $delta;
        }
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
        $rows = Db::table('staff')->field('id,name,account')->select()->toArray();
        $m = [];
        foreach ($rows as $r) $m[$r['id']] = ['name' => $r['name'], 'account' => $r['account']];
        return $m;
    }

    public function distributorMap()
    {
        $rows = Db::table('distributors')->field('id,name,nickname')->select()->toArray();
        $m = [];
        foreach ($rows as $r) $m[$r['id']] = ['name' => $r['name'], 'nickname' => $r['nickname']];
        return $m;
    }

    public function groups()
    {
        return Db::table('member_groups')->order('level', 'asc')->select()->toArray();
    }

    /** 会员分组管理列表（支持关键词筛选） */
    public function groupList($keyword)
    {
        $query = Db::table('member_groups');
        if ($keyword !== null && $keyword !== '') {
            $query->where('name', 'like', "%{$keyword}%");
        }
        return $query->order('level', 'asc')->order('id', 'asc')->select()->toArray();
    }

    public function groupCreate($data)
    {
        $name = trim($data['name'] ?? '');
        if ($name === '') {
            throw new \Exception('分组名称不能为空');
        }
        $exists = Db::table('member_groups')->where('name', $name)->find();
        if ($exists) {
            throw new \Exception('分组名称已存在');
        }
        Db::table('member_groups')->insert([
            'name'       => $name,
            'level'      => intval($data['level'] ?? 0),
            'discount'   => intval($data['discount'] ?? 100),
            'remark'     => trim($data['remark'] ?? ''),
            'created_at' => date('Y-m-d H:i:s'),
        ]);
        return true;
    }

    public function groupUpdate($id, $data)
    {
        $name = trim($data['name'] ?? '');
        if ($name === '') {
            throw new \Exception('分组名称不能为空');
        }
        $exists = Db::table('member_groups')->where('name', $name)->where('id', '<>', intval($id))->find();
        if ($exists) {
            throw new \Exception('分组名称已存在');
        }
        Db::table('member_groups')->where('id', intval($id))->update([
            'name'       => $name,
            'level'      => intval($data['level'] ?? 0),
            'discount'   => intval($data['discount'] ?? 100),
            'remark'     => trim($data['remark'] ?? ''),
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
        return true;
    }

    public function groupDelete($id)
    {
        $id = intval($id);
        $used = Db::table('users')->where('group_id', $id)->count();
        if ($used > 0) {
            throw new \Exception('该分组下存在会员，无法删除');
        }
        Db::table('member_groups')->where('id', $id)->delete();
        return true;
    }

    public function groupBatchDelete($ids)
    {
        $ids = array_map('intval', $ids);
        $ids = array_filter($ids);
        if (empty($ids)) {
            throw new \Exception('请选择要删除的分组');
        }
        $used = Db::table('users')->whereIn('group_id', $ids)->column('group_id');
        if (!empty($used)) {
            throw new \Exception('选中的分组中存在已关联会员的分组，无法删除');
        }
        Db::table('member_groups')->whereIn('id', $ids)->delete();
        return true;
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
