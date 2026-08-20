<?php
/**
 * 短信管理相关表迁移（幂等）
 * 新建 sms_contacts、sms_send_logs 两张表。
 * 用法：cd server && php database/apply_sms_tables.php
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

createTable('sms_contacts', "
    CREATE TABLE sms_contacts (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL DEFAULT '',
      phone       TEXT NOT NULL DEFAULT '',
      enabled     INTEGER NOT NULL DEFAULT 1,
      subscribe   TEXT NOT NULL DEFAULT '[]',
      create_time INTEGER NOT NULL DEFAULT 0,
      update_time INTEGER NOT NULL DEFAULT 0
    )
");

createTable('sms_send_logs', "
    CREATE TABLE sms_send_logs (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      phone         TEXT NOT NULL DEFAULT '',
      template_key  TEXT NOT NULL DEFAULT '',
      content       TEXT NOT NULL DEFAULT '',
      result        TEXT,
      config_key    TEXT NOT NULL DEFAULT '',
      create_time   INTEGER NOT NULL DEFAULT 0
    )
");

Db::execute("CREATE INDEX IF NOT EXISTS idx_sms_contacts_phone ON sms_contacts (phone)");
Db::execute("CREATE INDEX IF NOT EXISTS idx_sms_send_logs_create_time ON sms_send_logs (create_time)");
Db::execute("CREATE INDEX IF NOT EXISTS idx_sms_send_logs_phone ON sms_send_logs (phone)");

// 初始化默认商家联系人（店长示例），避免空表难以演示
$exists = Db::table('sms_contacts')->where('phone', '13963671858')->find();
if (!$exists) {
    $subscribe = json_encode([
        'order_new', 'order_refund', 'group_success', 'seckill_success', 'bargain_success'
    ], JSON_UNESCAPED_UNICODE);
    Db::table('sms_contacts')->insert([
        'name'        => '店长',
        'phone'       => '13963671858',
        'enabled'     => 1,
        'subscribe'   => $subscribe,
        'create_time' => time(),
        'update_time' => time(),
    ]);
    echo "default sms_contacts seed inserted.\n";
}

echo "sms tables migration done.\n";
