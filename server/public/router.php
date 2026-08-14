<?php
// ThinkPHP 开发服务器路由（php think run 使用，docroot=public）
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
// 显式设置 PATH_INFO，确保变量路由（如 /goods/:id）在 Windows 内置服务器下可正确匹配
$_SERVER['PATH_INFO'] = $uri;
if ($uri !== '/' && is_file(__DIR__ . $uri)) {
    // 静态资源（如 favicon）直接返回
    return false;
}
require __DIR__ . '/index.php';
