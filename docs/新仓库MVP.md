# 原生小程序商城 · 新仓库 MVP 规划

**版本**：V1.0（MVP）  
**面向**：新建仓库的原生微信小程序商城  
**原则**：复用已跑通的「店铺概况 + 设计装修」底座，MVP 聚焦核心交易闭环

---

## 1. MVP 目标

> **一句话**：用原生小程序跑通「浏览 → 购物车 → 下单 → 支付 → 履约 → 售后」闭环，同时直接复用已跑通的店铺概况与设计装修，作为商城运营底座。

### 1.1 MVP 核心命题

| # | 命题 | 判定标准 |
|---|---|---|
| M1 | 运营可零代码装修首页 | 后台拖拽配置轮播/魔方导航/精选推荐/分类导航/通知/广告位/首页布局/底部导航，发布后小程序即时生效 |
| M2 | 运营可实时掌握店铺概况 | 概况看板今日/本周/本月指标、流量、趋势图数据准确 |
| M3 | 用户可完成完整购物 | 浏览 → 加购 → 下单 → 支付 → 订单 → 售后全链路跑通 |
| M4 | 设计规范全程一致 | 全站使用 Design Token，无硬编码色，换肤只改 token |
| M5 | 本地 → 服务器平滑部署 | SQLite 本地调试通过后，MySQL 服务器一键部署 |

---

## 2. MVP 范围清单（可交付物）

### 2.1 后端接口（ThinkPHP 8）

| 模块 | 接口 | 说明 |
|---|---|---|
| 装修 | `GET /api/v1/home` | 首页 DIY 配置下发（组件 JSON） |
| 装修 | `GET /api/v1/bottom_nav` | 底部导航配置下发 |
| 概况 | `GET /admin/stats/overview` | 概况指标卡 + 流量 + 趋势 |
| 概况 | `GET /admin/stats/trade` | 交易漏斗 |
| 概况 | `GET /admin/stats/goods` | 商品分析 |
| 概况 | `GET /admin/stats/web` | 网站分析 |
| 商品 | `GET /api/v1/goods` `GET /api/v1/goods/:id` | 商品列表 / 详情 |
| 分类 | `GET /api/v1/categories` | 两级分类树 |
| 购物车 | `GET/POST/PUT/DELETE /api/v1/cart*` | 购物车 CRUD |
| 订单 | `POST /api/v1/order/preview` `POST /api/v1/order` | 订单预览 / 创建 |
| 订单 | `GET /api/v1/order` `GET /api/v1/order/:id` | 订单列表 / 详情 |
| 支付 | `POST /api/v1/payment/mock_notify` | Mock 支付回调 |
| 登录 | `POST /api/v1/auth/dev_login` | 开发态 Mock 登录 |
| 会员 | `GET /api/v1/user/info` | 会员资料 |
| 设置 | `GET /api/v1/settings` | 基础设置（含主题色） |

### 2.2 小程序页面（原生 WXML/WXSS/JS）

| 页面 | 路径 | 核心功能 |
|---|---|---|
| 首页 | `pages/index` | DIY 组件渲染（轮播/金刚区/商品组/公告/广告位） |
| 分类 | `pages/category` | 两级分类 + 商品列表 |
| 商品列表 | `pages/goods/list` | 2 列网格卡、筛选排序 |
| 商品详情 | `pages/goods/detail` | 轮播图、SKU 规格、图文详情、评价 |
| 购物车 | `pages/cart` | SKU 数量、批量选择、结算 |
| 确认订单 | `pages/order/confirm` | 地址/配送方式/优惠券/价格明细 |
| 支付结果 | `pages/pay/result` | 成功/失败/待支付 |
| 订单中心 | `pages/order` | 全部/待付款/待发货/待收货/待评价/售后 |
| 会员中心 | `pages/member` | 头像昵称、优惠券、积分、收藏、足迹、地址 |

### 2.3 管理后台（单文件 admin.html）

