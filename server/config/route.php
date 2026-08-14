<?php
// +----------------------------------------------------------------------
// | 路由设置
// +----------------------------------------------------------------------
return [
    // 是否开启路由
    'url_route_on'       => true,
    // 是否强制路由（未定义路由则抛异常）
    'url_route_must'     => false,
    // 路由是否自动扫描（扫描 route 目录下的定义文件）
    'route_scan'         => true,
    // 是否使用路由定义文件（route/app.php）
    'route_definition'   => true,
    // 关闭路由缓存：避免 runtime/route_list.php 缓存异常导致 :id 变量路由失效
    'route_check_cache'  => false,
    // 路由完整匹配：避免静态规则（如 goods）作为前缀抢匹配 goods/:id 变量规则
    'route_complete_match' => true,
    // 路由注解（关闭，使用定义文件）
    'route_annotation'   => false,
    // 默认路由（未匹配时使用）
    'default_route'      => '',
    // 控制器后缀
    'controller_suffix'  => false,
    // 控制器层
    'controller_layer'   => 'controller',
    // 是否延迟解析（提升性能）
    'url_lazy_route'     => false,
    // 合并路由规则
    'route_rule_merge'   => false,
    // 路由是否区分大小写
    'url_route_upper'    => false,
];
