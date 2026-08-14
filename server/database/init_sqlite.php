<?php
// +----------------------------------------------------------------------
// | 本地 SQLite 数据库初始化（免装 MySQL）
// | 用法：cd server && php database/init_sqlite.php
// | 重新灌种子前请先删除 database/wxappb2c.sqlite
// +----------------------------------------------------------------------
$dbFile = __DIR__ . DIRECTORY_SEPARATOR . 'wxappb2c.sqlite';
$sqlFile = __DIR__ . DIRECTORY_SEPARATOR . 'install.sqlite.sql';

if (!is_file($sqlFile)) {
    fwrite(STDERR, "找不到建表脚本: {$sqlFile}\n");
    exit(1);
}

if (is_file($dbFile)) {
    echo "数据库已存在: {$dbFile}\n如需重置，请先删除该文件再运行本脚本。\n";
    exit(0);
}

$sql = file_get_contents($sqlFile);
// 统一换行符，避免 Windows CRLF 干扰拆分
$sql = str_replace(["\r\n", "\r"], "\n", $sql);
// 去掉整行注释（-- 开头）
$sql = preg_replace('/^--.*$/m', '', $sql);
// 按分号拆分为独立语句（脚本数据内不含分号，安全）
$parts = explode(';', $sql);

try {
    $pdo = new PDO('sqlite:' . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec('PRAGMA foreign_keys = OFF;');
    $count = 0;
    foreach ($parts as $part) {
        $stmt = trim($part);
        if ($stmt === '') {
            continue;
        }
        $pdo->exec($stmt);
        $count++;
    }
    echo "初始化成功，数据库文件: {$dbFile}\n";
    echo "共执行 {$count} 条 SQL。\n";
} catch (PDOException $e) {
    fwrite(STDERR, "初始化失败: " . $e->getMessage() . "\n");
    if (is_file($dbFile)) {
        unlink($dbFile); // 失败回滚，避免半初始化文件
    }
    exit(1);
}
