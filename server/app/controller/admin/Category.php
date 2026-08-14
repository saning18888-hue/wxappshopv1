<?php
namespace app\controller\admin;

use app\common\controller\AdminController;
use think\facade\Db;

/**
 * 商品分类管理（后台）
 */
class Category extends AdminController
{
    public function index()
    {
        $kw   = input('get.keyword/s', '');
        $page = input('get.page/d', 1);
        $size = input('get.page_size/d', 20);

        $allRows = Db::name('categories')->order('sort asc, id asc')->select()->toArray();

        // 搜索时保留匹配节点、其祖先及其后代，确保树形结构完整
        if ($kw !== '') {
            $parentMap = [];
            foreach ($allRows as $r) {
                $parentMap[$r['id']] = $r['parent_id'];
            }
            $matchedIds = [];
            foreach ($allRows as $r) {
                if (stripos($r['name'], $kw) !== false) {
                    $matchedIds[] = $r['id'];
                }
            }
            $includeIds = [];
            foreach ($matchedIds as $mid) {
                $includeIds[$mid] = 1;
                $pid = $parentMap[$mid] ?? 0;
                while ($pid) {
                    $includeIds[$pid] = 1;
                    $pid = $parentMap[$pid] ?? 0;
                }
            }
            $byParent = [];
            foreach ($allRows as $r) {
                $byParent[$r['parent_id']][] = $r;
            }
            $collectDesc = function ($pid) use (&$collectDesc, $byParent, &$includeIds) {
                if (!isset($byParent[$pid])) {
                    return;
                }
                foreach ($byParent[$pid] as $c) {
                    $includeIds[$c['id']] = 1;
                    $collectDesc($c['id']);
                }
            };
            foreach ($matchedIds as $mid) {
                $collectDesc($mid);
            }
            $allRows = array_values(array_filter($allRows, fn ($r) => isset($includeIds[$r['id']])));
        }

        $tree  = $this->buildTree($allRows, 0);
        $roots = array_values(array_filter($tree, fn ($r) => $r['parent_id'] == 0));

        $total    = count($roots);
        $lastPage = max((int) ceil($total / $size), 1);
        $page     = min(max(1, $page), $lastPage);
        $rootsNow = array_slice($roots, ($page - 1) * $size, $size);

        $flat = [];
        $this->flattenTree($rootsNow, $flat);

        return $this->ok([
            'list' => $flat,
            'pagination' => [
                'page'      => $page,
                'page_size' => $size,
                'total'     => $total,
                'last_page' => $lastPage,
            ],
        ]);
    }

    public function tree()
    {
        $rows  = Db::name('categories')
            ->field('id,parent_id,name')
            ->order('sort asc, id asc')
            ->select()
            ->toArray();
        $tree  = $this->buildTree($rows, 0);
        array_unshift($tree, ['id' => 0, 'name' => '顶级分类', 'level' => -1, 'children' => []]);
        return $this->ok($tree);
    }

    public function save($id = 0)
    {
        $d     = $this->body();
        $id    = $id ?: intval($d['id'] ?? 0);
        $name  = trim($d['name'] ?? '');
        if ($name === '') {
            return $this->fail('分类名称不能为空');
        }

        $parentId = intval($d['parent_id'] ?? 0);
        if ($parentId && !Db::name('categories')->where('id', $parentId)->find()) {
            return $this->fail('上级分类不存在');
        }
        if ($id && $parentId == $id) {
            return $this->fail('不能选择自己作为上级分类');
        }

        // 分类最多三级（level 0/1/2）
        $parentDepth = $parentId ? $this->getDepth($parentId) : -1;
        $height      = $id ? $this->subtreeHeight($id) : 0;
        if ($parentDepth + 1 + $height > 2) {
            return $this->fail('分类最多三级，选择的上级分类层级太深');
        }

        $fields = [
            'name'       => $name,
            'parent_id'  => $parentId,
            'icon'       => trim($d['icon'] ?? ''),
            'sort'       => intval($d['sort'] ?? 0),
            'is_show'    => intval($d['is_show'] ?? 1),
            'updated_at' => date('Y-m-d H:i:s'),
        ];

        $hasKeywords = $this->columnExists('categories', 'keywords');
        if ($hasKeywords) {
            $fields['keywords'] = trim($d['keywords'] ?? '');
        }

        if ($id) {
            $row = Db::name('categories')->where('id', $id)->find();
            if (!$row) {
                return $this->fail('分类不存在');
            }
            if ($parentId) {
                $children = $this->getChildIds($id);
                if (in_array($parentId, $children)) {
                    return $this->fail('不能选择当前分类的子分类作为上级');
                }
            }
            Db::name('categories')->where('id', $id)->update($fields);
        } else {
            $fields['created_at'] = date('Y-m-d H:i:s');
            $id = Db::name('categories')->insertGetId($fields);
        }

        return $this->ok(['id' => $id]);
    }

