# B2C 微信小程序商城

> 当前版本：**v0.1.114**（版本记录见 `CHANGELOG.md`；设计规范见 `UI设计规范.md`）。
> 产品需求见 `PRD.md`（含 V1.0 功能范围与 V2.0 设计驱动版）。新仓库规划见 `docs/新仓库规划.md`。
> 本文件整合了原 `RELEASE.md`（发版 / 换机 / 踩坑）与子模块 `README`（前端 `miniprogram/`、后端 `server/` 说明），为唯一的总文档入口。

## 一、项目目标与原则

建设一套可持续扩展的 B2C/O2O 微信小程序商城：商品销售、微信支付、快递 / 自提 / 同城配送、会员运营、优惠券 / 卡券 / 售后，以及运营后台 DIY 装修。

核心原则：
1. 小程序只负责展示与交互，商品 / 价格 / 库存 / 订单 / 装修均以后端数据为准。
2. 支付、退款、库存、订单状态变化必须在服务端完成并记录日志。
3. 先跑通「浏览 → 购物车 → 下单 → 支付 → 履约 → 售后」闭环，再逐步扩展营销。
4. DIY 页面用后端保存的 JSON 配置渲染，尽量不改代码即可调整布局。

完整需求见 `PRD.md`（V1.0 功能 + V2.0 设计系统）。新仓库演进规划见 `docs/新仓库规划.md`。

## 二、功能概览

- **小程序端**（原生 WXML/WXSS/JS）：首页（DIY 装修渲染）、分类、商品列表 / 详情（SKU 规格）、购物车、下单、支付结果、会员中心。
- **运营后台**（`server/public/admin.html` 单文件）：店铺装修（轮播 / 魔方导航 / 精选推荐 / 分类导航 / 首页布局 / 底部导航）、商品 / 分类 / 规格 / 属性、订单 / 售后 / 电子卡券 / 评论 / 核销、会员 / 分组、数据看板、文章 / 相册 / 内嵌网页 / 跳转小程序、站点设置 / 操作日志 / 附件设置 / 短信管理（阿里云 / 腾讯云 22 条模板 + 商家联系人推送）。
- **后端**（ThinkPHP 8）：小程序 API + 后台 API，SQLite（本地）/ MySQL（生产），短信双平台。

## 三、技术决策（已确认）

- 后端：**ThinkPHP 8**；数据库 **MySQL 5.7（生产）/ SQLite（本地开发，免安装）**，不依赖云开发运行时。
- 前端：**原生微信小程序**（WXML/WXSS/JS）。
- 微信能力：**当前为 Mock 模拟**（登录 / 支付），结构预留真实接口（`AuthService::wechatLogin()`、`PaymentService::buildPayParams()`）。
- 后台：**单文件 SPA**（`admin.html` 内嵌全部 JS/CSS），`X-Admin-Token` 鉴权，写操作自动记日志。

## 四、已完成 / 未完成

### 4.1 已完成（截至 v0.1.109）

**小程序端（miniprogram/）**
- 首页（DIY 装修渲染：轮播 / 魔方导航 / 精选推荐 / 分类导航 / 首页布局 / 底部导航）、分类、商品列表 / 详情（SKU 规格）、购物车、确认订单、支付结果、会员中心。
- 登录态与请求层：`utils/request.js`（Mock / 真实双模式、统一 JSON 信封）、`utils/auth.js`、`utils/mock.js`。
- 运行模式：`config.js` 中 `useMock` 开关，`true` 走本地 Mock，`false` 联调真实后端。
- 会员中心「我的页面装修」：后台可配置「我的订单」模块（模块名 / 右侧名 / 5 个订单状态名称·图标·显隐·跳转），`onShow` 即时渲染（关掉的状态不显示、改图标/名称即时生效）。
- 订单 / 售后页联通后端：`pages/order/{list,detail}` 与 `pages/aftersale/{apply,list}`，对接 `Order.php` 与 `OrderService.php`。
- 轮播图后台可设高度（默认 300rpx）：`diy-render` 的 swiper 高度绑定 `c.props.height`，发布后首页轮播即时变高/变矮。

