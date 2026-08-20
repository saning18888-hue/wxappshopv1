<?php
namespace app\controller\admin;

use app\common\controller\AdminController;
use think\facade\Db;
use think\Request;

/**
 * 商家联系人管理
 */
class SmsContact extends AdminController
{
    /**
     * 列表 /admin/sms_contacts
     */
    public function index(Request $request)
    {
        $page  = max(1, intval($request->get('page', 1)));
        $size  = max(1, min(100, intval($request->get('size', 10))));
        $kw    = trim($request->get('kw', ''));
        $enabled = $request->get('enabled');

        $query = Db::table('sms_contacts')->order('id', 'desc');
        if ($kw !== '') {
            $query->where(function ($q) use ($kw) {
                $q->where('name', 'like', "%{$kw}%")
                  ->whereOr('phone', 'like', "%{$kw}%");
            });
        }
        if ($enabled !== '' && $enabled !== null) {
            $query->where('enabled', intval($enabled));
        }

        $total = $query->count();
        $lastPage = max(1, ceil($total / $size));
        $list  = $query->page($page, $size)->select()->toArray();
        foreach ($list as &$row) {
            $row['subscribe'] = json_decode($row['subscribe'] ?? '[]', true) ?: [];
        }

        return $this->ok([
            'list'       => $list,
            'total'      => $total,
            'page'       => $page,
            'size'       => $size,
            'last_page'  => $lastPage,
        ]);
    }

    /**
     * 新增 /admin/sms_contacts POST
     */
    public function save(Request $request)
    {
        $name      = trim($request->post('name', ''));
        $phone     = trim($request->post('phone', ''));
        $enabled   = intval($request->post('enabled', 1));
        $subscribe = (array) $request->post('subscribe', []);

        if ($name === '' || $phone === '') {
            return $this->fail('姓名和手机号不能为空');
        }
        if (!preg_match('/^1\d{10}$/', $phone)) {
            return $this->fail('手机号格式不正确');
        }
        if (Db::table('sms_contacts')->where('phone', $phone)->find()) {
            return $this->fail('该手机号已存在');
        }

        $now = time();
        Db::table('sms_contacts')->insert([
            'name'        => $name,
            'phone'       => $phone,
            'enabled'     => $enabled,
            'subscribe'   => json_encode(array_values($subscribe), JSON_UNESCAPED_UNICODE),
            'create_time' => $now,
            'update_time' => $now,
        ]);
        return $this->ok([], '新增成功');
    }

    /**
     * 编辑 /admin/sms_contacts/:id PUT
     */
    public function update(Request $request, $id)
    {
        $id = intval($id);
        $row = Db::table('sms_contacts')->where('id', $id)->find();
        if (!$row) {
            return $this->fail('记录不存在');
        }

        $name      = trim($request->put('name', ''));
        $phone     = trim($request->put('phone', ''));
        $enabled   = intval($request->put('enabled', $row['enabled']));
        $subscribe = (array) $request->put('subscribe', []);

        if ($name === '' || $phone === '') {
            return $this->fail('姓名和手机号不能为空');
        }
        if (!preg_match('/^1\d{10}$/', $phone)) {
            return $this->fail('手机号格式不正确');
        }
        $same = Db::table('sms_contacts')->where('phone', $phone)->where('id', '<>', $id)->find();
        if ($same) {
            return $this->fail('该手机号已存在');
        }

        Db::table('sms_contacts')->where('id', $id)->update([
            'name'        => $name,
            'phone'       => $phone,
            'enabled'     => $enabled,
            'subscribe'   => json_encode(array_values($subscribe), JSON_UNESCAPED_UNICODE),
            'update_time' => time(),
        ]);
        return $this->ok([], '保存成功');
    }

    /**
     * 删除 /admin/sms_contacts/:id DELETE
     */
    public function delete($id)
    {
        $id = intval($id);
        $row = Db::table('sms_contacts')->where('id', $id)->find();
        if (!$row) {
            return $this->fail('记录不存在');
        }
        Db::table('sms_contacts')->where('id', $id)->delete();
        return $this->ok([], '删除成功');
    }

    /**
     * 切换启用状态 /admin/sms_contacts/:id/toggle POST
     */
    public function toggle(Request $request, $id)
    {
        $id = intval($id);
        $row = Db::table('sms_contacts')->where('id', $id)->find();
        if (!$row) {
            return $this->fail('记录不存在');
        }
        $enabled = intval($request->post('enabled', $row['enabled'] ? 0 : 1));
        Db::table('sms_contacts')->where('id', $id)->update(['enabled' => $enabled, 'update_time' => time()]);
        return $this->ok(['enabled' => $enabled], '状态已更新');
    }
}
