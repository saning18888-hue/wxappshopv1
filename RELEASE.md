# 发版与换机交接日志（RELEASE.md）

> 用途：换机/新同事接手时，照「换机重建指南」即可把环境跑起来。
> **版本更新记录已统一维护于 `CHANGELOG.md`（单一数据源，每次提交 GitHub 前都要更新），本文件不再重复维护版本列表。**

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
- **Windows 下 `git commit -m "中文"` 会双重编码成乱码**：PowerShell 默认 GBK 代码页会先把中文字面量按 GBK 编码传给 git，而 git 存 UTF-8，结果 message 变成 `璁㈠崟...` 之类 mojibake（已踩坑 v0.1.18 初版）。**规范做法**：① 把中文 message 写入 UTF-8 无 BOM 文件后用 `git commit -F 文件.txt`；或 ② 提交前 `chcp 65001` 切 UTF-8 代码页；或 ③ `git config --global i18n.commitEncoding utf-8 && git config --global i18n.logOutputEncoding utf-8`。**推送前自检**：`git log -1 --pretty=%s` 若显示非中文即为乱码，必须 `--amend` 修正后再 push。

---

## 版本记录（已迁移至 CHANGELOG.md）

> 全部版本更新记录已迁移至 **`CHANGELOG.md`**，并在每次提交 GitHub 前更新，**本文件不再重复维护版本列表**，避免「一处更新、多处漏记」。
> 发版流程：**改代码 → 在 `CHANGELOG.md` 顶部追加本次版本记录 → `git commit` → `git tag vX.Y.Z` → `git push --tags`**（中文提交信息用 UTF-8 文件 + `git commit -F`，详见 README「提交规范」）。
