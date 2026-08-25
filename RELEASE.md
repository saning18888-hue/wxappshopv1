# 发版与换机交接（RELEASE.md）

> 用途：新机器 / 新同事接手时，照本文件即可把环境跑起来，并了解项目全貌。
> **版本更新记录统一维护于 `CHANGELOG.md`（单一数据源），本文件不再重复维护版本列表。**

---

## 一、项目目标

建设一套可持续扩展的 B2C/O2O 微信小程序商城：商品销售、微信支付、快递/自提/同城配送、会员运营、优惠券/卡券/售后，以及运营后台 DIY 装修。

核心原则：
1. 小程序只负责展示与交互，商品/价格/库存/订单/装修均以后端数据为准。
2. 支付、退款、库存、订单状态变化必须在服务端完成并记录日志。
3. 先跑通「浏览 → 购物车 → 下单 → 支付 → 履约 → 售后」闭环，再逐步扩展营销。
4. DIY 页面用后端保存的 JSON 配置渲染，尽量不改代码即可调整布局。

完整需求见 `PRD_B2C微信小程序商城_V1.0.md`（功能）与 `PRD_B2C微信小程序商城_V2.0_设计驱动版.md`（Airbnb 风格设计系统）。

---

## 二、已完成（截至 v0.1.94）

### 2.1 小程序端（miniprogram/）
- 首页（DIY 装修渲染：轮播/魔方导航/精选推荐/分类导航/首页布局/底部导航）、分类、商品列表/详情（SKU 规格）、购物车、确认订单、支付结果、会员中心。
- 登录态与请求层：`utils/request.js`（Mock/真实双模式、统一 JSON 信封）、`utils/auth.js`、`utils/mock.js`。
- 运行模式：`config.js` 中 `useMock` 开关，`true` 走本地 Mock，`false` 联调真实后端。

### 2.2 运营后台（server/public/admin.html，单文件 SPA）
- **概况**：运营概览（数据看板）。
- **店铺**：我的模板（轮播设置、魔方导航、精选推荐、分类导航、首页布局、底部导航）、基础设置、店铺设置、配送设置（快递模板/到店自提/同城配送，支持地图选点、多自提点、阶梯运费、定时达）。
- **会员**：会员列表（分配员工/分组）、会员分组。
- **商品**：商品列表（SKU/规格/属性/富文本编辑）、商品分类（三级树形）、商品规格、商品属性。
- **订单**：订单列表（搜索/编辑/批量发货/代下单）、订单售后（待退款/已退款/回收站）、电子卡券、评论管理、核销管理（到店自提/电子卡券/优惠券核销）。
- **数据**：商城概况 / 交易分析 / 商品分析 / 网站分析 / 汇总分析。
- **内容**：文章管理（分类/列表/设置）、相册管理、内嵌网页、跳转小程序。
- **系统**：站点设置（基础信息 + 域名校验）、操作日志（自动记录）、附件设置（远程附件）、短信管理（阿里云/腾讯云 22 条模板、商家联系人订阅推送、发送日志）。

### 2.3 后端（server/，ThinkPHP 8 + SQLite/MySQL）
- 业务层 `app/service/`：Auth/Goods/Cart/Order/Payment/Stats/Member/Page/Review/Card/Verify/Settings/SmsContact/SmsSend 等。
- 后台接口 `app/controller/admin/`：约 25 个控制器，`X-Admin-Token` 请求头鉴权，写操作自动记日志。
- 小程序接口 `app/controller/api/v1/`：登录/商品/分类/购物车/订单/支付等。
- 短信：阿里云/腾讯云双平台，模板配置 + 发送 + 日志。

---

## 三、未完成 / 规划

- **真实微信能力**：登录目前为 Mock（`auth/dev_login`），支付为 Mock 回调（`payment/mock_notify`）；`AuthService::wechatLogin()`、`PaymentService::buildPayParams()` 已预留真实对接位置，需配置 `WECHAT_APPID/APPSECRET/MCH_ID/MCH_KEY` 并关闭 `DEV_MOCK_LOGIN`。
- **后台占位菜单**：`权限管理`（用户组/用户列表/员工管理/部门管理）与 `插件` 菜单（渠道/营销/会员/行业/工具/超管）仅存在于侧边栏 MENU 配置，**未实现面板**。
- **PRD 规划后续阶段**：秒杀/拼团/团购（V1.1）、分销、多门店/库存调拨/储值（V2.0）、优惠券营销完整闭环、同城配送线上闭环、消息通知、订单打印、物流查询等，详见 PRD 各阶段规划。

---

## 四、关键文件

| 文件/目录 | 说明 |
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
| `PRD_B2C微信小程序商城_V1.0/V2.0.md` | 产品需求文档 |
| `计划/` | 后台各菜单的参考截图（复刻依据） |

---

## 五、运行方式

### 0）准备工具
- **Git**（Windows：Git for Windows）
- **PHP 8.2+**（含 `pdo_sqlite` 扩展，本地开发免装 MySQL）
- **微信开发者工具**（导入小程序端）

