<?php
namespace app\controller\admin;

use app\common\controller\AdminController;
use app\service\MemberService;
use app\service\SettingsService;

/**
 * 会员管理（后台）
 * 列表 / 详情 / 编辑 / 资产调整 / 分配员工 / 分配分销商 / 注销申请处理 / 会员协议
 */
class Member extends AdminController
{
    public function index()
    {
        $tab  = input('get.tab/s', 'all');
        $kw   = input('get.keyword/s', '');
        $page = input('get.page/d', 1);
        $size = input('get.page_size/d', 20);
        $data = (new MemberService())->list(
            $tab, $kw ?: null, $page, $size
        );
        return $this->ok($data);
    }

    public function detail($id)
    {
        $d = (new MemberService())->detail(intval($id));
        if (!$d) {
            return $this->fail('会员不存在', 404);
        }
        return $this->ok($d);
    }

    /** 修改会员资料/资产/分组/备注 */
    public function save($id)
    {
        $d = $this->body();
        (new MemberService())->update(intval($id), $d);
        return $this->ok();
    }

    /** 成长值/积分/余额调整 */
    public function adjust($id)
    {
        $d     = $this->body();
        $type  = trim($d['type'] ?? '');
        $action = trim($d['action'] ?? 'add');
        $value = floatval($d['value'] ?? 0);
        if (!in_array($type, ['growth', 'points', 'balance'])) {
            return $this->fail('无效的调整类型');
        }
        (new MemberService())->adjust(intval($id), $type, $action, $value);
        return $this->ok();
    }

    public function assignStaff($id)
    {
        $d = $this->body();
        (new MemberService())->assignStaff(intval($id), intval($d['staff_id'] ?? 0));
        return $this->ok();
    }

    public function assignDistributor($id)
    {
        $d = $this->body();
        (new MemberService())->assignDistributor(intval($id), intval($d['distributor_id'] ?? 0));
        return $this->ok();
    }

    /** 处理注销申请：pass / reject */
    public function logout($id)
    {
        $d = $this->body();
        $action = trim($d['action'] ?? '');
        if (!in_array($action, ['pass', 'reject'])) {
            return $this->fail('无效操作');
        }
        (new MemberService())->handleLogout(intval($id), $action);
        return $this->ok();
    }

    public function groups()
    {
        return $this->ok((new MemberService())->groups());
    }

    public function staffList()
    {
        return $this->ok((new MemberService())->staff());
    }

    public function distributorList()
    {
        return $this->ok((new MemberService())->distributors());
    }

    /** 读取会员协议 */
    public function agreement()
    {
        $cfg = SettingsService::get();
        return $this->ok(['content' => $cfg['member_agreement'] ?? '']);
    }

    /** 保存会员协议 */
    public function saveAgreement()
    {
        $d = $this->body();
        SettingsService::save(['member_agreement' => trim($d['content'] ?? '')]);
        return $this->ok();
    }
}
