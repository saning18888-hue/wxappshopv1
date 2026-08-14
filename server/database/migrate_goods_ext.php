<?php
/**
 * 给已存在的 wxappb2c.sqlite 增加商品扩展字段与属性表
 * 用法：php database/migrate_goods_ext.php
 */
$dbFile = __DIR__ . '/wxappb2c.sqlite';
if (!is_file($dbFile)) {
    fwrite(STDERR, "数据库文件不存在：{$dbFile}\n");
    exit(1);
}
$pdo = new PDO('sqlite:' . $dbFile);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

function addCol($pdo, $table, $col, $def) {
    $cols = $pdo->query("PRAGMA table_info({$table})")->fetchAll(PDO::FETCH_COLUMN, 1);
    if (!in_array($col, $cols, true)) {
        $pdo->exec("ALTER TABLE {$table} ADD COLUMN {$col} {$def}");
        echo "已添加 {$table}.{$col} 字段。\n";
    } else {
        echo "{$table}.{$col} 已存在，跳过。\n";
    }
}

addCol($pdo, 'goods', 'ext_json', "TEXT NOT NULL DEFAULT '{}'");
addCol($pdo, 'goods', 'updated_at', "TEXT DEFAULT CURRENT_TIMESTAMP");
addCol($pdo, 'goods_specs', 'sort', "INTEGER NOT NULL DEFAULT 0");
addCol($pdo, 'goods_specs', 'created_at', "TEXT DEFAULT CURRENT_TIMESTAMP");
addCol($pdo, 'goods_spec_values', 'sort', "INTEGER NOT NULL DEFAULT 0");
addCol($pdo, 'goods_spec_values', 'created_at', "TEXT DEFAULT CURRENT_TIMESTAMP");

$pdo->exec("
CREATE TABLE IF NOT EXISTS goods_attrs (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  goods_id   INTEGER NOT NULL,
  name       TEXT NOT NULL DEFAULT '',
  values     TEXT NOT NULL DEFAULT '[]',
  used       INTEGER NOT NULL DEFAULT 0,
  sort       INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_attrs_goods ON goods_attrs(goods_id);
");
echo "goods_attrs 表已就绪。\n";
echo "migration done.\n";
