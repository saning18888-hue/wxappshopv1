<?php
/**
 * 文章管理模块增量迁移（幂等）
 * 新建 article_categories / articles 两张表，并写入演示数据。
 * 用法：cd server && php database/apply_articles.php
 */
require __DIR__ . '/../vendor/autoload.php';

$app = new \think\App(__DIR__ . '/../');
$app->initialize();

use think\facade\Db;

$driver = env('DB_DRIVER', 'sqlite');
if ($driver !== 'sqlite') {
    echo "Current driver is not sqlite, skip.\n";
    exit(0);
}

/** 建表（已存在则跳过） */
function createTable($table, $ddl)
{
    $exists = Db::query("SELECT name FROM sqlite_master WHERE type='table' AND name = ?", [$table]);
    if (empty($exists)) {
        Db::execute($ddl);
        echo "table {$table} created.\n";
    } else {
        echo "table {$table} already exists.\n";
    }
}

/** 仅当表为空时插入种子 */
function seedIfEmpty($table, $sql)
{
    $cnt = Db::table($table)->count();
    if ($cnt == 0) {
        Db::execute($sql);
        echo "seeded {$table}.\n";
    } else {
        echo "{$table} not empty, skip seed.\n";
    }
}

createTable('article_categories', "
    CREATE TABLE article_categories (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL DEFAULT '',
      parent_id   INTEGER NOT NULL DEFAULT 0,
      sort        INTEGER NOT NULL DEFAULT 0,
      cover_image TEXT NOT NULL DEFAULT '',
      status      INTEGER NOT NULL DEFAULT 1,
      created_at  TEXT DEFAULT CURRENT_TIMESTAMP
    )
");

createTable('articles', "
    CREATE TABLE articles (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      title         TEXT NOT NULL DEFAULT '',
      category_id   INTEGER NOT NULL DEFAULT 0,
      author        TEXT NOT NULL DEFAULT '',
      source        TEXT NOT NULL DEFAULT '',
      cover_image   TEXT NOT NULL DEFAULT '',
      intro         TEXT NOT NULL DEFAULT '',
      keywords      TEXT NOT NULL DEFAULT '',
      content       TEXT NOT NULL DEFAULT '',
      external_link TEXT NOT NULL DEFAULT '',
      display_mode  TEXT NOT NULL DEFAULT 'native',
      is_recommend  INTEGER NOT NULL DEFAULT 0,
      is_show       INTEGER NOT NULL DEFAULT 1,
      views         INTEGER NOT NULL DEFAULT 0,
      video_type    TEXT NOT NULL DEFAULT 'none',
      video_url     TEXT NOT NULL DEFAULT '',
      publish_time  TEXT DEFAULT '',
      created_at    TEXT DEFAULT CURRENT_TIMESTAMP
    )
");

seedIfEmpty('article_categories', "
    INSERT INTO article_categories (id, name, parent_id, sort, cover_image, status) VALUES
    (1, '公司新闻', 0, 1, '', 1),
    (2, '行业动态', 0, 2, '', 1),
    (3, '使用帮助', 0, 3, '', 1),
    (4, '新手指南', 3, 1, '', 1)
");

seedIfEmpty('articles', "
    INSERT INTO articles (id, title, category_id, author, source, cover_image, intro, keywords, content, display_mode, is_recommend, is_show, views, video_type, publish_time) VALUES
    (1, '欢迎使用我们的小程序商城', 1, '管理员', '官方', '', '商城上线公告与功能简介', '公告,商城', '<p>感谢您使用我们的小程序商城，在这里您可以体验到丰富的商品与便捷的下单流程。</p>', 'native', 1, 1, 328, 'none', '2026-08-10 09:30:00'),
    (2, '2026 行业趋势报告解读', 2, '编辑部', '行业周刊', '', '一文读懂今年电商新趋势', '趋势,电商', '<p>今年私域与内容电商继续走高，品牌自建小程序成为标配。</p>', 'native', 0, 1, 156, 'none', '2026-08-12 14:00:00'),
    (3, '如何快速完成首单', 3, '客服小美', '帮助中心', '', '三步完成下单与支付', '帮助,下单', '<p>1. 浏览商品；2. 加入购物车；3. 提交订单并支付。</p>', 'native', 1, 1, 542, 'none', '2026-08-14 10:20:00')
");

echo "articles migration done.\n";
