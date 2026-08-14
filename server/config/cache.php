<?php
// +----------------------------------------------------------------------
// | 缓存设置
// +----------------------------------------------------------------------
return [
    'default' => 'file',
    'stores'  => [
        'file' => [
            'type'       => 'File',
            'path'       => dirname(__DIR__) . DIRECTORY_SEPARATOR . 'runtime' . DIRECTORY_SEPARATOR . 'cache' . DIRECTORY_SEPARATOR,
            'expire'     => 0,
            'prefix'     => '',
        ],
        'redis' => [
            'type'       => 'redis',
            'host'       => '127.0.0.1',
            'port'       => 6379,
            'password'   => '',
            'select'     => 0,
            'timeout'    => 0,
            'expire'     => 0,
            'prefix'     => '',
        ],
    ],
];