**运营后台（server/public/admin.html，单文件 SPA）**
- 概况：运营概览（数据看板）。
- 店铺：我的模板（轮播设置、魔方导航、精选推荐、分类导航、首页布局、底部导航）、基础设置、店铺设置、配送设置（快递模板 / 到店自提 / 同城配送，支持地图选点、多自提点、阶梯运费、定时达）。
- 会员：会员列表（分配员工 / 分组）、会员分组（分配接口 `members/:id/assign_group`，下单按分组折扣算价）。
- 店铺·我的页面装修：后台可配置会员中心「我的订单」模块（模块名 / 右侧名 / 5 个订单状态名称·图标·显隐·跳转），每个图标输入框右侧实时显示 36×36 缩略图预览。
- 店铺·轮播设置：新增「轮播高度」步进输入框（默认 300rpx，标注当前值）。
- 商品：商品列表（SKU / 规格 / 属性 / 富文本编辑）、商品分类（三级树形）、商品规格、商品属性。
- 订单：订单列表（搜索 / 编辑 / 批量发货 / 代下单）、订单售后（待退款 / 已退款 / 回收站）、电子卡券、评论管理、核销管理（到店自提 / 电子卡券 / 优惠券核销）。
- 数据：商城概况 / 交易分析 / 商品分析 / 网站分析 / 汇总分析。
- 内容：文章管理（分类 / 列表 / 设置）、相册管理、内嵌网页、跳转小程序。
- 系统：站点设置（基础信息 + 域名校验）、操作日志（自动记录）、附件设置（远程附件）、短信管理（阿里云 / 腾讯云 22 条模板、商家联系人订阅推送、发送日志）。

**后端（server/，ThinkPHP 8 + SQLite/MySQL）**
- 业务层 `app/service/`：Auth/Goods/Cart/Order/Payment/Stats/Member/Page/Review/Card/Verify/Settings/SmsContact/SmsSend 等。
- 后台接口 `app/controller/admin/`：约 25 个控制器，`X-Admin-Token` 请求头鉴权，写操作自动记日志。
- 小程序接口 `app/controller/api/v1/`：登录 / 商品 / 分类 / 购物车 / 订单 / 支付等。
- 短信：阿里云 / 腾讯云双平台，模板配置 + 发送 + 日志。
- 会员分组端到端：`ApiController::formatUser` 返回分组 id / 名称 / 折扣，前端展示「XX组 / N折」，`MemberService::assignGroup` 分配，`OrderService::calcTotals` 按分组折扣算价。
- 商品促销语 / 副标题链路打通：`GoodsService::adminList` 返回分类名，`subtitle` 可入库，促销语经 `promotion` 透出到小程序分类卡片。

### 4.2 未完成 / 规划

- **真实微信能力**：登录目前为 Mock（`auth/dev_login`），支付为 Mock 回调（`payment/mock_notify`）；`AuthService::wechatLogin()`、`PaymentService::buildPayParams()` 已预留真实对接位置，需配置 `WECHAT_APPID/APPSECRET/MCH_ID/MCH_KEY` 并关闭 `DEV_MOCK_LOGIN`。
- **后台占位菜单**：`权限管理`（用户组 / 用户列表 / 员工管理 / 部门管理）与 `插件` 菜单（渠道 / 营销 / 会员 / 行业 / 工具 / 超管）仅存在于侧边栏 MENU 配置，**未实现面板**。
- **PRD 规划后续阶段**：秒杀 / 拼团 / 团购（V1.1）、分销、多门店 / 库存调拨 / 储值（V2.0）、优惠券营销完整闭环、同城配送线上闭环、消息通知、订单打印、物流查询等，详见 `PRD.md` 各阶段规划。

## 五、目录结构

