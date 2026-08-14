<?php
// +----------------------------------------------------------------------
// | B2C 小程序商城 API 路由  (/api/v1)
// +----------------------------------------------------------------------
use think\facade\Route;

Route::group('api/v1', function () {
    // 会员 / 登录
    Route::post('auth/dev_login', 'api/v1.Auth/devLogin');   // 开发态 Mock 登录
    Route::get('user/info', 'api/v1.Auth/info');             // 获取会员资料

    // 首页 DIY 装修
    Route::get('home', 'api/v1.Home/index');

    // 分类
    Route::get('categories', 'api/v1.Category/index');

    // 商品
    Route::get('goods', 'api/v1.Goods/index');
    Route::get('goods/:id', 'api/v1.Goods/detail');

    // 购物车
    Route::get('cart', 'api/v1.Cart/index');
    Route::post('cart', 'api/v1.Cart/add');
    Route::put('cart/:id', 'api/v1.Cart/update');
    Route::delete('cart/:id', 'api/v1.Cart/remove');

    // 订单
    Route::post('order/preview', 'api/v1.Order/preview');
    Route::post('order', 'api/v1.Order/create');
    Route::get('order', 'api/v1.Order/index');
    Route::get('order/:id', 'api/v1.Order/detail');

    // 支付（Mock 回调，用于无真实商户号时跑通闭环）
    Route::post('payment/mock_notify', 'api/v1.Payment/mockNotify');
});

// 运营后台（本地管理用，简单口令登录，前缀 /admin）
Route::group('admin', function () {
    Route::post('login', 'admin.Auth/login');
    Route::get('goods', 'admin.Goods/index');
    Route::get('goods/:id', 'admin.Goods/detail');
    Route::post('goods', 'admin.Goods/save');
    Route::put('goods/:id', 'admin.Goods/save');
    Route::delete('goods/:id', 'admin.Goods/remove');
    Route::get('categories', 'admin.Category/index');
    Route::get('categories/tree', 'admin.Category/tree');
    Route::post('categories', 'admin.Category/save');
    Route::put('categories/:id', 'admin.Category/save');
    Route::delete('categories/:id', 'admin.Category/remove');
    Route::put('categories/:id/status', 'admin.Category/toggleStatus');
    Route::post('upload/image', 'admin.Upload/image');
    Route::post('upload/banner_image', 'admin.Upload/bannerImage');
    Route::post('upload/video', 'admin.Upload/video');
    Route::get('orders', 'admin.Order/index');
    Route::get('orders/:id', 'admin.Order/detail');
    Route::post('orders/:id/status', 'admin.Order/changeStatus');

    // 首页装修（DIY）：轮播 / 金刚区 / 精选好物 / 商品分类
    Route::get('design/home', 'admin.Design/home');
    Route::post('design/home/save', 'admin.Design/save');
    Route::post('design/home/publish', 'admin.Design/publish');
});
