<?php
/**
 * 商品属性表增量迁移（幂等）
 * 给已有的 goods_attrs 表扩展 default_attr / updated_at 字段，并允许 goods_id 默认 0。
 * 用法：cd server && php database/apply_goods_attr.php
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

addCol('goods_attrs', 'default_attr', "INTEGER NOT NULL DEFAULT 0");
addCol('goods_attrs', 'updated_at', "TEXT DEFAULT NULL");

// 旧数据若没有 goods_id 则统一归到 0（全局属性）
Db::execute("UPDATE goods_attrs SET goods_id = 0 WHERE goods_id IS NULL OR goods_id = ''");
echo "goods_attrs migration done.\n";
