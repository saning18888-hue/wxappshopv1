<?php
// +----------------------------------------------------------------------
// | 应用设置
// +----------------------------------------------------------------------
return [
    // 应用名称
    'app_name'               => 'wxappb2c',
    // 应用地址
    'app_url'                => '',
    // 是否启用路由
    'with_route'             => true,
    // 默认控制器名
    'default_controller'     => 'Index',
    // 默认操作名
    'default_action'         => 'index',
    // 默认时区
    'default_timezone'       => 'Asia/Shanghai',
    // 默认返回类型（API 用 json）
    'default_return_type'    => 'json',
    // 默认跳转页面对应的模板文件
    'dispatch_success_tmpl'  => '',
    'dispatch_error_tmpl'    => '',
    // 异常页面的模板文件
    'exception_tmpl'         => '',
    // 错误显示信息,非调试模式有效
    'error_message'          => '页面错误！请稍后再试～',
    // 显示错误信息
    'show_error_msg'         => false,
    // 异常处理 handle 类 留空使用 \think\exception\Handle
    'exception_handle'       => '',
    // 是否记录异常数据
    'record_trace'           => false,
];
