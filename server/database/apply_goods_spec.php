<?php
/**
 * 商品规格表增量迁移（幂等）
 * 给已有的 goods_specs 表扩展 default_spec / updated_at 字段。
 * 用法：cd server && php database/apply_goods_spec.php
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

/** 给指定表增加列（已存在则跳过） */
function addCol($table, $col, $def)
{
    $exists = Db::query("SELECT name FROM pragma_table_info('{$table}') WHERE name = ?", [$col]);
    if (empty($exists)) {
        Db::execute("ALTER TABLE {$table} ADD COLUMN {$col} {$def}");
        echo "{$table}.{$col} added successfully.\n";
    } else {
        echo "{$table}.{$col} already exists.\n";
    }
}

addCol('goods_specs', 'default_spec', "INTEGER NOT NULL DEFAULT 1");
addCol('goods_specs', 'updated_at', "TEXT DEFAULT NULL");
