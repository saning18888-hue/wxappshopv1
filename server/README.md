# B2C 微信小程序商城 · 后端 API（ThinkPHP 8）

> 版本：MVP 垂直切片（登录 → 商品 → 购物车 → 下单 → 模拟支付）
> 技术栈：PHP 8.2 + ThinkPHP 8；数据库 MySQL 5.7（生产）/ SQLite（本地开发，免安装），不依赖云开发运行时

## 目录结构
```
server/
├── composer.json          # 依赖：topthink/framework ^8.0
├── .env.example           # 环境变量样例（数据库 / 微信密钥 / Mock 开关）
├── public/index.php       # 入口（Nginx/Apache 指向此目录）
├── route/app.php          # /api/v1 路由
├── config/database.php    # 数据库配置（读 .env）
├── app/
│   ├── common/controller/ApiController.php  # API 基类：统一 JSON 信封 + 登录校验
│   ├── service/           # 业务层（Auth/Goods/Cart/Order/Payment）
│   └── controller/api/v1/ # 接口层
└── database/install.sql   # 建表 + 演示种子数据
```

## 本地快速起（SQLite，免装 MySQL）✅ 已验证
适合本地开发 / 联调，无需安装任何数据库：
```bash
cd server
# 1) 安装依赖（无 Composer 时先下载 composer.phar：php -r "copy('https://getcomposer.org/composer.phar','composer.phar');" 再 php composer.phar install）
composer install
# 2) 初始化 SQLite 数据库并灌演示种子（生成 database/wxappb2c.sqlite）
php database/init_sqlite.php
# 3) 启动开发服务器（保持运行；.env 中 DB_DRIVER=sqlite 已默认）
php think run -H 127.0.0.1 -p 8787
```
- 访问 `http://127.0.0.1:8787/api/v1/home` 应返回 JSON 装修配置。
- 小程序联调：`miniprogram/config.js` 设 `useMock:false`，`baseUrl` 改为 `http://127.0.0.1:8787/api/v1`，并在开发者工具勾选「不校验合法域名」。
- 重置数据：删除 `database/wxappb2c.sqlite` 后重跑 `init_sqlite.php`。

## 服务器部署（MySQL）
1. 安装依赖（服务器需 PHP 8.1+、Composer、MySQL 5.7+）
   ```bash
   cd server
   composer install
   cp .env.example .env      # DB_DRIVER=mysql，并填写 DB_*
   ```
2. 初始化数据库
   ```bash
   mysql -u root -p < database/install.sql
   ```
3. Web 服务器根目录指向 `server/public`，并配置伪静态（去除 `index.php`）。
   Nginx 示例：
   ```nginx
   location / {
       try_files $uri $uri/ /index.php$is_args$args;
   }
   ```
4. 访问 `https://你的域名/api/v1/home` 应返回 JSON 装修配置。

## API 约定
- 统一前缀 `/api/v1`
- 响应信封：`{ "code": 0, "msg": "success", "data": {} }`（code=0 成功）
- 登录态：`Authorization: Bearer <token>`（dev_login 返回的 token）
- 金额：接口输出为「元」（decimal），数据库存「分」(INT)

## 已实现的接口
| 方法 | 路径 | 说明 |
|---|---|---|
| POST | /api/v1/auth/dev_login | 开发态 Mock 登录，返回 token |
| GET  | /api/v1/user/info | 会员资料（需登录） |
| GET  | /api/v1/home | 首页 DIY 装修配置 |
| GET  | /api/v1/categories | 两级分类树 |
| GET  | /api/v1/goods | 商品列表（分页/筛选/排序） |
| GET  | /api/v1/goods/:id | 商品详情（SKU/规格） |
| GET/POST/PUT/DELETE | /api/v1/cart | 购物车增删改查（需登录） |
| POST | /api/v1/order/preview | 下单前价格预览（服务端重算） |
| POST | /api/v1/order | 创建订单（锁库存） |
| GET  | /api/v1/order | 订单列表 |
| GET  | /api/v1/order/:id | 订单详情 |
| POST | /api/v1/payment/mock_notify | 模拟支付回调（幂等） |

## 接入真实微信登录/支付
- `AuthService::wechatLogin()` 预留 code2Session 调用；
- `PaymentService::buildPayParams()` 预留微信统一下单；
- 在 `.env` 配置 `WECHAT_APPID/APPSECRET/MCH_ID/MCH_KEY/NOTIFY_URL`，并将 `DEV_MOCK_LOGIN=false`。
- 真实支付回调验签、订单查询、退款按 PRD 7.3 在服务端完成，且需幂等。

## 下一步（按 PRD 分阶段）
第二阶段：快递/自提、库存流水、售后、优惠券、会员、评价。
第三阶段：DIY 可视化装修后台、内容中心、消息通知、订单打印、数据看板。
