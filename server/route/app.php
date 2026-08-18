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

    // 底部导航配置下发
    Route::get('bottom_nav', 'api/v1.Design/bottomNav');

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

    // 基础设置（小程序端读取）
    Route::get('settings', 'api/v1.Settings/get');
});

// 运营后台（本地管理用，简单口令登录，前缀 /admin）
Route::group('admin', function () {
    Route::post('login', 'admin.Auth/login');
    Route::get('goods', 'admin.Goods/index');
    Route::get('goods/:id', 'admin.Goods/detail');
    Route::post('goods', 'admin.Goods/save');
    Route::put('goods/:id', 'admin.Goods/save');
    Route::delete('goods/:id', 'admin.Goods/remove');
    Route::get('goods_specs', 'admin.Goods/specList');
    Route::get('goods_specs/:id', 'admin.Goods/specDetail');
    Route::post('goods_specs', 'admin.Goods/specSave');
    Route::post('goods_specs/:id/save', 'admin.Goods/specSave');
    Route::post('goods_specs/:id/delete', 'admin.Goods/specDelete');
    Route::post('goods_specs/:id/default', 'admin.Goods/specSetDefault');
    Route::post('goods_specs/:id/move', 'admin.Goods/specMove');
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

    // 页面装修（DIY）：首页 / 底部导航
    Route::get('design/:page', 'admin.Design/page');
    Route::post('design/:page/save', 'admin.Design/save');
    Route::post('design/:page/publish', 'admin.Design/publish');

    // 基础设置
    Route::get('settings', 'admin.Settings/get');
    Route::post('settings', 'admin.Settings/save');

    // 会员管理
    Route::get('members', 'admin.Member/index');
    Route::get('members/:id', 'admin.Member/detail');
    Route::post('members/:id/save', 'admin.Member/save');
    Route::post('members/:id/adjust', 'admin.Member/adjust');
    Route::post('members/:id/assign_staff', 'admin.Member/assignStaff');
    Route::post('members/:id/assign_distributor', 'admin.Member/assignDistributor');
    Route::post('members/:id/logout', 'admin.Member/logout');
    Route::get('member_groups', 'admin.Member/groups');
    Route::get('member_group_list', 'admin.Member/groupList');
    Route::post('member_groups', 'admin.Member/groupCreate');
    Route::post('member_groups/:id/save', 'admin.Member/groupUpdate');
    Route::post('member_groups/:id/delete', 'admin.Member/groupDelete');
    Route::post('member_groups/batch_delete', 'admin.Member/groupBatchDelete');
    Route::get('member_staff', 'admin.Member/staffList');
    Route::get('member_distributors', 'admin.Member/distributorList');
    Route::get('member_agreement', 'admin.Member/agreement');
    Route::post('member_agreement', 'admin.Member/saveAgreement');
});
