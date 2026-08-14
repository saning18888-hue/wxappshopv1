<?php
// 本地开发用 PHP 内置服务器路由（php -S 127.0.0.1:8787 router.php）
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$public = __DIR__ . '/public';
if ($uri !== '/' && is_file($public . $uri)) {
    // 静态资源直接返回
    return false;
}
require $public . '/index.php';
