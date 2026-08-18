<?php
/**
 * 电子卡券表增量迁移（幂等）
 * 用法：cd server && php database/apply_order_cards.php
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

function addCol($table, $col, $def)
{
    $exists = Db::query("SELECT name FROM pragma_table_info('{$table}') WHERE name = ?", [$col]);
    if (empty($exists)) {
        Db::execute("ALTER TABLE {$table} ADD COLUMN {$col} {$def}");
        echo "{$table}.{$col} added.\n";
    } else {
        echo "{$table}.{$col} already exists.\n";
    }
}

function tableExists($table)
{
    $r = Db::query("SELECT name FROM sqlite_master WHERE type='table' AND name=?", [$table]);
    return !empty($r);
}

if (!tableExists('order_cards')) {
    Db::execute("CREATE TABLE order_cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL DEFAULT 0,
        order_no TEXT NOT NULL DEFAULT '',
        user_id INTEGER NOT NULL DEFAULT 0,
        goods_id INTEGER NOT NULL DEFAULT 0,
        goods_title TEXT NOT NULL DEFAULT '',
        code TEXT NOT NULL DEFAULT '',
        status INTEGER NOT NULL DEFAULT 0,
        valid_start TEXT DEFAULT NULL,
        valid_end TEXT DEFAULT NULL,
        contact_name TEXT NOT NULL DEFAULT '',
        contact_phone TEXT NOT NULL DEFAULT '',
        used_at TEXT DEFAULT NULL,
        verifier_id INTEGER NOT NULL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (code)
    )");
    Db::execute("CREATE INDEX idx_cards_order ON order_cards(order_id)");
    Db::execute("CREATE INDEX idx_cards_user ON order_cards(user_id)");
    Db::execute("CREATE INDEX idx_cards_code ON order_cards(code)");
    echo "order_cards table created.\n";
} else {
    echo "order_cards already exists.\n";
}

if (!tableExists('card_transfers')) {
    Db::execute("CREATE TABLE card_transfers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        card_id INTEGER NOT NULL DEFAULT 0,
        from_user_id INTEGER NOT NULL DEFAULT 0,
        to_user_id INTEGER NOT NULL DEFAULT 0,
        order_no TEXT NOT NULL DEFAULT '',
        goods_title TEXT NOT NULL DEFAULT '',
        status INTEGER NOT NULL DEFAULT 0,
        received_at TEXT DEFAULT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )");
    Db::execute("CREATE INDEX idx_transfers_card ON card_transfers(card_id)");
    Db::execute("CREATE INDEX idx_transfers_from ON card_transfers(from_user_id)");
    Db::execute("CREATE INDEX idx_transfers_to ON card_transfers(to_user_id)");
    echo "card_transfers table created.\n";
} else {
    echo "card_transfers already exists.\n";
}

echo "order_cards migration done.\n";
