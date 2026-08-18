<?php
$db = __DIR__ . '/wxappb2c.sqlite';
if (!is_file($db)) { echo "NO DB FILE\n"; exit; }
$p = new PDO('sqlite:' . $db);
$t = $p->query("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
echo "TABLES: " . implode(',', array_column($t->fetchAll(), 'name')) . "\n";
$c = $p->query('PRAGMA table_info(goods)');
echo "goods cols: " . implode(',', array_column($c->fetchAll(), 'name')) . "\n";
