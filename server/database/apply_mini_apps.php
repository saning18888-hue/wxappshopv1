<?php
/**
 * 跳转小程序模块增量迁移（幂等）
 * 新建 mini_apps 表。
 * 用法：cd server && php database/apply_mini_apps.php
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

createTable('mini_apps', "
    CREATE TABLE mini_apps (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      platform    TEXT NOT NULL DEFAULT 'wechat',
      name        TEXT NOT NULL DEFAULT '',
      appid       TEXT NOT NULL DEFAULT '',
      path        TEXT NOT NULL DEFAULT '',
      sort        INTEGER NOT NULL DEFAULT 0,
      status      INTEGER NOT NULL DEFAULT 1,
      created_at  TEXT DEFAULT CURRENT_TIMESTAMP
    )
");

echo "mini_apps migration done.\n";
