<?php
/**
 * 操作日志表迁移（幂等）
 * 新建 operation_logs 表，用于存储运营后台操作日志。
 * 用法：cd server && php database/apply_operation_logs.php
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

createTable('operation_logs', "
    CREATE TABLE operation_logs (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_user  TEXT NOT NULL DEFAULT '',
      admin_name  TEXT NOT NULL DEFAULT '',
      role        TEXT NOT NULL DEFAULT '',
      action      TEXT NOT NULL DEFAULT '',
      method      TEXT NOT NULL DEFAULT '',
      url         TEXT NOT NULL DEFAULT '',
      ip          TEXT NOT NULL DEFAULT '',
      param       TEXT,
      create_time INTEGER NOT NULL DEFAULT 0
    )
");

Db::execute("CREATE INDEX IF NOT EXISTS idx_operation_logs_create_time ON operation_logs (create_time)");
Db::execute("CREATE INDEX IF NOT EXISTS idx_operation_logs_admin_user ON operation_logs (admin_user)");

echo "operation_logs migration done.\n";