| 模块 | 面板 | 说明 |
|---|---|---|
| 店铺·概况 | `overviewPanel` | 运营概览（指标卡/流量/趋势）✅ 复用 |
| 店铺·设计装修 | `sectionPanel` | 轮播/魔方导航/精选推荐/分类导航/通知/广告位 ✅ 复用 |
| 店铺·首页布局 | `layoutPanel` | 拖拽排序 + 显隐 ✅ 复用 |
| 店铺·底部导航 | `bottomNavPanel` | 底部菜单配置 ✅ 复用 |
| 商品中心 | `goodsPanel` 等 | 商品/分类/规格/属性 CRUD |
| 订单中心 | `ordersPanel` 等 | 订单列表/详情/发货/退款 |
| 会员中心 | `memberPanel` 等 | 会员列表/分组 |
| 数据看板 | `overviewStatsPanel` 等 | 概况/交易/商品/网站分析 |
| 系统 | `sitePanel` 等 | 站点设置/操作日志/附件设置 |

---

## 3. MVP 迭代计划（6 周）

### Sprint 1（第 1–2 周）：底座复用 + 基建

**目标**：新仓库落地可运行骨架，概况与装修模块直接复用。

- [ ] 初始化新仓库目录结构（`miniprogram/` + `server/` + 文档）
- [ ] 迁移设计 Token（app.wxss 主题色/圆角/阴影变量）
- [ ] 迁移店铺·概况模块（后台 Stats 接口 + 前台面板 + 数据服务）
- [ ] 迁移店铺·设计装修模块（后台 PageService + Design 控制器 + admin.html 装修面板）
- [ ] 迁移小程序首页 DIY 渲染组件（`components/diy-render/`）
- [ ] SQLite 本地跑通：`php think run -p 8899` 起服务，后台可登录并装修
- [ ] 验收 M1（装修发布即时生效） + M2（概况数据准确）

**交付**：可运行的新仓库骨架，店铺概况 + 设计装修完整可用。

---

### Sprint 2（第 3–4 周）：商品 + 交易闭环

**目标**：跑通「浏览 → 购物车 → 下单 → 支付」主链路。

- [ ] 商品模块：SPU/SKU、规格、属性、分类、上下架、库存
- [ ] 商品列表/详情页（图片优先、卡片化、SKU 规格选择）
- [ ] 分类页 + 搜索
- [ ] 购物车（增删改、批量选择、失效商品）
- [ ] 确认订单（地址/配送方式/优惠券/积分/价格明细）
- [ ] 下单 + Mock 支付 + 支付结果页
- [ ] 服务端价格/库存/优惠重算，杜绝前端传值篡改
- [ ] 验收 M3（完整购物闭环）

**交付**：用户可从首页进入商品 → 加购 → 下单 → 支付成功。

---

### Sprint 3（第 5–6 周）：履约 + 会员 + 上线

**目标**：订单履约、售后退款、会员中心，并完成服务器部署。

- [ ] 订单中心（待付款/待发货/待收货/待评价/售后）
- [ ] 后台订单处理（发货、物流单号、退款审核、批量操作）
- [ ] 会员中心（资料、优惠券、积分、收藏、足迹、地址管理）
- [ ] 收货地址管理
- [ ] 数据看板完善（交易/商品/网站分析）
- [ ] 服务器部署：MySQL 5.7 + Nginx 1.22.1 + PHP 8.2.31 + HTTPS
- [ ] 微信开发者平台真机调试
- [ ] 验收 M4（设计一致性）+ M5（平滑部署）

**交付**：MVP 全部完成，服务器正式上线。

---

## 4. MVP 技术清单

### 4.1 前端原生小程序

```
miniprogram/
├── config.js           # useMock 开关 / baseUrl / 主题色
├── app.js              # 启动逻辑、全局设置加载、导航栏动态设色
├── app.json / app.wxss # 全局配置 / 全局样式（Design Token 定义处）
├── utils/
│   ├── request.js      # 封装 wx.request（token、错误处理）
│   ├── auth.js         # 登录态管理
│   └── mock.js         # Mock 数据（useMock 时使用）
├── components/
│   └── diy-render/     # 首页 DIY 组件渲染器（banner/nav_grid/goods_group/...）
└── pages/
    ├── index/          # 首页
    ├── category/       # 分类
    ├── goods/list/     # 商品列表
    ├── goods/detail/   # 商品详情
    ├── cart/           # 购物车
    ├── order/confirm/  # 确认订单
    ├── pay/result/     # 支付结果
    ├── order/          # 订单中心
    └── member/         # 会员中心
```

