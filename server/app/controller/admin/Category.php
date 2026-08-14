<?php
namespace app\controller\admin;

use app\common\controller\AdminController;
use think\facade\Db;

/**
 * 分类管理（后台）：提供下拉选项
 */
class Category extends AdminController
{
    public function index()
    {
        $rows = Db::name('categories')->order('sort asc, id asc')->select()->toArray();
        return $this->ok($rows);
    }
}
