<?php
/**
 * 相册管理模块增量迁移（幂等）
 * 新建 album_categories / albums / album_images 三张表。
 * 用法：cd server && php database/apply_albums.php
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

createTable('album_categories', "
    CREATE TABLE album_categories (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL DEFAULT '',
      icon        TEXT NOT NULL DEFAULT '',
      sort        INTEGER NOT NULL DEFAULT 0,
      status      INTEGER NOT NULL DEFAULT 1,
      created_at  TEXT DEFAULT CURRENT_TIMESTAMP
    )
");

createTable('albums', "
    CREATE TABLE albums (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT NOT NULL DEFAULT '',
      category_id   INTEGER NOT NULL DEFAULT 0,
      cover_image   TEXT NOT NULL DEFAULT '',
      sort          INTEGER NOT NULL DEFAULT 0,
      status        INTEGER NOT NULL DEFAULT 1,
      image_count   INTEGER NOT NULL DEFAULT 0,
      created_at    TEXT DEFAULT CURRENT_TIMESTAMP
    )
");

createTable('album_images', "
    CREATE TABLE album_images (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      album_id    INTEGER NOT NULL DEFAULT 0,
      image_url   TEXT NOT NULL DEFAULT '',
      name        TEXT NOT NULL DEFAULT '',
      is_cover    INTEGER NOT NULL DEFAULT 0,
      sort        INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT DEFAULT CURRENT_TIMESTAMP
    )
");

seedIfEmpty('album_categories', "
    INSERT INTO album_categories (id, name, icon, sort, status) VALUES
    (1, '商品图库', '', 99, 1),
    (2, '首页图库', '', 0, 1)
");

seedIfEmpty('albums', "
    INSERT INTO albums (id, name, category_id, cover_image, sort, status, image_count) VALUES
    (1, '新图片传这', 1, '', 9, 1, 0),
    (2, '已压缩01（勿上传）', 1, '', 1, 1, 0),
    (3, '已压缩02（勿上传）', 1, '', 2, 1, 0)
");

echo "albums migration done.\n";
