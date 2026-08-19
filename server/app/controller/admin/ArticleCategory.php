<?php
namespace app\controller\admin;

use app\common\controller\AdminController;
use think\facade\Db;

/**
 * 文章分类管理（后台）
 */
class ArticleCategory extends AdminController
{
    public function index()
    {
        $kw   = input('get.keyword/s', '');
        $page = input('get.page/d', 1);
        $size = input('get.page_size/d', 20);

        $rows = Db::name('article_categories')->order('sort asc, id asc')->select()->toArray();

        if ($kw !== '') {
            $rows = array_values(array_filter($rows, fn ($r) => stripos($r['name'], $kw) !== false));
        }

        $total    = count($rows);
        $lastPage = max((int) ceil($total / $size), 1);
        $page     = min(max(1, $page), $lastPage);
        $list     = array_slice($rows, ($page - 1) * $size, $size);

        return $this->ok([
            'list' => $list,
            'pagination' => [
                'page'      => $page,
                'page_size' => $size,
                'total'     => $total,
                'last_page' => $lastPage,
            ],
        ]);
    }

    /** 下拉树（含顶级分类） */
    public function tree()
    {
        $rows = Db::name('article_categories')
            ->field('id,parent_id,name')
            ->order('sort asc, id asc')
            ->select()
            ->toArray();
        $tree = $this->buildTree($rows, 0);
        array_unshift($tree, ['id' => 0, 'name' => '顶级分类', 'level' => -1, 'children' => []]);
        return $this->ok($tree);
    }

    public function save($id = 0)
    {
        $d       = $this->body();
        $id      = $id ?: intval($d['id'] ?? 0);
        $name    = trim($d['name'] ?? '');
        if ($name === '') {
            return $this->fail('分类名称不能为空');
        }
        $parentId = intval($d['parent_id'] ?? 0);
        if ($parentId && !Db::name('article_categories')->where('id', $parentId)->find()) {
            return $this->fail('上级分类不存在');
        }
        if ($id && $parentId == $id) {
            return $this->fail('不能选择自己作为上级分类');
        }

        $fields = [
            'name'       => $name,
            'parent_id'  => $parentId,
            'sort'       => intval($d['sort'] ?? 0),
            'cover_image'=> trim($d['cover_image'] ?? ''),
            'status'     => intval($d['status'] ?? 1),
        ];

        if ($id) {
            if ($parentId) {
                $children = $this->getChildIds($id);
                if (in_array($parentId, $children)) {
                    return $this->fail('不能选择当前分类的子分类作为上级');
                }
            }
            Db::name('article_categories')->where('id', $id)->update($fields);
        } else {
            $id = Db::name('article_categories')->insertGetId($fields);
        }

        return $this->ok(['id' => $id]);
    }

    public function remove($id)
    {
        $id = intval($id);
        if (!$id) {
            return $this->fail('参数错误');
        }
        if (Db::name('article_categories')->where('parent_id', $id)->find()) {
            return $this->fail('请先删除该分类下的子分类');
        }
        if (Db::name('articles')->where('category_id', $id)->find()) {
            return $this->fail('该分类下存在文章，无法删除');
        }
        Db::name('article_categories')->where('id', $id)->delete();
        return $this->ok();
    }

    public function toggleStatus($id)
    {
        $id      = intval($id);
        $d       = $this->body();
        $status  = intval($d['status'] ?? 1);
        Db::name('article_categories')->where('id', $id)->update(['status' => $status]);
        return $this->ok();
    }

    protected function buildTree(array $rows, int $pid, int $depth = 0): array
    {
        $tree = [];
        foreach ($rows as $row) {
            if ($row['parent_id'] == $pid) {
                $row['level']      = $depth;
                $row['children']   = $this->buildTree($rows, $row['id'], $depth + 1);
                $tree[] = $row;
            }
        }
        return $tree;
    }

    protected function getChildIds(int $id): array
    {
        $ids  = [];
        $rows = Db::name('article_categories')->field('id,parent_id')->select()->toArray();
        $this->collectChildren($rows, $id, $ids);
        return $ids;
    }

    protected function collectChildren(array $rows, int $pid, array &$ids): void
    {
        foreach ($rows as $row) {
            if ($row['parent_id'] == $pid) {
                $ids[] = $row['id'];
                $this->collectChildren($rows, $row['id'], $ids);
            }
        }
    }
}
