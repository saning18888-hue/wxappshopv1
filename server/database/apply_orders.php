<?php
/**
 * 订单表增量迁移（幂等）
 * 给已有的 orders 表扩展 trade_no / order_type / source / member_discount / balance_used / coupon_amount / buyer_message / remark 等字段。
 * 用法：cd server && php database/apply_orders.php
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

addCol('orders', 'trade_no', "TEXT NOT NULL DEFAULT ''");
addCol('orders', 'order_type', "INTEGER NOT NULL DEFAULT 0");
addCol('orders', 'source', "TEXT NOT NULL DEFAULT 'wechat'");
addCol('orders', 'member_discount', "INTEGER NOT NULL DEFAULT 0");
addCol('orders', 'balance_used', "INTEGER NOT NULL DEFAULT 0");
addCol('orders', 'coupon_amount', "INTEGER NOT NULL DEFAULT 0");
addCol('orders', 'buyer_message', "TEXT NOT NULL DEFAULT ''");
addCol('orders', 'remark', "TEXT NOT NULL DEFAULT ''");
addCol('orders', 'shipping_company', "TEXT NOT NULL DEFAULT ''");
addCol('orders', 'shipping_no', "TEXT NOT NULL DEFAULT ''");

echo "orders migration done.\n";