```
wxappshopv1/
├── README.md              # 本文件（总文档入口，含原 RELEASE / 子模块 README）
├── CHANGELOG.md           # 版本记录（唯一数据源，最新在上）
├── PRD.md                 # 产品需求（V1.0 功能 + V2.0 设计驱动版）
├── UI设计规范.md           # 全站 UI 规范（后台 + 小程序）
├── docs/
│   └── 新仓库规划.md        # 新仓库原生小程序商城 PRD + MVP 迭代计划
├── 计划/                   # 后台各菜单参考截图（复刻依据）
├── server/                # 后端（ThinkPHP 8）
│   ├── public/admin.html   # 运营后台（单文件）
│   ├── public/index.php    # 入口（Nginx/Apache 指向此目录）
│   ├── route/app.php       # 路由（/api/v1 与 /admin）
│   ├── config/database.php # 数据库配置（读 .env）
│   ├── app/                # common / service / controller（admin + api/v1）
│   ├── database/           # init_sqlite.php / install.sql（MySQL）
│   ├── .env / .env.example # 环境变量（DB/ADMIN/WECHAT/Mock 开关）
│   ├── think               # 控制台入口（php think）
│   └──（详见本章七 · 7.2）
└── miniprogram/            # 原生小程序
    ├── config.js           # useMock 开关 / baseUrl
    ├── app.js / app.json / app.wxss
    ├── utils/              # request / auth / mock
    ├── components/diy-render/  # 首页 DIY 装修渲染组件
    └── pages/              # index/category/goods/cart/order/pay/member
```

## 六、快速开始 / 运行方式

### 6.0 准备工具
- **Git**（Windows：Git for Windows）
- **PHP 8.2+**（含 `pdo_sqlite` 扩展，本地开发免装 MySQL）
- **微信开发者工具**（导入小程序端）

### 6.1 拉代码 + 起后端（SQLite，免装 MySQL）

```bash
git clone https://github.com/saning18888-hue/wxappshopv1.git wxappshopv1
cd wxappshopv1
git checkout <最新 tag>          # 见 git tag / CHANGELOG.md

cd server
php -r "copy('https://getcomposer.org/composer.phar','composer.phar');"   # 无 composer 时
php composer.phar install                                                 # 生成 vendor/
php database/init_sqlite.php                                              # 生成 wxappb2c.sqlite + 种子（首次）
cp .env.example .env                                                      # 已有则跳过；默认 DB_DRIVER=sqlite
php think run -H 127.0.0.1 -p 8899                                       # 启动开发服务器（保持运行）
```
> **端口约定**：本项目统一用 **8899**（非 ThinkPHP 默认 8787）。若改端口，需同步改 `miniprogram/config.js` 的 `baseUrl`。

- 后端：`http://127.0.0.1:8899`
- 小程序 API：`http://127.0.0.1:8899/api/v1`
- 运营后台：`http://127.0.0.1:8899/admin.html`（默认账号 `admin` / `admin123`，可在 `.env` 改 `ADMIN_USER`/`ADMIN_PASS`/`ADMIN_SECRET`）

### 6.2 跑小程序

微信开发者工具导入 `miniprogram/` 目录（已配 `touristappid`，可无 AppId 预览）。
- `useMock:true`：走本地 Mock，无需后端即可体验完整下单流程。
- 联调真实后端：`useMock:false`，`baseUrl:'http://127.0.0.1:8899/api/v1'`，并在开发者工具「详情 → 本地设置」勾「不校验合法域名」。

### 6.3 部署到服务器（MySQL）

```bash
cd server && composer install && cp .env.example .env
mysql -u root -p < database/install.sql
# Web 根目录指向 server/public，配置伪静态去掉 index.php
```
Nginx 示例：
```nginx
location / { try_files $uri $uri/ /index.php$is_args$args; }
```

### 6.4 接入真实微信登录 / 支付

1. 部署后端并导入数据库；在 `server/.env` 填 `DB_*` 与 `WECHAT_APPID/APPSECRET/MCH_ID/MCH_KEY/NOTIFY_URL`，`DEV_MOCK_LOGIN=false`。
2. 小程序 `miniprogram/config.js` 设 `useMock:false`，`baseUrl` 改为你的域名（需在微信后台配置合法域名）。
3. 真实支付回调验签、订单查询、退款在服务端完成，且需幂等。

