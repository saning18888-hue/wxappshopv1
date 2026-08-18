<?php
/**
 * 核销记录/用户优惠券表增量迁移（幂等）
 * 用法：cd server && php database/apply_verify_records.php
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

function tableExists($table)
{
    $r = Db::query("SELECT name FROM sqlite_master WHERE type='table' AND name=?", [$table]);
    return !empty($r);
}

if (!tableExists('user_coupons')) {
    Db::execute("CREATE TABLE user_coupons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL DEFAULT 0,
        coupon_id INTEGER NOT NULL DEFAULT 0,
        code TEXT NOT NULL DEFAULT '',
        title TEXT NOT NULL DEFAULT '',
        status INTEGER NOT NULL DEFAULT 0,
        used_at TEXT DEFAULT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (code)
    )");
    Db::execute("CREATE INDEX idx_user_coupons_user ON user_coupons(user_id)");
    Db::execute("CREATE INDEX idx_user_coupons_code ON user_coupons(code)");
    echo "user_coupons table created.\n";
} else {
    echo "user_coupons already exists.\n";
}

if (!tableExists('verify_records')) {
    Db::execute("CREATE TABLE verify_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        verify_type TEXT NOT NULL DEFAULT '',
        code TEXT NOT NULL DEFAULT '',
        order_id INTEGER NOT NULL DEFAULT 0,
        order_no TEXT NOT NULL DEFAULT '',
        user_id INTEGER NOT NULL DEFAULT 0,
        user_name TEXT NOT NULL DEFAULT '',
        phone TEXT NOT NULL DEFAULT '',
        verifier_id INTEGER NOT NULL DEFAULT 0,
        verifier_name TEXT NOT NULL DEFAULT '',
        verified_at TEXT DEFAULT CURRENT_TIMESTAMP
    )");
    Db::execute("CREATE INDEX idx_verify_type ON verify_records(verify_type)");
    Db::execute("CREATE INDEX idx_verify_code ON verify_records(code)");
    echo "verify_records table created.\n";
} else {
    echo "verify_records already exists.\n";
}

echo "verify_records migration done.\n";
