<?php
/**
 * 订单售后/回收站字段增量迁移（幂等）
 * 给 orders 表增加 is_deleted 软删字段，以及售后相关时间戳。
 * 用法：cd server && php database/apply_order_refund.php
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

addCol('orders', 'is_deleted', "INTEGER NOT NULL DEFAULT 0");
addCol('orders', 'refund_apply_at', "TEXT");
addCol('orders', 'refund_finish_at', "TEXT");
addCol('orders', 'refund_reason', "TEXT NOT NULL DEFAULT ''");
addCol('orders', 'refund_amount', "INTEGER NOT NULL DEFAULT 0");
addCol('orders', 'refund_type', "TEXT NOT NULL DEFAULT ''");
addCol('orders', 'refund_status', "TEXT NOT NULL DEFAULT ''");
addCol('orders', 'refund_remark', "TEXT NOT NULL DEFAULT ''");
addCol('orders', 'refund_images', "TEXT NOT NULL DEFAULT ''");
addCol('orders', 'refund_previous_status', "INTEGER NOT NULL DEFAULT 0");

echo "order_refund migration done.\n";
