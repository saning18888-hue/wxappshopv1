<?php
namespace app\service;

use think\facade\Db;

/**
 * 装修页面服务：管理 pages / page_versions
 * - 每个 page 一条记录，current_version 指向当前已发布的 page_versions.id
 * - page_versions：每个版本保存完整组件配置（JSON），支持草稿(0)/已发布(1)/历史(-1)
 * - 发布 = 置某版本为 1 并设为 current；回滚 = 重新发布某个历史版本
 */
class PageService
{
    public function getPageRow(string $page): ?array
    {
        return Db::name('pages')->where('page', $page)->find();
    }

    /** 当前已发布配置（数组），无则返回 null */
    public function publishedConfig(string $page): ?array
    {
        $p = $this->getPageRow($page);
        if (!$p || !$p['current_version']) {
            return null;
        }
        $v = Db::name('page_versions')->where('id', $p['current_version'])->find();
        if (!$v) {
            return null;
        }
        $cfg = json_decode($v['config'], true);
        return is_array($cfg) ? $cfg : null;
    }

    /** 版本历史（含 is_current 标记由控制器补充） */
    public function versions(string $page): array
    {
        $p = $this->getPageRow($page);
        if (!$p) {
            return [];
        }
        return Db::name('page_versions')->where('page_id', $p['id'])
            ->order('id desc')->select()->toArray();
    }

    /** 最新草稿（status=0） */
    public function latestDraft(string $page): ?array
    {
        $p = $this->getPageRow($page);
        if (!$p) {
            return null;
        }
        $v = Db::name('page_versions')->where('page_id', $p['id'])
            ->where('status', 0)->order('id desc')->find();
        return $v ? ['version_id' => $v['id'], 'config' => json_decode($v['config'], true)] : null;
    }

    /** 保存草稿：作废旧草稿(-1)后新建草稿，返回新版本 id */
    public function saveDraft(string $page, array $config, string $remark, string $by): int
    {
        $p = $this->getPageRow($page);
        if (!$p) {
            Db::name('pages')->insert(['page' => $page, 'title' => $page, 'current_version' => 0, 'created_at' => date('Y-m-d H:i:s'), 'updated_at' => date('Y-m-d H:i:s')]);
            $p = $this->getPageRow($page);
        }
        Db::name('page_versions')->where('page_id', $p['id'])->where('status', 0)->update(['status' => -1]);
        $maxV = Db::name('page_versions')->where('page_id', $p['id'])->max('version') ?: 0;
        $json = json_encode($config, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        return Db::name('page_versions')->insertGetId([
            'page_id'    => $p['id'],
            'version'    => $maxV + 1,
            'status'     => 0,
            'config'     => $json,
            'remark'     => $remark,
            'created_by' => $by,
            'created_at' => date('Y-m-d H:i:s'),
        ]);
    }

    /** 发布/回滚：将某版本置为已发布并设为当前；versionId 为空则发布最新草稿 */
    public function publish(string $page, ?int $versionId): array
    {
        $p = $this->getPageRow($page);
        if (!$p) {
            return ['ok' => false, 'msg' => '页面不存在'];
        }
        if ($versionId) {
            $v = Db::name('page_versions')->where('id', $versionId)->where('page_id', $p['id'])->find();
        } else {
            $v = Db::name('page_versions')->where('page_id', $p['id'])->where('status', 0)->order('id desc')->find();
        }
        if (!$v) {
            return ['ok' => false, 'msg' => '未找到可发布的版本（请先保存草稿）'];
        }
        Db::name('page_versions')->where('page_id', $p['id'])->where('status', 1)->update(['status' => -1]);
        Db::name('page_versions')->where('id', $v['id'])->update(['status' => 1, 'published_at' => date('Y-m-d H:i:s')]);
        Db::name('pages')->where('id', $p['id'])->update(['current_version' => $v['id'], 'updated_at' => date('Y-m-d H:i:s')]);
        return ['ok' => true, 'version_id' => $v['id'], 'config' => json_decode($v['config'], true)];
    }
}
