<?php
/**
 * 商品评论表增量迁移（幂等）
 * 用法：cd server && php database/apply_goods_reviews.php
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

if (!tableExists('goods_reviews')) {
    Db::execute("CREATE TABLE goods_reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL DEFAULT 0,
        order_no TEXT NOT NULL DEFAULT '',
        user_id INTEGER NOT NULL DEFAULT 0,
        user_name TEXT NOT NULL DEFAULT '',
        avatar TEXT NOT NULL DEFAULT '',
        goods_id INTEGER NOT NULL DEFAULT 0,
        goods_title TEXT NOT NULL DEFAULT '',
        goods_image TEXT NOT NULL DEFAULT '',
        content TEXT NOT NULL DEFAULT '',
        images TEXT NOT NULL DEFAULT '[]',
        rating INTEGER NOT NULL DEFAULT 5,
        is_hidden INTEGER NOT NULL DEFAULT 0,
        reply TEXT NOT NULL DEFAULT '',
        reply_at TEXT DEFAULT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )");
    Db::execute("CREATE INDEX idx_reviews_goods ON goods_reviews(goods_id)");
    Db::execute("CREATE INDEX idx_reviews_user ON goods_reviews(user_id)");
    Db::execute("CREATE INDEX idx_reviews_order ON goods_reviews(order_id)");
    echo "goods_reviews table created.\n";
} else {
    echo "goods_reviews already exists.\n";
}

echo "goods_reviews migration done.\n";
