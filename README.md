# B2C 微信小程序商城

> 基于 `PRD_B2C微信小程序商城_V1.0.md` 落地，UI 遵循 `PRD_B2C微信小程序商城_V2.0_设计驱动版.md` 与 `UI设计规范.md`。
> 当前版本：**v0.1.100**（版本记录见 `CHANGELOG.md`；换机/环境说明见 `RELEASE.md`）。

## 功能概览

- **小程序端**（原生 WXML/WXSS/JS）：首页（DIY 装修渲染）、分类、商品列表/详情（SKU 规格）、购物车、下单、支付结果、会员中心。
- **运营后台**（`server/public/admin.html` 单文件）：店铺装修（轮播/魔方导航/精选推荐/分类导航/首页布局/底部导航）、商品/分类/规格/属性、订单/售后/电子卡券/评论/核销、会员/分组、数据看板、文章/相册/内嵌网页/跳转小程序、站点设置/操作日志/附件设置/短信管理（阿里云/腾讯云 22 条模板 + 商家联系人推送）。
- **后端**（ThinkPHP 8）：小程序 API + 后台 API，SQLite（本地）/ MySQL（生产），短信双平台。

> 详细"已完成 / 未完成"清单见 `RELEASE.md` 第 2–3 章。

## 技术决策（已确认）

- 后端：**ThinkPHP 8**；数据库 **MySQL 5.7（生产）/ SQLite（本地开发，免安装）**，不依赖云开发运行时。
- 前端：**原生微信小程序**（WXML/WXSS/JS）。
- 微信能力：**当前为 Mock 模拟**（登录/支付），结构预留真实接口（`AuthService::wechatLogin()`、`PaymentService::buildPayParams()`）。
- 后台：**单文件 SPA**（`admin.html` 内嵌全部 JS/CSS），`X-Admin-Token` 鉴权，写操作自动记日志。

## 目录结构

```
wxappshopv1/
├── PRD_B2C微信小程序商城_V1.0.md        # 产品需求（功能范围）
├── PRD_B2C微信小程序商城_V2.0_设计驱动版.md  # 产品需求（Airbnb 风格设计系统）
├── README.md                           # 本文件
├── RELEASE.md                          # 发版与换机交接（目标/进度/运行/踩坑）
├── CHANGELOG.md                        # 版本记录（唯一数据源，最新在上）
├── UI设计规范.md                        # 全站 UI 规范（后台 + 小程序）
├── 计划/                               # 后台各菜单参考截图（复刻依据）
├── server/                             # 后端（ThinkPHP 8）
│   ├── public/admin.html               # 运营后台（单文件）
│   ├── public/index.php                # 入口（Nginx/Apache 指向此目录）
│   ├── route/app.php                   # 路由（/api/v1 与 /admin）
│   ├── config/database.php             # 数据库配置（读 .env）
│   ├── app/                            # common / service / controller（admin + api/v1）
│   ├── database/                       # init_sqlite.php / install.sql（MySQL）
│   ├── .env / .env.example             # 环境变量（DB/ADMIN/WECHAT/Mock 开关）
│   ├── think                            # 控制台入口（php think）
│   └── README.md
└── miniprogram/                        # 原生小程序
    ├── config.js                       # useMock 开关 / baseUrl
    ├── app.js / app.json / app.wxss
    ├── utils/                          # request / auth / mock
    ├── components/diy-render/          # 首页 DIY 装修渲染组件
    └── pages/                          # index/category/goods/cart/order/pay/member
```

## 快速开始

### 1）本地后端（SQLite，免装 MySQL，推荐先跑）

```bash
cd server
php database/init_sqlite.php          # 首次：生成 database/wxappb2c.sqlite 并灌种子
cp .env.example .env                  # 已有则跳过；默认 DB_DRIVER=sqlite
php think run -H 127.0.0.1 -p 8899    # 启动开发服务器（保持运行）
```

- 小程序 API：`http://127.0.0.1:8899/api/v1`
- 运营后台：`http://127.0.0.1:8899/admin.html`（默认 `admin` / `admin123`，可在 `.env` 修改）
- 无 Composer 时：先 `php -r "copy('https://getcomposer.org/composer.phar','composer.phar');"` 再 `php composer.phar install`。

> **端口约定 8899**：与 `miniprogram/config.js` 的 `baseUrl` 保持一致；改端口需同步改。

### 2）小程序（无需后端即可演示）

用「微信开发者工具」导入 `miniprogram/` 目录（已设 `touristappid`，可无 AppId 预览）。
- 默认 `config.js` 中 `useMock:true`，所有接口走本地 Mock 数据，可直接体验完整下单流程。
- 联调真实后端：`useMock:false`，`baseUrl:'http://127.0.0.1:8899/api/v1'`，并在开发者工具「详情→本地设置」勾选「不校验合法域名」。

### 3）部署到服务器（MySQL）

```bash
cd server && composer install && cp .env.example .env
mysql -u root -p < database/install.sql
# Web 根目录指向 server/public，配置伪静态去掉 index.php
```

### 4）接入真实微信登录/支付

1. 部署后端并导入数据库；在 `server/.env` 填 `DB_*` 与 `WECHAT_APPID/APPSECRET/MCH_ID/MCH_KEY/NOTIFY_URL`，`DEV_MOCK_LOGIN=false`。
2. 小程序 `miniprogram/config.js` 设 `useMock:false`，`baseUrl` 改为你的域名（需在微信后台配置合法域名）。
3. 真实支付回调验签、订单查询、退款在服务端完成，且需幂等。

## 提交规范（必读）

- **发版即写更新文档**：每次发版/重大更新**提交前**，必须在 `CHANGELOG.md` 顶部追加版本记录——这是单一数据源，且必须与 `git tag` 同步。
- **禁止 `git commit -m "中文"`（Windows 会乱码）**：PowerShell 默认 GBK 会把中文字面量双重编码，导致 commit message 变成 `璁㈠崟...`。
  - ✅ 正确做法：中文 message 写入 **UTF-8 无 BOM** 文件后 `git commit -F 文件.txt`；或提交前 `chcp 65001` 切 UTF-8。
  - ✅ 建议：`git config --global i18n.commitEncoding utf-8` 与 `i18n.logOutputEncoding utf-8`。
- **推送前自检**：`git log -1 --pretty=%s` 若显示非中文即为乱码，`git commit --amend` 修正后再 push。
- **版本号规则**：`v主.次.修订`，`git tag vX.Y.Z`；推送 `git push origin master --tags`（用户明确要求才推）。
- **改后台 JS 强制校验**：`admin.html` 内嵌全部业务 JS，改后必须做语法校验，否则整页崩（详见 `RELEASE.md` 踩坑 #3）。

## 更多文档

- `RELEASE.md`：换机重建指南、运行方式、踩坑记录。
- `server/README.md`：后端接口与部署细节。
- `miniprogram/README.md`：小程序端说明。
- `docs/新仓库PRD.md`：新仓库原生小程序商城产品需求文档（沉淀概况/设计装修底座 + 设计规范）。
- `docs/新仓库MVP.md`：新仓库 MVP 规划（Sprint 迭代计划 + 技术清单 + 完成定义）。
