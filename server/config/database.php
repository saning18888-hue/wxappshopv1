<?php
// +----------------------------------------------------------------------
// | 数据库配置（读取 .env）
// | DB_DRIVER=mysql 走 MySQL；DB_DRIVER=sqlite 走本地 SQLite（免装数据库）
// +----------------------------------------------------------------------
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
            'database' => env('DB_SQLITE_PATH', root_path() . 'database' . DIRECTORY_SEPARATOR . 'wxappb2c.sqlite'),
            'prefix'   => env('DB_PREFIX', ''),
            'debug'    => true,
        ],
    ],
];