## 七、模块说明

### 7.1 小程序端（miniprogram/，原生）

**运行**：微信开发者工具 → 导入项目 → 选择 `miniprogram/` 目录；AppId 选「测试号」即可（已配 `touristappid`）。默认 `config.js` 中 `useMock:true`，无需后端即可体验完整下单闭环。

**目录**
- `config.js`：全局配置（`useMock` / `baseUrl`，端口约定 **8899**）
- `utils/request.js`：统一请求层（Mock / 真实双模式，统一 JSON 信封）
- `utils/auth.js`：登录态（token 缓存 + 自动 Mock 登录）
- `utils/mock.js`：内存 Mock 数据（与后端种子一致）
- `components/diy-render/`：首页 DIY 装修渲染组件（banner / nav_grid / goods_group）
- `pages/`：index 首页、category 分类、goods 商品、cart 购物车、order 确认订单、pay 支付结果、member 我的

**切真实后端**：改 `config.js`：`useMock:false`，`baseUrl:'http://127.0.0.1:8899/api/v1'`（本地）或 `'https://你的域名/api/v1'`（生产）。请求层会自动带 `Authorization: Bearer <token>`。

**设计规范**
- 主色 `#FF6B35`（橙）、配送绿 `#00B86B`，已在 `app.wxss` 以 CSS 变量声明。
- 尺寸统一用 `rpx`，适配多屏；底部 tabBar 文字型（无需图标二进制）。
- 整体设计语言与后台的紫色 Linear 风格独立：小程序端主题见 `app.wxss`，全站 UI 规范见 `UI设计规范.md`。

### 7.2 后端 API（server/，ThinkPHP 8）

> 技术栈：PHP 8.2 + ThinkPHP 8；数据库 MySQL 5.7（生产）/ SQLite（本地开发，免安装），不依赖云开发运行时。已实现：小程序 API 全链路 + 运营后台（单文件 `public/admin.html`）+ 短信双平台。

**目录结构**
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
│   ├── service/           # 业务层（Auth/Goods/Cart/Order/Payment/Stats/Member/Page/Review/Card/Verify/Settings/SmsContact/SmsSend...）
│   ├── controller/admin/  # 后台接口（商品/订单/会员/内容/系统/数据/短信...）
│   └── controller/api/v1/ # 小程序接口
└── database/install.sql   # MySQL 建表脚本
    database/init_sqlite.php   # SQLite 初始化（生成 wxappb2c.sqlite + 种子）
