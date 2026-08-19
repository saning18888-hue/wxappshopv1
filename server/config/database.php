<?php
// +----------------------------------------------------------------------
// | 数据库配置（读取 .env）
// | DB_DRIVER=mysql 走 MySQL；DB_DRIVER=sqlite 走本地 SQLite（免装数据库）
// +----------------------------------------------------------------------
// SQLite 数据库路径：若 .env 中 DB_SQLITE_PATH 为相对路径，则统一以项目根目录(root_path)为基准，
// 避免依赖 PHP 进程启动目录(CWD)导致 "unable to open database file"。
$sqliteEnv = trim((string) env('DB_SQLITE_PATH', ''));
if ($sqliteEnv === '') {
    $sqliteDatabase = root_path() . 'database' . DIRECTORY_SEPARATOR . 'wxappb2c.sqlite';
} elseif (DIRECTORY_SEPARATOR === $sqliteEnv[0] || preg_match('#^[A-Za-z]:[\\\\/]#', $sqliteEnv)) {
    $sqliteDatabase = $sqliteEnv;
} else {
    $sqliteDatabase = root_path() . ltrim($sqliteEnv, '/\\');
}

return [
    'default' => env('DB_DRIVER', 'mysql'),
    'connections' => [
        'mysql' => [
            'type'     => 'mysql',
            'hostname' => env('DB_HOST', '127.0.0.1'),
            'database' => env('DB_NAME', 'wxappb2c'),
            'username' => env('DB_USER', 'root'),
            'password' => env('DB_PASS', ''),
            'hostport' => env('DB_PORT', '3306'),
            'charset'  => 'utf8mb4',
            'prefix'   => env('DB_PREFIX', ''),
            'params'   => [],
            'debug'    => true,
            'deploy'   => 0,
        ],
        'sqlite' => [
            'type'     => 'sqlite',
            'database' => $sqliteDatabase,
            'prefix'   => env('DB_PREFIX', ''),
            'debug'    => true,
        ],
    ],
];
