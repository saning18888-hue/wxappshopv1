# B2C 微信小程序商城

> 依据 `PRD_B2C微信小程序商城_V1.0.md` 落地。当前为 **MVP 垂直切片**：已跑通「登录 → 商品 → 详情 → 购物车 → 下单 → 模拟支付」闭环。

## 技术决策（已确认）
- 后端：**ThinkPHP 8**；数据库 **MySQL 5.7（生产）/ SQLite（本地开发，免安装）**，不依赖云开发运行时
- 前端：**原生微信小程序**（WXML/WXSS/JS）
- 微信能力：**先用 Mock 模拟**（登录/支付），结构预留真实接口
- 范围：**垂直切片优先**，再按 PRD 分阶段补齐

## 目录结构
```
wxappb2c/
├── PRD_B2C微信小程序商城_V1.0.md   # 产品需求文档
├── server/                         # 后端（ThinkPHP 8）
│   ├── composer.json / .env.example
│   ├── public/index.php
│   ├── route/app.php               # /api/v1 路由
│   ├── config/database.php
│   ├── app/                         # common/service/controller
│   ├── database/install.sql        # MySQL 建表 + 演示种子
│   ├── database/install.sqlite.sql  # SQLite 建表 + 演示种子
│   ├── database/init_sqlite.php     # 本地 SQLite 初始化脚本
│   ├── think                        # 控制台入口（php think）
│   ├── router.php                   # PHP 内置服务器路由
│   └── README.md
└── miniprogram/                    # 原生小程序
    ├── config.js                   # useMock 开关 / API 地址
    ├── app.js / app.json / app.wxss
    ├── utils/                       # request / auth / mock
    ├── components/diy-render/       # 首页 DIY 装修渲染组件
    └── pages/                       # index/category/goods/cart/order/pay/member
```

## 快速开始
### 1）小程序（无需后端即可演示）
用「微信开发者工具」导入 `miniprogram/` 目录（已设 `touristappid`，可无 AppId 预览）。
- 默认 `config.js` 中 `useMock: true`，所有接口走本地 Mock 数据，可直接体验完整下单流程。
- 调试建议：开发者工具 → 详情 → 本地设置，关闭「校验合法域名」。

### 2）本地后端（SQLite，免装 MySQL，推荐先跑这个）
已在本地 PHP 8.2 + SQLite 验证跑通完整闭环（登录→商品→购物车→下单→模拟支付）。
```bash
cd server
php database/init_sqlite.php          # 生成 database/wxappb2c.sqlite 并灌演示种子（已执行可跳过）
php think run -H 127.0.0.1 -p 8787    # 启动开发服务器（保持运行）
```
小程序切真实后端：`miniprogram/config.js` 设 `useMock:false`，`baseUrl` 保持 `http://127.0.0.1:8787/api/v1`，并在开发者工具「详情→本地设置」勾选「不校验合法域名」。
（无 Composer 时：先 `php -r "copy('https://getcomposer.org/composer.phar','composer.phar');"` 再 `php composer.phar install`。）

### 3）后端（部署到服务器，MySQL）
见 `server/README.md`：
```bash
cd server && composer install && cp .env.example .env
mysql -u root -p < database/install.sql
# Web 根目录指向 server/public，配置伪静态去掉 index.php
```

### 4）切到服务器真实后端
1. 部署后端并导入数据库；在 `server/.env` 填 `DB_*` 与 `WECHAT_*`，`DEV_MOCK_LOGIN=false`。
2. 小程序 `miniprogram/config.js` 设 `useMock:false`，`baseUrl` 改为你的域名（需在微信后台配置合法域名）。
3. 后端 `AuthService::wechatLogin()` 与 `PaymentService::buildPayParams()` 已实现真实对接的预留位置。

## 已实现接口（后端 /api/v1）
登录、首页装修、分类、商品列表/详情、购物车增删改查、订单预览/创建/列表/详情、模拟支付回调。
详见 `server/README.md` 的接口清单。

## 下一步（按 PRD 分阶段）
- 第二阶段：快递/自提、库存流水、售后退款、优惠券、会员体系、商品评价。
- 第三阶段：DIY 可视化装修后台（page_versions）、内容中心、消息通知、订单打印、数据看板。