```

**本地快速起（SQLite，免装 MySQL）✅ 已验证**
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

**服务器部署（MySQL）**
1. 安装依赖（服务器需 PHP 8.1+、Composer、MySQL 5.7+）：`cd server && composer install && cp .env.example .env`（DB_DRIVER=mysql，并填写 DB_*）。
2. 初始化数据库：`mysql -u root -p < database/install.sql`。
3. Web 服务器根目录指向 `server/public`，并配置伪静态（去除 `index.php`）（Nginx 见 6.3）。

**API 约定**
- 统一前缀 `/api/v1`（小程序）、`/admin`（后台）。
- 响应信封：`{ "code": 0, "msg": "success", "data": {} }`（code=0 成功）。
- 小程序登录态：`Authorization: Bearer <token>`（dev_login 返回的 token）。
- 后台鉴权：请求头 `X-Admin-Token`（`sha256(ADMIN_USER:ADMIN_SECRET)`），非 GET 请求自动写操作日志。
- 金额：接口输出为「元」（decimal），数据库存「分」(INT)。

**主要接口**
小程序 `/api/v1`：
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

运营后台 `/admin`（节选）：商品、分类、规格、属性；订单、售后、卡券、评论、核销；会员、分组；数据看板；文章、相册、跳转小程序；站点设置、操作日志、附件设置、短信管理（模板/商家联系人/发送日志/发送）。详见 `app/controller/admin/`。

**接入真实微信登录/支付**：`AuthService::wechatLogin()` 预留 code2Session 调用；`PaymentService::buildPayParams()` 预留微信统一下单；在 `.env` 配置 `WECHAT_APPID/APPSECRET/MCH_ID/MCH_KEY/NOTIFY_URL`，并将 `DEV_MOCK_LOGIN=false`。真实支付回调验签、订单查询、退款按 `PRD.md` 在服务端完成，且需幂等。

## 八、关键文件

| 文件 / 目录 | 说明 |
|---|---|
| `server/public/admin.html` | **运营后台前端（单文件，全部 JS/CSS 内嵌）** |
| `server/app/controller/admin/` | 后台接口控制器 |
| `server/app/controller/api/v1/` | 小程序 API |
| `server/app/service/` | 业务逻辑层 |
| `server/route/app.php` | 路由（/api/v1 与 /admin） |
| `server/config/database.php` | 数据库配置（读 .env，SQLite/MySQL） |
| `server/.env` | 环境配置：DB、ADMIN_USER/PASS/SECRET、WECHAT、DEV_MOCK_LOGIN |
| `server/database/init_sqlite.php` | SQLite 初始化（生成 wxappb2c.sqlite + 种子数据） |
| `server/database/install.sql` | MySQL 建表脚本 |
| `miniprogram/config.js` | 小程序端 useMock/baseUrl 开关 |
| `miniprogram/app.wxss` | 小程序主题变量（主色 #FF6B35） |
| `CHANGELOG.md` | **版本记录唯一数据源（最新在上）** |
| `UI设计规范.md` | 全站 UI 规范（后台 + 小程序） |
| `PRD.md` | 产品需求文档（V1.0 + V2.0 设计驱动版） |
| `docs/新仓库规划.md` | 新仓库原生小程序商城 PRD + MVP 规划 |
| `计划/` | 后台各菜单的参考截图（复刻依据） |

## 九、提交与发版规范（必读）

- **发版即写更新文档**：每次发版 / 重大更新**提交前**，必须在 `CHANGELOG.md` 顶部追加版本记录——这是单一数据源，且必须与 `git tag` 同步。
- **禁止 `git commit -m "中文"`（Windows 会乱码）**：PowerShell 默认 GBK 会把中文字面量双重编码，导致 commit message 变成 `璁㈠崟...`。
  - ✅ 正确做法：中文 message 写入 **UTF-8 无 BOM** 文件后 `git commit -F 文件.txt`；或提交前 `chcp 65001` 切 UTF-8。
  - ✅ 建议：`git config --global i18n.commitEncoding utf-8` 与 `i18n.logOutputEncoding utf-8`。
- **推送前自检**：`git log -1 --pretty=%s` 若显示非中文即为乱码，`git commit --amend` 修正后再 push。
- **版本号规则**：`v主.次.修订`，`git tag vX.Y.Z`。
- **改后台 JS 强制校验**：`admin.html` 内嵌全部业务 JS，改后必须做语法校验，否则整页崩（见第十章踩坑 #3）。
- **发版流程（强制规范）**：改代码 → **在 `CHANGELOG.md` 顶部追加版本记录（最新在上）** → `git commit` → `git tag vX.Y.Z` → 用户确认后推送。
- **远程与推送**：主推 **CNB**（`cnb` 远程 `nuomaimai/vxappshopv1`）；**GitHub**（`origin` `saning18888-hue/wxappshopv1`）仅作备份，**不主动推送**。推送需用户明确要求，命令：`git push cnb master --tags`。

## 十、踩坑记录（换机必看）

1. **中文编码规范（强制，否则提交到 GitHub 全是乱码）**：Windows 下 PowerShell 默认 GBK 代码页，会把中文字面量 / 路径双重编码，导致 commit message、文件名、`.gitignore` 中文规则全部变成 `璁㈠崟...` 之类 mojibake。**硬性要求**：
   - **一切含中文的文本文件（`.md` / `.gitignore` / 代码注释 / 文档）必须保存为 UTF-8 无 BOM**（BOM 会被 git 当字符吞掉，中文 gitignore 规则直接失效）。
   - **禁止 `git commit -m "中文"`**：中文 message 必须先写入 UTF-8 无 BOM 文件，再 `git commit -F 文件.txt`；或提交前 `chcp 65001`；或配置 `i18n.commitEncoding=utf-8` + `i18n.logOutputEncoding=utf-8`。
   - **含中文路径 / 规则时勿用 PowerShell 管道传参给 git**（编码错乱导致误判，如 `git ls-files | Select-String "计划"` 查不到、`check-ignore` 误报）——用 `git add -A -n`、`git diff-tree --name-status` 等不依赖中文参数的校验方式。
   - **推送前自检**：`git log -1 --pretty=%s` 若显示非中文即乱码；`git show HEAD --name-only` 检查含中文的文件名是否正常。有乱码必须修正后再 push。
2. **CHANGELOG 与 git tag 必须同步**：每次打 tag 都要同步更新 CHANGELOG，否则版本号对不上（曾因 v0.1.49~53 漏记导致顶部版本落后于 tag）。
3. **后台内嵌 JS 语法错误会整页崩**：`admin.html` 的 `<script>` 内嵌全部业务 JS。改动后必须校验：`node -e "new (require('vm').Script)(<script内容>)"`（曾因精简数组残留项导致 `Unexpected token '{'`，登录按钮直接失效）。**改完 JS 强制校验**。
4. **推送选择 checkbox 反复返工教训**：`appearance:none` 自绘方框 + `::after` 对勾易出现"框太大 / 对勾偏位 / 截断"，**统一改用原生 checkbox + `accent-color`**（见 `UI设计规范.md`）。
5. **小程序 require 不支持绝对路径**：必须按目录层级用相对路径（两级 `../../utils/`，三级 `../../../utils/`）。
6. **CartService 表别名**：SQLite 下 `Db::name('carts c')` 会被误解析为表 `carts_c`，必须用 `Db::name('carts')->alias('c')`。
7. **路由完整匹配**：`config/route.php` 需 `'route_complete_match' => true`，否则 `goods` 前缀抢匹配 `goods/:id`。
8. **PHP 内置服务器 + 静态目录冲突**：静态文件目录名不能与应用路由前缀冲突（后台放 `public/admin.html` 而非 `public/admin/`）。
9. **utils/request.js 与 auth.js 循环依赖**：已改为单向依赖（auth→request），request 内 token 直接 `wx.getStorageSync('wxapp_token')`。
10. **端口易混淆**：本机历史曾出现过 8080 / 8787 / 8899 三套端口，PHP 内置服务器重启后端口会变。**排查"登录 / 接口不通"先确认实际监听端口**：`Get-NetTCPConnection -State Listen | Where LocalPort -in 8080,8787,8899`。
11. **GitHub 凭据**：远程 URL 内嵌 Token（`https://<user>:<token>@github.com/...`）。换新 Token 后 GCM 可能仍发旧凭据报错，用 `git -c credential.helper= push https://<user>:<新token>@github.com/...` 绕过。
12. **`.gitignore` 对已跟踪文件无效**：`计划/` 等目录若已被 `git add` 进仓库，即使写进 `.gitignore` 也不会自动移除。要让某个已跟踪目录 / 文件"不进 GitHub"，必须 `git rm -r --cached 计划/`（仅从版本控制移除，本地文件保留）+ `.gitignore` 加规则，再提交。新增的目录应从一开始就进 `.gitignore`。

## 十一、更多文档

- `CHANGELOG.md`：版本记录（唯一数据源，最新在上）。
- `UI设计规范.md`：全站 UI 规范（后台 + 小程序）。
- `PRD.md`：产品需求（V1.0 功能范围 + V2.0 设计驱动版）。
- `docs/新仓库规划.md`：新仓库原生小程序商城 PRD + MVP 迭代计划。
- `AI记忆库.md`：AI 协作便携记忆（不入库，换机拷贝即用）。
