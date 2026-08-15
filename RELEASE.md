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

### v0.1.8 · 2026-08-15 · 补充 B2C 商城 PRD（设计驱动版）
**范围**：仓库文档，无代码改动。

**文档**
- 新增 `PRD_B2C微信小程序商城_V2.0_设计驱动版.md`：B2C 微信小程序商城 V2.0 产品需求文档（设计驱动版）。

### v0.1.7 · 2026-08-15 · 编辑商品富文本编辑器升级
**范围**：运营后台 `server/public/admin.html` 编辑商品弹窗「详情介绍」Tab 的富文本编辑器。

**前端（`server/public/admin.html`）**
- 工具栏重排为分组式，按参考图增加标题（H1-H4/正文）、引用、链接、表格、水平线、表情、代码块、文字颜色、清除格式、撤销/重做、源码模式、全屏等功能按钮。
- 优化工具栏视觉：按钮 26×26、灰底悬停变蓝、分组竖线分隔、编辑区加大内边距与行高。
- 新增编辑器行为：快捷键 Ctrl+B/I/U、选中区保持不丢失、源码/HTML 实时同步、全屏编辑。

### v0.1.6 · 2026-08-15 · 轮播/魔方导航配置行单行化 + 切换间隔步进器
**范围**：运营后台 `server/public/admin.html` 店铺模块「轮播设置」「魔方导航」配置行改为单行内联布局。

**前端（`server/public/admin.html`）**
- 轮播设置顶部配置行改为单行：`切换间隔 [− 数字 +] 秒` · `轮播数量 N 张` · `添加轮播图` 按钮同一行，标签与控件基线对齐。
- 切换间隔改为左右圆角按钮步进器（最小 1 秒），中间输入框仍可手填，`stepInterval(delta)` 负责加减并重渲染。
- 魔方导航顶部配置行同步改为单行：`每行列数 [3 4 5 6]` · `入口数量 N 个`。
- 轮播卡片保持一行三网格（`.banner-grid`），响应式 2 列 / 1 列。

### v0.1.5 · 2026-08-14 · 后台商品编辑弹窗重构（参考商城标准版）
**范围**：运营后台 `server/public/admin.html` 商品管理模块按参考图全面重构编辑/新增弹窗，支持 6 个 Tab 与完整商品字段。

**前端（`server/public/admin.html`）**
- 商品弹窗改为 6 Tab 布局：**基本信息 / 商品规格 / 商品属性 / 详情介绍 / 其他设置 / 分享设置**。
- 基本信息：商品名称/编码/条形码、商品类型（实物/电子卡券/询价）、分类、促销语、单位、市场价/成本价/销售价/利润联动、总库存/虚拟销量/排序、轮播图多图上传（首图主图）、MP4/腾讯视频、视频封面、自动播放、购买须知、备注。
- 商品规格：支持添加规格名与规格值，自动生成 SKU 矩阵，可为每个 SKU 单独设置销售价/市场价/库存/图片。
- 商品属性：属性管理弹窗 + 属性值编辑弹窗，支持勾选使用、上下排序。
- 详情介绍：内置富文本编辑器（加粗/斜体/下划线/删除线/对齐/列表/图片/视频）。
- 其他设置：配送方式（到店自提/同城配送）、重量、显示库存、虚拟销量、排序、最少购买、终身/周期限购、要求留言、订单协议、是否上架。
- 分享设置：分享标题、分享封面（5:4）。
- 交互与样式统一 Linear 浅色风格：Tab 下划线、上传区悬浮删除、单选高亮、开关复选、SKU 表格。

**后端**
- `goods` 表新增 `ext_json` TEXT 字段存扩展字段；规格/规格值表新增 `sort`/`created_at`；新增 `goods_attrs` 表存商品属性。
- `database/install.sqlite.sql` 与迁移脚本 `database/migrate_goods_ext.php` 已同步。
- `app/controller/admin/Goods.php` 新增 `detail` 方法；`save` 方法支持 `ext_json`/`specs`/`skus`/`attrs`。
- `app/service/GoodsService.php` 新增 `adminDetail`、`saveSpecsAndSkus`、`saveAttrs` 完整规格/SKU/属性保存。
- `route/app.php` 新增后台 `GET goods/:id` 路由。

### v0.1.4 · 2026-08-14 · 后台整体 Linear 风格设计
**范围**：运营后台 `server/public/admin.html` 整体采用 Linear 浅色设计语言，与已上线的小程序端（轮播/魔方导航 Linear 风格）视觉统一。

