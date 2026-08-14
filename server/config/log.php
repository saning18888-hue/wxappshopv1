<?php
// +----------------------------------------------------------------------
// | 日志设置
// +----------------------------------------------------------------------
return [
    'default'  => 'file',
    'channels' => [
        'file' => [
            'type'       => 'File',
            'path'       => dirname(__DIR__) . DIRECTORY_SEPARATOR . 'runtime' . DIRECTORY_SEPARATOR . 'log' . DIRECTORY_SEPARATOR,
            'level'      => [],
            'single'     => false,
            'apart_level' => [],
            'max_files'  => 0,
            'json'       => false,
        ],
        'debug' => [
            'type' => 'debug',
        ],
    ],
];
