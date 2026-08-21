# B2C 微信小程序商城 · 后端 API（ThinkPHP 8）

> 技术栈：PHP 8.2 + ThinkPHP 8；数据库 MySQL 5.7（生产）/ SQLite（本地开发，免安装），不依赖云开发运行时。
> 已实现：小程序 API 全链路 + 运营后台（单文件 `public/admin.html`）+ 短信双平台。

## 目录结构

```
server/
├── composer.json          # 依赖：topthink/framework ^8.0
├── .env / .env.example    # 环境变量（数据库 / ADMIN / 微信密钥 / Mock 开关 / 短信密钥）
├── public/index.php       # 入口（Nginx/Apache 指向此目录）
├── public/admin.html      # 运营后台（单文件 SPA，全部 JS/CSS 内嵌）
├── route/app.php          # 路由（/api/v1 与 /admin）
├── config/database.php    # 数据库配置（读 .env）
├── app/
│   ├── common/controller/ApiController.php    # API 基类：统一 JSON 信封
│   ├── common/controller/AdminController.php  # 后台基类：X-Admin-Token 鉴权 + 操作日志
│   ├── service/           # 业务层（Auth/Goods/Cart/Order/Payment/Stats/Member/Page/
│   │                      #          Review/Card/Verify/Settings/SmsContact/SmsSend...）
│   ├── controller/admin/  # 后台接口（商品/订单/会员/内容/系统/数据/短信...）
│   └── controller/api/v1/ # 小程序接口
└── database/install.sql   # MySQL 建表脚本
    database/init_sqlite.php   # SQLite 初始化（生成 wxappb2c.sqlite + 种子）
```

## 本地快速起（SQLite，免装 MySQL）✅ 已验证

```bash
cd server
composer install                    # 无 composer 时：php -r "copy('https://getcomposer.org/composer.phar','composer.phar');" 再 php composer.phar install
php database/init_sqlite.php        # 首次：生成 database/wxappb2c.sqlite + 种子
cp .env.example .env                # 已有则跳过；默认 DB_DRIVER=sqlite
php think run -H 127.0.0.1 -p 8899  # 启动（端口约定 8899，保持运行）
```

- 访问 `http://127.0.0.1:8899/api/v1/home` 应返回 JSON 装修配置。
- 运营后台：`http://127.0.0.1:8899/admin.html`（默认 `admin` / `admin123`，`.env` 可改）。
- 小程序联调：`miniprogram/config.js` 设 `useMock:false`，`baseUrl` 改为 `http://127.0.0.1:8899/api/v1`，并在开发者工具勾选「不校验合法域名」。
- 重置数据：删除 `database/wxappb2c.sqlite` 后重跑 `init_sqlite.php`。

> 端口如需改动，须同步修改 `miniprogram/config.js` 的 `baseUrl`。

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

## API 约定

- 统一前缀 `/api/v1`（小程序）、`/admin`（后台）。
- 响应信封：`{ "code": 0, "msg": "success", "data": {} }`（code=0 成功）。
- 小程序登录态：`Authorization: Bearer <token>`（dev_login 返回的 token）。
- 后台鉴权：请求头 `X-Admin-Token`（`sha256(ADMIN_USER:ADMIN_SECRET)`），非 GET 请求自动写操作日志。
- 金额：接口输出为「元」（decimal），数据库存「分」(INT)。

## 主要接口

### 小程序 /api/v1
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

### 运营后台 /admin（节选）
商品、分类、规格、属性；订单、售后、卡券、评论、核销；会员、分组；数据看板；文章、相册、跳转小程序；站点设置、操作日志、附件设置、短信管理（模板/商家联系人/发送日志/发送）。详见 `app/controller/admin/`。

## 接入真实微信登录/支付

- `AuthService::wechatLogin()` 预留 code2Session 调用；
- `PaymentService::buildPayParams()` 预留微信统一下单；
- 在 `.env` 配置 `WECHAT_APPID/APPSECRET/MCH_ID/MCH_KEY/NOTIFY_URL`，并将 `DEV_MOCK_LOGIN=false`。
- 真实支付回调验签、订单查询、退款按 PRD 7.3 在服务端完成，且需幂等。

## 更多文档

- 换机/运行/踩坑：见根目录 `RELEASE.md`。
- 版本记录：见根目录 `CHANGELOG.md`。
- UI 规范：见根目录 `UI设计规范.md`。
