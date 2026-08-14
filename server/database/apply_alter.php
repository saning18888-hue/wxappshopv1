<?php
/**
 * 本地 SQLite 增量迁移脚本（幂等）
 * 用法：cd server && php database/apply_alter.php
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

function addCol($col, $def) {
    $exists = Db::query("SELECT name FROM pragma_table_info('categories') WHERE name = ?", [$col]);
    if (empty($exists)) {
        Db::execute("ALTER TABLE categories ADD COLUMN {$col} {$def}");
        echo "categories.{$col} added successfully.\n";
    } else {
        echo "categories.{$col} already exists.\n";
    }
}

addCol('keywords', "TEXT NOT NULL DEFAULT ''");
addCol('updated_at', "TEXT");