    public function remove($id)
    {
        $id = intval($id);
        if (!$id) {
            return $this->fail('参数错误');
        }
        if (Db::name('categories')->where('parent_id', $id)->find()) {
            return $this->fail('请先删除该分类下的子分类');
        }
        if (Db::name('goods')->where('category_id', $id)->find()) {
            return $this->fail('该分类下存在商品，无法删除');
        }
        Db::name('categories')->where('id', $id)->delete();
        return $this->ok();
    }

    public function toggleStatus($id)
    {
        $id      = intval($id);
        $d       = $this->body();
        $isShow  = intval($d['is_show'] ?? 1);
        Db::name('categories')->where('id', $id)->update([
            'is_show'    => $isShow,
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
        return $this->ok();
    }

    protected function buildTree(array $rows, int $pid, int $depth = 0): array
    {
        $tree = [];
        foreach ($rows as $row) {
            if ($row['parent_id'] == $pid) {
                $row['level']    = $depth;
                $row['children'] = $this->buildTree($rows, $row['id'], $depth + 1);
                $tree[] = $row;
            }
        }
        return $tree;
    }

    protected function flattenTree(array $nodes, array &$flat): void
    {
        foreach ($nodes as $node) {
            $children = $node['children'] ?? [];
            $node['has_children'] = !empty($children);
            unset($node['children']);
            $flat[] = $node;
            if ($children) {
                $this->flattenTree($children, $flat);
            }
        }
    }

    protected function getDepth(int $id): int
    {
        $depth = -1;
        $cur   = $id;
        $seen  = [];
        while ($cur) {
            if (isset($seen[$cur])) {
                break;
            }
            $seen[$cur] = 1;
            $row = Db::name('categories')->where('id', $cur)->field('parent_id')->find();
            if (!$row) {
                break;
            }
            $depth++;
            $cur = $row['parent_id'];
        }
        return $depth;
    }

    protected function subtreeHeight(int $id): int
    {
        $rows = Db::name('categories')->field('id,parent_id')->select()->toArray();
        return $this->calcHeight($rows, $id);
    }

    protected function calcHeight(array $rows, int $pid): int
    {
        $max = 0;
        foreach ($rows as $row) {
            if ($row['parent_id'] == $pid) {
                $max = max($max, 1 + $this->calcHeight($rows, $row['id']));
            }
        }
        return $max;
    }

    protected function getChildIds(int $id): array
    {
        $ids  = [];
        $rows = Db::name('categories')->field('id,parent_id')->select()->toArray();
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

    protected function columnExists(string $table, string $column): bool
    {
        try {
            $driver = env('DB_DRIVER', 'sqlite');
            if ($driver === 'sqlite') {
                $rows = Db::query("SELECT name FROM pragma_table_info('{$table}') WHERE name = ?", [$column]);
            } else {
                $rows = Db::query("SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?", [$table, $column]);
            }
            return !empty($rows);
        } catch (\Throwable $e) {
            return false;
        }
    }
}