**前端（`server/public/admin.html`，纯 CSS/变量换肤，无逻辑改动）**
- `:root` 设计令牌：主色 `#FF6B35` → 品牌靛蓝 `#5e6ad2`；底色 `#f7f8fa`；描边/文字/阴影切换为 Linear 中性灰阶与精细双层阴影。
- 字体：全局引入并应用 Inter（离线回退系统字体），标题负字距、weight 510/600 精密排版。
- 一级侧边栏：选中态改为实心靛蓝胶囊 + 微阴影；二级侧边栏改为简洁圆角项。
- 卡片/统计/表格/分页：1px 描边 + 细阴影浮起；统计数字等宽对齐；表头浅灰底、行 hover 浅灰；分页选中/hover 靛蓝。
- 按钮：主按钮扁平化 weight 510 + focus 靛蓝光环；取消/危险/描边按钮统一灰系。
- 装修区（工具栏、section 卡片、魔方导航预览、上传区、弹窗）与 demo 占位图配色统一为靛蓝。
- 此前已落地的能力（轮播/魔方导航图片视频上传、配置弹窗、分段控件）与此风格自然一致。

### v0.1.3 · 2026-08-13 · 小程序分类树形展示
**范围**：小程序端子分类由横排网格改为树形排列（多级缩进、可展开折叠）。

**后端**
- `app/controller/api/v1/Category.php::index()`：分类列表改为递归构建完整多级树（`buildTree`），返回含 `children` 的多级嵌套结构（不再仅两级）。

**前端（`miniprogram/pages/category/*`）**
- `category.js`：右侧改为把多级 `children` 按展开状态扁平化为带 `level`/`hasChildren`/`expanded` 的有序数组；左侧切换一级分类或点击箭头时重建；默认全展开。
- `category.wxml`：右侧子分类改为 `.tree-row` 树形缩进列表，有子节点显示可旋转箭头（点箭头展开/折叠），点行跳转商品列表。
- `category.wxss`：移除 `.cate-right-grid` 横排网格样式，新增树形行、箭头、圆点缩进样式。

### v0.1.2 · 2026-08-13 · 商品分类树形折叠与三级限制
**范围**：后台分类列表改为可折叠树形，并限制分类最多三级。

**后端**
- `app/controller/admin/Category.php::index()`：列表返回按根节点分页的深度优先树形数据，每行携带 `level` 与 `has_children`，搜索时保留匹配节点、祖先及后代上下文。
- `Category.php::save()`：新增三级深度校验（根 level=0/一级 level=1/二级 level=2），保存时若 `parentDepth + 1 + subtreeHeight > 2` 则拒绝，确保不超过三级。
- `Category.php::tree()`：返回的分类树节点携带 `level`，便于前端限制可选上级。

**前端（`server/public/admin.html`）**
- 分类列表支持折叠：每行显示展开/收起箭头，默认全部展开；收起时隐藏其下所有子孙节点。
- 分类名称按 `.cat-level-*` 逐级缩进，呈现「一级带着二级、二级带着三级」的阶梯结构。
- 二级分类不再显示「添加子分类」按钮；编辑弹窗中的上级分类下拉只列出顶级和一级分类，编辑时排除当前节点及其子树防止循环选择。
- 分页组件保留：以一级分类数量为基准分页。

### v0.1.1 · 2026-08-13 · 后台商品分类管理
**范围**：补齐「商品 > 商品分类」后台管理，按用户提供的 UI 样式实现列表与表单弹窗。

**后端**
- 扩展 `app/controller/admin/Category.php`：分页列表（关键词筛选）、树形选择 `/categories/tree`、新增/编辑 `/categories`、删除、启用开关 `/categories/:id/status`；编辑时禁止将当前分类及其子分类设为上级。
- 新增 `app/controller/admin/Upload.php`：通用图片上传 `POST /admin/upload/image`，保存到 `public/uploads/categories/`，返回可访问 URL。
- 修复 `app/common/controller/AdminController.php::body()`：改用 `Request::post()` / `Request::getInput()` 解析 JSON body，解决 ThinkPHP 内置服务器下 `file_get_contents('php://input')` 为空导致后台接口读不到参数的问题；同步修复 `app/controller/admin/Auth.php` 登录。
- 数据库：`categories` 表新增 `keywords`、`updated_at` 字段；`database/apply_alter.php` 提供本地 SQLite 幂等迁移脚本。
- 路由：`server/route/app.php` 注册上述后台接口。

**前端（`server/public/admin.html`）**
- 新增「商品 > 商品分类」页面：表格列「分类名称 / ID编号 / 添加时间 / 是否启用 / 操作」，支持关键词筛选、分页、启用开关、添加子分类/编辑/删除。
- 新增分类表单弹窗：分类简称、上级分类树形下拉（含顶级分类）、关键字、排序、图片上传（70*70 建议）。

**已验证**：`admin/login`、`admin/categories`、`admin/categories/tree`、`admin/categories/:id`（PUT/DELETE）、`admin/categories/:id/status`、`admin/upload/image` 均返回 `code:0`；后端开发服务器 `http://127.0.0.1:8787`，后台 `http://127.0.0.1:8787/admin.html`。

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
