# 发版与换机交接日志（RELEASE.md）

> 用途：每次更新完一个版本，把本次改动追加到「## 版本记录」里；换机/新同事接手时，照「换机重建指南」即可把环境跑起来。
> 维护约定：**发版即写日志**，新版本号加在「版本记录」最上面（最新在上）。

---

## 换机重建指南（照做即可）

### 0）准备工具
- **Git**：Windows 用 [Git for Windows](https://git-scm.com/download/win)（本机曾用 GitHub Desktop 自带 git：`C:\Users\Sonic\AppData\Local\GitHubDesktop\app-3.6.2\resources\app\git\cmd\git.exe`）。
- **PHP 8.2+**（含 `pdo_sqlite` 扩展）：本地开发用 SQLite，免装 MySQL。
- **微信开发者工具**：导入小程序端。
- **Composer**（可选）：无则用 `composer.phar`。

### 1）拉代码
```bash
git clone https://cnb.cool/nuomaimai/wxappshopv1.git wxappshopv1
cd wxappshopv1
git checkout v0.1        # 或最新 tag
```
> CNB 鉴权：HTTPS 用户名固定 `cnb`，密码为访问令牌，令牌需勾选 `repo-code:rw`（代码读写）权限。
> ⚠️ 本机若装了 Git 凭据管理器（GCM），换新令牌后可能仍发旧 token 报 `Credentials Expired`。推送时用：
> `git -c credential.helper= push https://cnb:<新令牌>@cnb.cool/nuomaimai/wxappshopv1.git master --tags`

### 2）起后端（SQLite，免装 MySQL）
```bash
cd server
php -r "copy('https://getcomposer.org/composer.phar','composer.phar');"   # 无 composer 时
php composer.phar install                                                 # 安装 ThinkPHP 依赖（生成 vendor/）
php database/init_sqlite.php                                              # 生成 database/wxappb2c.sqlite + 演示种子（首次需执行）
cp .env.example .env                                                      # 已存在 .env 则跳过；默认 DB_DRIVER=sqlite
php think run -H 127.0.0.1 -p 8787                                       # 启动开发服务器（保持运行）
```
后端地址：`http://127.0.0.1:8787`
- 小程序 API：`http://127.0.0.1:8787/api/v1`
- 运营后台：`http://127.0.0.1:8787/admin.html`（默认账号 `admin` / `admin123`，可在 `.env` 改 `ADMIN_USER`/`ADMIN_PASS`/`ADMIN_SECRET`）

### 3）跑小程序（无需后端即可演示）
微信开发者工具导入 `miniprogram/` 目录（已配 `touristappid`，可无 AppId 预览）。
- 默认 `miniprogram/config.js` 中 `useMock: true` → 走本地 Mock 数据，直接体验下单闭环。
- 联调真实后端：改 `useMock:false`、`baseUrl:'http://127.0.0.1:8787/api/v1'`，并在开发者工具「详情 → 本地设置」勾「不校验合法域名」。

### 4）已验证接口（v0.1，全部 200）
`home` / `categories` / `goods` / `goods/:id` / `auth/dev_login` / `cart(add+list)` / `order/preview` / `order(create)` / `payment/mock_notify` / `order(detail)`；后台 `admin/goods` `admin/orders` `admin/design/home` 等。

### 5）关键坑（换机必看，避免重踩）
- **小程序 require 不支持绝对路径**：必须按目录层级用相对路径（两级目录 `../../utils/`，三级 `../../../utils/`）。
- **CartService 表别名**：SQLite 下 `Db::name('carts c')` 会被误解析为表 `carts_c`，必须用 `Db::name('carts')->alias('c')`。
- **路由完整匹配**：`config/route.php` 需 `'route_complete_match' => true`，否则 `goods` 前缀抢匹配 `goods/:id`。
- **ThinkPHP 内置服务器 + 自定义 router.php**：静态文件目录名不能与应用路由前缀冲突（前端后台放 `public/admin.html` 而非 `public/admin/`）。
- **utils/request.js 与 auth.js 循环依赖**：已改为单向依赖（auth→request），request 内 token 直接 `wx.getStorageSync('wxapp_token')`。

---

## 版本记录（最新在上）

### v0.1 · 2026-08-12 · 初版（MVP 垂直切片）
**范围**：B2C 微信小程序商城初版，跑通「登录 → 商品 → 详情 → 购物车 → 下单 → 模拟支付」闭环。

**后端（ThinkPHP 8 + SQLite 本地开发）**
- 基础：`composer.json`、`route/app.php`（/api/v1）、`config/database.php`（支持 mysql/sqlite 双驱动）、`ApiController` 基类、`think` 控制台入口、`public/router.php`、`runtime/`。
- 服务层：`Auth / Goods / Cart / Order / Payment` 5 个 Service（微信登录/支付为 Mock，预留真实接口）。
- 控制器：7 个（含 `admin/{Auth,Goods,Order,Category}`、`api/v1/{Home,Goods,Cart,Order,Payment}`）。
- 首页 DIY 装修：`pages` + `page_versions` 两表，`PageService`（草稿/发布/回滚）、`admin/Design` 控制器、Home 优先读已发布配置。
- 鉴权：管理后台 `X-Admin-Token`（sha256(ADMIN_USER:ADMIN_SECRET)）。

**前端（原生小程序 `miniprogram/`）**
- 8 个页面：首页DIY / 分类 / 商品列表 / 详情(含SKU) / 购物车 / 确认订单 / 支付结果 / 我的。
- `utils`：`request`(双模式) / `auth` / `mock`；`components/diy-render`：banner / nav_grid / goods_group / category_nav 渲染。
- `config.js`：`useMock` 开关 + `baseUrl`。

**运营后台（`server/public/admin.html`）**
- SaaS 风格双栏导航：左侧窄边栏（图标+文字）+ 二级面板 + 主内容区。
- 九大一级菜单（按用户指定顺序）：概况 / 店铺 / 会员 / 商品 / 订单 / 数据 / 内容 / 系统 / 插件。
  - 概况：运营概览
  - 店铺：我的模板（装修编辑器）、基础设置、店铺设置、配送设置
  - 会员：会员列表、会员分组
  - 商品：商品列表、商品分类、商品规格、商品属性
  - 订单：订单列表、订单售后、电子卡券、评论管理、核销管理
  - 数据：商城概况、交易分析、商品分析、网站分析、汇总分析
  - 内容：文章管理、banner 管理、魔方导航、相册管理、内嵌网页、跳转小程序
  - 系统：站点设置、操作日志、附件设置、短信管理、权限管理（三级：用户组/用户列表/员工管理/部门管理）
  - 插件：全部、渠道、营销、会员、行业、工具、超管
- 已接入功能：概况看板、商品管理、订单管理、首页装修（结构化编辑器：轮播/金刚区/精选好物/商品分类，支持草稿/发布/回滚）；其余二级菜单显示「待上线」占位页。

**文档**：`PRD_B2C微信小程序商城_V1.0.md`、顶层 `README.md`、`server/README.md`、`miniprogram/README.md`。

**Git**：仓库 `https://cnb.cool/nuomaimai/wxappshopv1`，默认分支 `master`，tag `v0.1`（commit `bf5954f`）。根 `.gitignore` 忽略 `.codebuddy/`、IDE；`server/.gitignore` 忽略 `vendor/`、`runtime/`、`.env`、`*.sqlite`、`composer.phar`。
