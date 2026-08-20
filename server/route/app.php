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
    Route::get('goods_attrs', 'admin.Goods/attrList');
    Route::get('goods_attrs/:id', 'admin.Goods/attrDetail');
    Route::post('goods_attrs', 'admin.Goods/attrSave');
    Route::post('goods_attrs/:id/save', 'admin.Goods/attrSave');
    Route::post('goods_attrs/:id/delete', 'admin.Goods/attrDelete');
    Route::post('goods_attrs/:id/default', 'admin.Goods/attrSetDefault');
    Route::post('goods_attrs/:id/move', 'admin.Goods/attrMove');
    Route::get('categories', 'admin.Category/index');
    Route::get('categories/tree', 'admin.Category/tree');
    Route::post('categories', 'admin.Category/save');
    Route::put('categories/:id', 'admin.Category/save');
    Route::delete('categories/:id', 'admin.Category/remove');
    Route::put('categories/:id/status', 'admin.Category/toggleStatus');
    Route::post('upload/image', 'admin.Upload/image');
    Route::post('upload/banner_image', 'admin.Upload/bannerImage');
    Route::post('upload/video', 'admin.Upload/video');
    Route::post('upload/domain_verify', 'admin.Upload/domainVerify');
    Route::get('orders', 'admin.Order/index');
    Route::get('orders/:id', 'admin.Order/detail');
    Route::post('orders/:id/save', 'admin.Order/save');
    Route::post('orders/:id/status', 'admin.Order/changeStatus');
    Route::post('orders/batch_delete', 'admin.Order/batchDelete');
    Route::post('orders/batch_ship', 'admin.Order/batchShip');
    Route::post('orders_create', 'admin.Order/create');

    // 售后订单
    Route::get('orders_aftersale', 'admin.Order/aftersale');
    Route::post('orders_aftersale/:id/refund', 'admin.Order/refund');
    Route::post('orders_aftersale/soft_delete', 'admin.Order/softDelete');
    Route::post('orders_aftersale/restore', 'admin.Order/restore');

    // 电子卡券
    Route::get('cards', 'admin.Card/index');
    Route::get('cards/transfers', 'admin.Card/transfers');
    Route::post('cards/:id/void', 'admin.Card/void');

    // 评论管理
    Route::get('reviews', 'admin.Review/index');
    Route::post('reviews/:id/reply', 'admin.Review/reply');
    Route::post('reviews/:id/toggle_hidden', 'admin.Review/toggleHidden');
    Route::post('reviews/batch_delete', 'admin.Review/batchDelete');
    Route::post('reviews/batch_toggle_hidden', 'admin.Review/batchToggleHidden');

    // 核销管理
    Route::post('verify', 'admin.Verify/index');
    Route::get('verify_records', 'admin.Verify/records');

    // 数据分析
    Route::get('stats/overview', 'admin.Stats/overview');
    Route::get('stats/trade', 'admin.Stats/trade');
    Route::get('stats/goods', 'admin.Stats/goods');
    Route::get('stats/web', 'admin.Stats/web');
    Route::get('stats/web_visitors', 'admin.Stats/webVisitors');
    Route::get('stats/web_top_pages', 'admin.Stats/webTopPages');
    Route::get('stats/summary', 'admin.Stats/summary');

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

    // 文章分类
    Route::get('article_categories', 'admin.ArticleCategory/index');
    Route::get('article_categories/tree', 'admin.ArticleCategory/tree');
    Route::post('article_categories', 'admin.ArticleCategory/save');
    Route::post('article_categories/:id/save', 'admin.ArticleCategory/save');
    Route::post('article_categories/:id/delete', 'admin.ArticleCategory/remove');
    Route::post('article_categories/:id/status', 'admin.ArticleCategory/toggleStatus');

    // 文章
    Route::get('articles', 'admin.Article/index');
    Route::get('articles/export', 'admin.Article/export');
    Route::get('articles/:id', 'admin.Article/info');
    Route::post('articles', 'admin.Article/save');
    Route::post('articles/:id/save', 'admin.Article/save');
    Route::post('articles/:id/delete', 'admin.Article/remove');
    Route::post('articles/batch_delete', 'admin.Article/batchDelete');
    Route::post('articles/:id/show', 'admin.Article/toggleShow');
    Route::post('articles_settings', 'admin.Article/settings');

    // 相册分类
    Route::get('album_categories', 'admin.AlbumCategory/index');
    Route::get('album_categories/all', 'admin.AlbumCategory/all');
    Route::get('album_categories/:id', 'admin.AlbumCategory/info');
    Route::post('album_categories', 'admin.AlbumCategory/save');
    Route::post('album_categories/:id/save', 'admin.AlbumCategory/save');
    Route::post('album_categories/:id/delete', 'admin.AlbumCategory/remove');
    Route::post('album_categories/batch_delete', 'admin.AlbumCategory/batchDelete');
    Route::post('album_categories/:id/status', 'admin.AlbumCategory/toggleStatus');

    // 相册
    Route::get('albums', 'admin.Album/index');
    Route::get('albums/all', 'admin.Album/all');
    Route::get('albums/:id', 'admin.Album/info');
    Route::post('albums', 'admin.Album/save');
    Route::post('albums/:id/save', 'admin.Album/save');
    Route::post('albums/:id/delete', 'admin.Album/remove');
    Route::post('albums/batch_delete', 'admin.Album/batchDelete');
    Route::post('albums/:id/status', 'admin.Album/toggleStatus');

    // 相册图片
    Route::get('album_images', 'admin.AlbumImage/index');
    Route::post('album_images/upload', 'admin.AlbumImage/upload');
    Route::post('album_images/:id/save', 'admin.AlbumImage/save');
    Route::post('album_images/:id/delete', 'admin.AlbumImage/remove');
    Route::post('album_images/batch_delete', 'admin.AlbumImage/batchDelete');
    Route::post('album_images/set_cover', 'admin.AlbumImage/setCover');
    Route::post('album_images/move_album', 'admin.AlbumImage/moveAlbum');
    Route::post('album_images/rename', 'admin.AlbumImage/rename');

    // 跳转小程序
    Route::get('mini_apps', 'admin.MiniApp/index');
    Route::get('mini_apps/all', 'admin.MiniApp/all');
    Route::get('mini_apps/:id', 'admin.MiniApp/info');
    Route::post('mini_apps', 'admin.MiniApp/save');
    Route::post('mini_apps/:id/save', 'admin.MiniApp/save');
    Route::post('mini_apps/:id/delete', 'admin.MiniApp/remove');
    Route::post('mini_apps/batch_delete', 'admin.MiniApp/batchDelete');
    Route::post('mini_apps/:id/status', 'admin.MiniApp/toggleStatus');

    // 操作日志
    Route::get('operation_logs', 'admin.OperationLog/index');
    Route::get('operation_logs/info', 'admin.OperationLog/info');
    Route::post('operation_logs/batch_delete', 'admin.OperationLog/batchDelete');
    Route::post('operation_logs/delete_by_time', 'admin.OperationLog/deleteByTime');
});
