<?php
/**
 * 会员模块增量迁移（幂等）
 * 给已有的 users 表扩展字段，并新建 member_groups / staff / distributors 三张表。
 * 用法：cd server && php database/apply_member.php
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

// 1. 扩展 users 字段
$cols = [
    'phone'             => "TEXT NOT NULL DEFAULT ''",
    'gender'            => "INTEGER NOT NULL DEFAULT 0",
    'level'             => "INTEGER NOT NULL DEFAULT 0",
    'growth'            => "INTEGER NOT NULL DEFAULT 0",
    'points'            => "INTEGER NOT NULL DEFAULT 0",
    'balance'           => "INTEGER NOT NULL DEFAULT 0",
    'group_id'          => "INTEGER NOT NULL DEFAULT 0",
    'source'            => "TEXT NOT NULL DEFAULT ''",
    'auth_status'       => "INTEGER NOT NULL DEFAULT 1",
    'staff_id'          => "INTEGER NOT NULL DEFAULT 0",
    'distributor_id'    => "INTEGER NOT NULL DEFAULT 0",
    'delete_status'     => "INTEGER NOT NULL DEFAULT 0",
    'delete_reason'     => "TEXT NOT NULL DEFAULT ''",
    'delete_apply_time' => "TEXT DEFAULT ''",
    'tags'              => "TEXT NOT NULL DEFAULT ''",
];
foreach ($cols as $c => $def) {
    addCol('users', $c, $def);
}

// 2. 新建三张表
createTable('member_groups', "
    CREATE TABLE member_groups (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      level      INTEGER NOT NULL DEFAULT 0,
      discount   INTEGER NOT NULL DEFAULT 100,
      remark     TEXT NOT NULL DEFAULT '',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
");
createTable('staff', "
    CREATE TABLE staff (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      phone      TEXT NOT NULL DEFAULT '',
      remark     TEXT NOT NULL DEFAULT '',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
");
addCol('staff','account',"TEXT NOT NULL DEFAULT ''");
addCol('staff','position',"TEXT NOT NULL DEFAULT ''");
addCol('staff','wechat',"TEXT NOT NULL DEFAULT ''");
addCol('staff','qq',"TEXT NOT NULL DEFAULT ''");
createTable('distributors', "
    CREATE TABLE distributors (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      phone      TEXT NOT NULL DEFAULT '',
      remark     TEXT NOT NULL DEFAULT '',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
");
addCol('distributors','nickname',"TEXT NOT NULL DEFAULT ''");

// 3. 种子数据（仅空表时）
seedIfEmpty('member_groups', "
    INSERT INTO member_groups (id, name, level, discount, remark) VALUES
    (1, '普通会员', 1, 100, '默认分组'),
    (2, 'VIP会员', 2, 95, '消费满1000升级'),
    (3, 'SVIP会员', 3, 90, '消费满5000升级')
");
seedIfEmpty('staff', "
    INSERT INTO staff (id, name, phone, remark) VALUES
    (1, '客服-小美', '13900000001', '售前售后'),
    (2, '客服-小帅', '13900000002', '大客户')
");
seedIfEmpty('distributors', "
    INSERT INTO distributors (id, name, phone, remark) VALUES
    (1, '分销商-A', '13700000001', '区域代理'),
    (2, '分销商-B', '13700000002', '社群团长')
");

// 4. 给演示会员补充分组/资产信息
$exist = Db::table('users')->where('id', 1)->value('group_id');
if ($exist === 0 || $exist === null) {
    Db::table('users')->where('id', 1)->update([
        'phone'   => '13800000000',
        'level'   => 2,
        'growth'  => 520,
        'points'  => 1280,
        'group_id'=> 2,
    ]);
    echo "demo user updated.\n";
}

echo "member migration done.\n";