### 4.2 后端 ThinkPHP 8

```
server/
├── route/app.php           # 路由（/api/v1 与 /admin）
├── config/database.php     # 数据库配置（读 .env）
├── app/
│   ├── common/controller/  # ApiController / AdminController 基类
│   ├── service/            # 业务层（Stats/Page/Goods/Cart/Order/Payment/...）
│   ├── controller/admin/   # 后台接口（Stats/Design/Goods/Order/Member/...）
│   └── controller/api/v1/  # 小程序接口（Home/Goods/Cart/Order/Payment/...）
├── public/admin.html       # 运营后台（单文件 SPA）
├── public/index.php        # 入口
├── database/install.sql    # MySQL 建表脚本
├── database/init_sqlite.php# SQLite 初始化
└── .env / .env.example     # 环境变量
```

### 4.3 部署环境（同现有 README）

| 项 | 值 |
|---|---|
| Web 服务器 | Nginx 1.22.1 |
| PHP | 8.2.31 |
| 数据库 | MySQL 5.7.40 |
| 数据库管理 | phpMyAdmin 5.2 |
| 本地开发 | SQLite（免装 MySQL） |

---

## 5. MVP 风险与缓解

| 风险 | 影响 | 缓解 |
|---|---|---|
| 迁移后装修配置不兼容 | 首页渲染异常 | 保留原 `pages`/`page_versions` 表结构与 JSON schema，前端渲染器直接复用 |
| 设计 Token 硬编码回归 | 换肤失效 | 全部走 `app.wxss` CSS 变量，新增页面严格走 token；后台 UI 规范自检清单 |
| Mock 支付与实际微信差异大 | 上线后支付异常 | 支付回调、验签、幂等逻辑按真实接口结构预留，Mock 只替换网络层 |
| 本地 SQLite 与生产 MySQL 差异 | 上线数据问题 | 两套 schema 保持同步（install.sql 与 init_sqlite.php 同源），部署前跑兼容性测试 |
| 新仓库与旧仓库功能分叉 | 维护成本 | 新仓库为正式演进方向，旧仓库仅作参考；公共能力（装修/概况）以新仓库为准持续迭代 |

---

## 6. MVP 完成定义（DoD）

- [ ] 新仓库目录结构完整，`README.md` 含本地起服 + 服务器部署步骤
- [ ] 店铺·概况（运营概览 + 商城概况/交易/商品/网站分析）在本地与服务器均正常
- [ ] 店铺·设计装修（轮播/魔方导航/精选推荐/分类导航/通知/广告位/首页布局/底部导航）发布后小程序即时生效
- [ ] 原生小程序完整跑通：首页 → 商品 → 购物车 → 下单 → Mock 支付 → 订单 → 售后
- [ ] 设计 Token 已落地 app.wxss，全站无硬编码色值，字号/圆角/阴影符合规范
- [ ] 服务器完成部署（Nginx 1.22.1 + PHP 8.2.31 + MySQL 5.7.40 + HTTPS），真机测试通过
- [ ] `CHANGELOG.md` 记录每次发版，`git tag` 与文档同步

---

## 7. 下一步行动建议

1. **建仓库**：新建 GitHub/CNB 仓库，初始化 `miniprogram/` + `server/` 骨架。
2. **迁移底座**：将现有仓库的概况（Stats 服务 + 面板）与设计装修（PageService + Design 控制器 + 装修面板 + diy-render 组件）整体搬入新仓库，本地跑通。
3. **设计 Token 落地**：先建好 `app.wxss` Design Token 与后台 UI 变量，后续所有页面都基于它开发。
4. **按 Sprint 计划推进**：Sprint 1 底座复用 → Sprint 2 交易闭环 → Sprint 3 履约上线。
