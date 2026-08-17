<?php
/**
 * 给已存在的 wxappb2c.sqlite 增加「首页装修」表并写入默认首页配置。
 * 用法：php database/migrate_design.php
 */
$dbFile = __DIR__ . '/wxappb2c.sqlite';
if (!is_file($dbFile)) {
    fwrite(STDERR, "数据库文件不存在：{$dbFile}\n请先运行 php database/init_sqlite.php\n");
    exit(1);
}
$pdo = new PDO('sqlite:' . $dbFile);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$pdo->exec(<<<SQL
CREATE TABLE IF NOT EXISTS pages (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  page            TEXT NOT NULL,
  title           TEXT NOT NULL DEFAULT '',
  status          INTEGER NOT NULL DEFAULT 1,
  current_version INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at      TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (page)
);
CREATE TABLE IF NOT EXISTS page_versions (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  page_id      INTEGER NOT NULL,
  version      INTEGER NOT NULL DEFAULT 1,
  status       INTEGER NOT NULL DEFAULT 0,
  config       TEXT NOT NULL DEFAULT '{}',
  remark       TEXT NOT NULL DEFAULT '',
  created_by   TEXT NOT NULL DEFAULT '',
  created_at   TEXT DEFAULT CURRENT_TIMESTAMP,
  published_at TEXT DEFAULT NULL
);
CREATE INDEX IF NOT EXISTS idx_pv_page ON page_versions(page_id);
SQL
);

$row = $pdo->query("SELECT id FROM pages WHERE page='home'")->fetch();
if (!$row) {
    $default = [
        'page'    => 'home',
        'version' => 1,
        'components' => [
            ['type' => 'banner', 'sort' => 1, 'props' => [
                'items' => [
                    ['image' => 'https://placehold.co/750x320/FF6B35/ffffff?text=Banner1', 'link' => ['type' => 'goods', 'id' => 1]],
                    ['image' => 'https://placehold.co/750x320/00B86B/ffffff?text=Banner2', 'link' => ['type' => 'goods', 'id' => 2]],
                ],
                'interval' => 4,
            ]],
            ['type' => 'nav_grid', 'sort' => 2, 'props' => [
                'columns' => 5,
                'items'   => [
                    ['icon' => 'https://placehold.co/96x96/FF6B35/fff?text=新', 'text' => '新品', 'link' => ['type' => 'category', 'id' => 1]],
                    ['icon' => 'https://placehold.co/96x96/00B86B/fff?text=热', 'text' => '热卖', 'link' => ['type' => 'category', 'id' => 2]],
                    ['icon' => 'https://placehold.co/96x96/FFB035/fff?text=券', 'text' => '领券', 'link' => ['type' => 'activity', 'id' => 1]],
                    ['icon' => 'https://placehold.co/96x96/4A90E2/fff?text=秒', 'text' => '秒杀', 'link' => ['type' => 'activity', 'id' => 2]],
                    ['icon' => 'https://placehold.co/96x96/9B59B6/fff?text=更', 'text' => '更多', 'link' => ['type' => 'category', 'id' => 3]],
                ],
            ]],
            ['type' => 'goods_group', 'sort' => 3, 'props' => [
                'title' => '精选推荐', 'columns' => 2,
                'modules' => array_map(function ($n) {
                    return ['id' => $n, 'name' => '推荐模块 ' . $n, 'title' => '推荐模块 ' . $n, 'goods' => []];
                }, range(1, 4)),
            ]],
            ['type' => 'category_nav', 'sort' => 4, 'props' => [
                'title' => '商品分类', 'columns' => 4, 'source' => 'all', 'category_ids' => [],
            ]],
        ],
    ];
    $pdo->exec("INSERT INTO pages (page,title,current_version,created_at,updated_at) VALUES ('home','首页',1,datetime('now'),datetime('now'))");
    $pageId = $pdo->lastInsertId();
    $json = json_encode($default, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    $stmt = $pdo->prepare("INSERT INTO page_versions (page_id,version,status,config,remark,created_by,created_at,published_at) VALUES (?,1,1,?, '初始化默认首页', 'system', datetime('now'), datetime('now'))");
    $stmt->execute([$pageId, $json]);
    echo "已创建首页装修表并写入默认首页配置。\n";
} else {
    echo "首页装修表已存在，跳过 seed。\n";
}
echo "migration done.\n";