### 1）拉代码
```bash
git clone https://github.com/saning18888-hue/wxappshopv1.git wxappshopv1
cd wxappshopv1
git checkout v0.1.94   # 或最新 tag
```
> 远程地址见 `git remote -v`；如需推送，需有仓库写权限（GitHub Token）。

### 2）起后端（SQLite，免装 MySQL）
```bash
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

### 3）跑小程序
微信开发者工具导入 `miniprogram/` 目录（已配 `touristappid`，可无 AppId 预览）。
- `useMock:true`：走本地 Mock，无需后端即可体验。
- 联调真实后端：`useMock:false`，`baseUrl:'http://127.0.0.1:8899/api/v1'`，并在开发者工具「详情 → 本地设置」勾「不校验合法域名」。

### 4）发版流程（强制规范）
改代码 → **在 `CHANGELOG.md` 顶部追加版本记录（最新在上）** → `git commit` → `git tag vX.Y.Z` → 用户确认后 `git push origin master --tags`。

---

## 六、踩坑记录（换机必看）

1. **中文编码规范（强制，否则提交到 GitHub 全是乱码）**：Windows 下 PowerShell 默认 GBK 代码页，会把中文字面量/路径双重编码，导致 commit message、文件名、`.gitignore` 中文规则全部变成 `璁㈠崟...` 之类 mojibake。**硬性要求**：
   - **一切含中文的文本文件（`.md` / `.gitignore` / 代码注释 / 文档）必须保存为 UTF-8 无 BOM**（BOM 会被 git 当字符吞掉，中文 gitignore 规则直接失效）。
   - **禁止 `git commit -m "中文"`**：中文 message 必须先写入 UTF-8 无 BOM 文件，再 `git commit -F 文件.txt`；或提交前 `chcp 65001`；或配置 `i18n.commitEncoding=utf-8` + `i18n.logOutputEncoding=utf-8`。
   - **含中文路径/规则时勿用 PowerShell 管道传参给 git**（编码错乱导致误判，如 `git ls-files | Select-String "计划"` 查不到、`check-ignore` 误报）——用 `git add -A -n`、`git diff-tree --name-status` 等不依赖中文参数的校验方式。
   - **推送前自检**：`git log -1 --pretty=%s` 若显示非中文即乱码；`git show HEAD --name-only` 检查含中文的文件名是否正常。有乱码必须修正后再 push。
2. **CHANGELOG 与 git tag 必须同步**：每次打 tag 都要同步更新 CHANGELOG，否则版本号对不上（曾因 v0.1.49~53 漏记导致顶部版本落后于 tag）。
3. **后台内嵌 JS 语法错误会整页崩**：`admin.html` 的 `<script>` 内嵌全部业务 JS。改动后必须校验：`node -e "new (require('vm').Script)(<script内容>)"`（曾因精简数组残留项导致 `Unexpected token '{'`，登录按钮直接失效）。**改完 JS 强制校验**。
4. **推送选择 checkbox 反复返工教训**：`appearance:none` 自绘方框 + `::after` 对勾易出现"框太大/对勾偏位/截断"，**统一改用原生 checkbox + `accent-color`**（见 `UI设计规范.md` §5.2）。
5. **小程序 require 不支持绝对路径**：必须按目录层级用相对路径（两级 `../../utils/`，三级 `../../../utils/`）。
6. **CartService 表别名**：SQLite 下 `Db::name('carts c')` 会被误解析为表 `carts_c`，必须用 `Db::name('carts')->alias('c')`。
7. **路由完整匹配**：`config/route.php` 需 `'route_complete_match' => true`，否则 `goods` 前缀抢匹配 `goods/:id`。
8. **PHP 内置服务器 + 静态目录冲突**：静态文件目录名不能与应用路由前缀冲突（后台放 `public/admin.html` 而非 `public/admin/`）。
9. **utils/request.js 与 auth.js 循环依赖**：已改为单向依赖（auth→request），request 内 token 直接 `wx.getStorageSync('wxapp_token')`。
10. **端口易混淆**：本机历史曾出现过 8080 / 8787 / 8899 三套端口，PHP 内置服务器重启后端口会变。**排查"登录/接口不通"先确认实际监听端口**：`Get-NetTCPConnection -State Listen | Where LocalPort -in 8080,8787,8899`。
11. **GitHub 凭据**：远程 URL 内嵌 Token（`https://<user>:<token>@github.com/...`）。换新 Token 后 GCM 可能仍发旧凭据报错，用 `git -c credential.helper= push https://<user>:<新token>@github.com/...` 绕过。
12. **`.gitignore` 对已跟踪文件无效**：`计划/` 等目录若已被 `git add` 进仓库，即使写进 `.gitignore` 也不会自动移除。要让某个已跟踪目录/文件"不进 GitHub"，必须 `git rm -r --cached 计划/`（仅从版本控制移除，本地文件保留）+ `.gitignore` 加规则，再提交。新增的目录应从一开始就进 `.gitignore`。

---

## 七、版本记录

> 全部版本更新记录已迁移至 **`CHANGELOG.md`**（最新在上），本文件不再维护版本列表。
