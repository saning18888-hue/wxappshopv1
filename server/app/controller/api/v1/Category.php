<?php
namespace app\controller\api\v1;

use app\common\controller\ApiController;
use think\facade\Db;

class Category extends ApiController
{
    /** GET /api/v1/categories */
    public function index()
    {
        $rows = Db::name('categories')->where('is_show', 1)
            ->order('sort asc, id asc')->select()->toArray();
        $tree = [];
        foreach ($rows as $r) {
            if ($r['parent_id'] == 0) {
                $r['children'] = [];
                $tree[$r['id']] = $r;
            }
        }
        foreach ($rows as $r) {
            if ($r['parent_id'] > 0 && isset($tree[$r['parent_id']])) {
                $tree[$r['parent_id']]['children'][] = $r;
            }
        }
        return $this->ok(['list' => array_values($tree)]);
    }
}
