### v0.1.114 (2026-09-05) feat: 后台文章编辑弹窗加宽
- 文章编辑弹窗 `#articleModal .modal-card` 宽度由 820px 调整为 1080px（`max-width` 94vw → 95vw），内容编辑器与基础信息两列同步变宽

### v0.1.113 (2026-09-05) feat: 后台平台权限「小程序版权显示」打通前后端
- 后端 `SettingsService` 新增 `copyright_type`（hide/image/text）、`copyright_text`、`copyright_image` 字段，`/api/v1/settings` 自动返回
- 后台「平台管理 → 平台权限」的「确定」由空保存改为真实 `POST /settings` 保存，并新增打开面板时回填、图片上传（base64 内联）、三态显隐切换
- 小程序端「我的」页与首页底部按配置渲染版权（隐藏 / 图片 / 文字），`fetchSettings(true)` 强制刷新即时生效

### v0.1.112 (2026-09-03) fix: 后台相册管理 tab 初始化 + 编辑相册/分类状态被重置
- 修复：进入「相册管理」默认不显示相册列表（需再点一下才显示）——`switchArticleTab` 用全局选择器污染了相册 tab 的 active，已限定到 `#articlePanel`，打开相册面板时自动激活首个 tab
- 修复：编辑相册/相册分类时 `status`（手机端是否显示）被强制重置为「显示」，`Album::save` / `AlbumCategory::save` 编辑模式在前端未传 `status` 时保留原值
- 核对：相册管理（列表/分类/图片上传/设封面/移动到其他相册/重命名/批量删除）前后端链路完整可用

### v0.1.111 (2026-09-02) fix: 文章详情/列表 404 + 后台文章设置分类模式提示与结构修复

**范围**：`miniprogram/pages/article/detail/detail.js`、`miniprogram/pages/article/list/list.js`、`server/public/admin.html`。

- 修复小程序文章详情/列表请求 URL 重复拼接 `/api/v1`(`baseUrl` 已含前缀)导致 404：调用处去掉多余的 `/api/v1` 前缀,路径改为 `/settings`、`/articles/:id`、`/articles?...`。
- 后台文章模块「基础设置」分类模式优化：选中「选择分类」时隐藏「已选文章表格」并显示提示「已选分类 X，保存后自动拉取（最新发布的在前，最多 20 篇）」，切换分类时提示实时刷新；相关容器补 `id="almTable"`、`#almCategoryHint` 以便 JS 显隐。
- 修复后台文章设置 HTML 多塞一个 `</div>` 导致「已选文章表格 / 显示内容」区块溢出到「文章列表 / 文章分类」tab 下方的问题，现已收回到正确的 tab 容器内。

### v0.1.110 (2026-09-02) feat: 文章详情页字段设置 UI 重构（iOS 开关 + 区块标题 + 字段说明）

**范围**：`server/public/admin.html`。

- 文章「基础设置」中「文章标题 / 发布时间 / 浏览量」三项字段展示开关，由文字 pill 单选（radio）改为 iOS 风格 toggle 开关（checkbox 语义），选中态以品牌色轨道 + 滑动 thumb 呈现，点击整行或开关任一位置均可切换，带 0.2s 缓动与 hover/focus 反馈。
- 每项增加图标方块、字段标题与副标题说明（如「在文章详情页顶部显示文章标题」），并新增「详情页字段」区块标题与描述，信息层级更清晰。
- 控件封装为独立 class（`.field-row` / `.switch` 等），不改动其他面板既有的 `.a-seg` 控件。

### v0.1.109 (2026-09-02) feat: 商品评价闭环 + 小程序流量埋点（与后台数据互通）

**范围**：`miniprogram/utils/tracker.js`、`miniprogram/app.js`、`miniprogram/app.json`、`miniprogram/pages/review/*`、`miniprogram/pages/order/detail/*`、`server/app/controller/api/v1/Review.php`、`server/app/controller/api/v1/Track.php`、`server/app/service/ReviewService.php`、`server/app/service/OrderService.php`、`server/route/app.php`。

- 商品评价闭环：新增小程序「发表评价」页面（评分 / 内容 / 传图），订单详情「去评价」可提交评价并写入 `goods_reviews`；后台评论管理（回复 / 隐藏 / 批量删除）实时可见真实评价。
- 流量埋点：新增 `utils/tracker.js` 与后端 `Track` 接口，启动时登记访客会话、用 `wx.onAppRouteDone` 监听路由完成事件自动上报页面曝光与停留时长，后台网站 / 访客 / 商品分析收到真实流量。
- 修复小程序开发者工具启动报错：`app.js` 原全局重写 `Page` 会触发 `appLaunch with non-empty page stack`，改为 `wx.onAppRouteDone` 事件挂载埋点。

### v0.1.108 (2026-09-01) feat: 购物车空状态文案后台可配置

**范围**：`miniprogram/pages/cart/cart.js`、`server/...`（commit 8d9c6a0）。
- 购物车空状态提示文案改为后台可配置。

### v0.1.107 (2026-09-01) feat: 我的页面装修（订单模块）+ 轮播高度设置 + 订单图标预览

**范围**：`miniprogram/pages/member/member.js`、`miniprogram/pages/member/member.wxml`、`server/app/controller/admin/Design.php`、`server/app/controller/api/v1/Design.php`、`server/app/service/PageService.php`、`server/public/admin.html`、`server/route/app.php`、`miniprogram/components/diy-render/diy-render.wxml`、`miniprogram/components/diy-render/diy-render.wxss`、`miniprogram/images/mine/refund.svg`、`server/public/images/mine/*`。

- 新增「我的页面装修」：后台可配置会员中心「我的订单」模块（模块名、右侧名、5 个订单状态的名称/图标/显隐/跳转），小程序我的页 `onShow` 拉取配置即时渲染（关闭的状态不显示、改图标/名称即时生效）。
- 后台订单状态图标新增缩略图预览：每个图标输入框右侧实时显示 36×36 缩略图；同时修复图标 404——前端订单图标改用小程序本地路径（不再经 `asset()` 拼后端域名），并将 5 个订单 svg 与 `refund.svg` 复制到后端 `server/public/images/mine/` 供后台预览加载。
- 轮播图支持后台设置高度（默认 300rpx）：后台「轮播设置」新增「轮播高度」步进输入框并标注当前值；前端 `diy-render` 的 swiper 高度绑定 `c.props.height`，保存发布后首页轮播即时变高/变矮。

### v0.1.106 (2026-09-01) fix: 商品促销语/副标题链路打通 + 后台列表分类名 + 分类页自动刷新

**范围**：`miniprogram/pages/category/category.js`、`server/public/admin.html`、`server/app/service/GoodsService.php`、`CHANGELOG.md`。

- 小程序分类页 `onShow` 在已加载后重新拉取商品列表：此前仅在首次进入时拉一次，后台改促销语/排序后分类页一直显示旧内存数据，看起来「改了没用」；现切回分类页即重新请求，后台改动实时可见。
- 后台商品编辑新增「副标题」输入框（紧邻商品名称下方）：此前表单无副标题字段，且保存时 `subtitle` 被写死为空字符串，导致副标题永远存不进库、列表标题下不显示；现补齐输入框、保存读取该框、编辑回填、清空表单一并处理（后端 `GoodsService` 早已支持 `subtitle` 字段，无需改后端）。
- 后台商品列表分类列显示真实分类名：`GoodsService::adminList` 补充返回 `category_id` + `category_name`（批量查 `categories` 映射），前端 `${g.category_name||'-'}` 渲染不再显示 `-`。
- 商品促销语链路全链路验证打通：后台 `admin/Goods::save` 把 `ext_json.promo` 映射为 `goods.promotion` → `GoodsService::update` 整组落库 → 小程序 `/api/v1/goods` 经 `formatList` 透出 `promotion` → 分类页卡片渲染正常。

**验证**：后台编辑 ID4 牛肉干填副标题保存后列表标题下显示灰字；改促销语 `111111122222` 保存后 `/api/v1/goods` 返回 `promotion` 正确；小程序切到「休闲零食 / 肉脯肉干」可见该商品与促销语；后台列表 ID4 分类列显示「肉脯肉干」（非 `-`）。

### v0.1.105 (2026-08-31) feat: 订单/售后页面联通后端 + 修复编译错误

**范围**：`miniprogram/pages/order/*`、`miniprogram/pages/aftersale/*`、`miniprogram/pages/member/member.js`、`miniprogram/utils/mock.js`、`server/app/controller/api/v1/Order.php`、`server/app/service/OrderService.php`、`server/database/apply_order_refund.php`、`server/route/app.php`、`miniprogram/app.json`。

- 订单列表/详情页、售后申请/列表页联通后端：新增 `miniprogram/pages/order/{list,detail}` 与 `miniprogram/pages/aftersale/{apply,list}` 四个页面及样式，对接 `Order.php` 与 `OrderService.php`。
- `member.js` 会员页联调；`utils/mock.js` 补充下单/售后 mock 数据；`miniprogram/app.json` 登记新页面路由。
- 后端 `OrderService::calcTotals` 扩展，新增 `server/database/apply_order_refund.php` 退款申请表，`server/route/app.php` 补充售后路由。
- 修复若干编译错误，确保小程序通过构建。

### v0.1.104 (2026-08-31) feat: 会员分组端到端互通 + 修复下单金额单位 BUG

- 会员分组打通：后端 `ApiController::formatUser` 返回会员所属分组 id / 名称 / 折扣；前端会员页展示「XX组 / N折」；后台新增 `members/:id/assign_group` 分配接口（`MemberService::assignGroup`）；下单按会员分组折扣算价（`OrderService::calcTotals`）。
- 修复下单确认页金额显示错误：后端 `OrderService::preview / create` 返回金额统一为「分」（原顶层金额被误转成元，前端再除 100 后金额缩水 100 倍，如 29 元变 0.29 元）。

### v0.1.103 (2026-08-29) docs: 合并项目文档为单一来源（README / PRD / 新仓库规划）

- 合并 `RELEASE.md` 与子模块 `miniprogram/README.md`、`server/README.md` 进根 `README.md`（新增「模块说明」章节承载前后端运行说明）。
- 合并 `PRD_B2C微信小程序商城_V1.0.md`（功能需求）与 `PRD_B2C微信小程序商城_V2.0_设计驱动版.md`（设计系统）进 `PRD.md`。
- 合并 `docs/新仓库PRD.md` 与 `docs/新仓库MVP.md` 进 `docs/新仓库规划.md`。
- 删除 7 个旧文档，统一跨文件引用指向新文件；修正历史中文路径删除导致的冗余。

### v0.1.102 (2026-08-29) feat: 会员页新增积分/优惠券/余额数据区

- 「我的」页面新增积分、优惠券、余额三块数据区，与参考设计对齐；底部功能入口区（订单/收藏/足迹/地址等）样式统一。

### v0.1.101 (2026-08-29) fix: 根治后台头像/图片写死域名与会员预览不刷新问题

- 修复 `Upload::image` 写死域名、误存 `categories` 目录的问题（头像改走专用 `/admin/upload/avatar` 接口）。
- 修复会员头像/预览不刷新：用户头像若指向已删测试图会报 404，统一重置为 `/default-avatar.svg`。

### v0.1.100 (2026-08-28) feat: 我的页面 UI 对齐参考设计 + 订单图标重设计

- 「我的」页面恢复系统导航栏标题「个人中心」（白字红底），去掉自定义导航。
- 会员卡改为负 margin 压在红底头部区域，与参考图一致。
- 订单状态图标重设计为圆角方形背景 + 白色图标风格（待付款/待发货/待收货/待评价/退款售后），并加回「退款/售后」入口。

### v0.1.99 (2026-08-28) feat: 设计装修新增分类页/购物车页/我的页面二级菜单

- 后台「设计装修」菜单下新增三个二级菜单：分类页、购物车页、我的页面（暂挂载占位面板，后续功能待定）。
- 图标库 ICONS 新增 `cart`、`user` 两个 SVG 图标，供新菜单使用。

### v0.1.98 (2026-08-28) feat: 购物车重设计 + 实时购物车角标

- 购物车页重做：商品支持勾选/全选、规格标签、数量加减、删除；底部结算栏含全选、合计金额、结算（管理模式下切换为「删除」）。
- 购物车空状态重设计：插画 + 文案 + 「随便逛逛」按钮。
- 全局悬浮按钮上移并缩小圆圈（图标不变），避免遮挡结算栏。
- 悬浮购物车图标新增红色数字角标，实时反映购物车总件数。
- 新增全局购物车数量事件总线（`app.onCartCountChange` / `emitCartCount`）：首页加购、购物车加减/删除均实时同步角标，不再依赖页面刷新。
- 修复接口约定：删除改用 `DELETE /cart/:id`，数量同步复用 `POST /cart`，与 mock 后端一致。

### v0.1.97 (2026-08-28) feat: 分类页顶部新增商品搜索框

- 分类页顶部增加商品名称搜索框，输入后按回车/搜索键跳转 `pages/goods/list/list?keyword=xxx` 查看搜索结果。
- 搜索框采用圆角灰底 + 搜索图标 + 清空按钮，与常见电商分类页保持一致。

### v0.1.96 (2026-08-28) tweak: 分类页交互优化（商品列表 + 加入购物车按钮）

- 分类页：左侧仅保留一级分类菜单，右侧改为展示当前选中分类下的商品列表（点商品进详情）。
- 修复后端 `GoodsService::list` 父分类查询：原按 `category_id` 精确匹配，导致选一级分类时其下二级分类商品查不出来；现改为 `category_id IN (父分类 + 所有子孙分类)`，含 `descendantIds()` 一次性全表 + 栈遍历（含自身、去重、防环）。
- 商品卡片新增「加入购物车」按钮：红色圆形白加号，点击先取商品 SKU、取首个 SKU 调 `POST /cart`，与主站样式统一；销量文案统一为「销量：」。
- 修复 `updateLogisticsType()` 读取 `shopData.logistics_type`（初始值）导致切换 radio 后快递鸟/快递100 表单区域不会实时显示/隐藏的问题（v0.1.95 已发，此处合并记录）。

### v0.1.95 (2026-08-26) feat: 商品设置开关全面接通（销量/促销语/属性/评论），详情页新增促销语·属性·评价区块并补齐演示数据

### v0.1.94 (2026-08-25) fix: 装修「分类导航」来源选择纠正 + 首页布局增加编辑入口

- 修复后台「设计装修 → 分类导航」分类来源数据不一致：装修后台的分类下拉此前来自 `admin.Category/index`（扁平返回全部分类，含子分类），而小程序端 `分类导航` 只渲染顶级分类（`api/v1.Category/index` 仅返回 `parent_id=0` 的分类）。选了子分类时前端因找不到对应项而显示不出。现将该下拉限定为 `parent_id===0` 的顶级分类，与前端展示保持一致。
- 修复小程序端「指定分类」展示顺序：此前按全部分类顺序过滤，与后台勾选顺序不符；现按 `category_ids` 的勾选顺序渲染。
- 后台「首页布局」中「分类导航」模块新增「编辑」按钮，点击直接跳转到「设计装修 → 分类导航」设置（复用 `switchMenu('shop','cat')`）。

### v0.1.93 (2026-08-25) feat: 物流配置对接快递鸟/快递100 即时查询

- 后台「基础设置 → 物流配置」补全两家服务商的接口配置：
  - 快递鸟：用户ID（EBusinessID）、APIKey、接口地址、沙箱环境开关。
  - 快递100：授权码（customer）、APIKey、接口地址。
  - 按「对接类型」单选自动切换显示对应凭证；新增「测试连接」按钮（`POST /admin/logistics/test`）验证凭据与网络可用性。
- 新增 `LogisticsService`：实现两家「即时查询」接口的真实调用与签名：
  - 快递鸟 `RequestType=1002`：`DataSign = urlencode(base64(md5(RequestData + APIKey)))`，`RequestData`/`EBusinessID`/`DataType=2` 表单提交。
  - 快递100 实时查询：`sign = strtoupper(md5(param + customer + key))`，POST `customer/sign/param`。
  - 内置快递公司中文名 → 接口代码映射（顺丰、中通、圆通等常见承运商）。
  - 结果统一归一化为 `company/no/state/state_text/traces`，并按缓存时间（分钟）做文件缓存，降低接口调用频率。
- 新增接口 `GET /api/v1/logistics/track`：支持按 `order_id`（自动取订单的发货公司与运单号、手机号后四位）或 `company/no/phone` 查询。
- 小程序新增「物流追踪」页面（`pages/logistics`），并在「我的」订单项增加「查看物流」入口。

### v0.1.92 (2026-08-25) tweak: 削减商家信息菜单 + 门店位置移至店铺设置 + 修复地图加载

- 移除商品详情页底部「客服」「门店」按钮（`detail.wxml` 的 `detail-actions` 区块及 `onService`、`onOpenMap` 处理函数）。
- 后台「店铺设置 → 商家信息」菜单削减：移除公司名称、英文名、联系人电话、QQ、公司地址、营业时间、货币符号、Logo、内容编辑器、地图位置、分享标题/描述/封面等所有预设，仅保留「门店位置」。
- 「门店位置」（门店名称 / 详细地址 / 经纬度 + 地图选点）从基础设置移至「店铺设置 → 商家信息」，复用 `openStoreMapPicker`。
- `shopDefaults` 同步精简；服务器 `SettingsService` 已包含 `map_lng/lat/address/name` 默认值，保存为合并写入，不会清空其它配置。
- 修复腾讯地图加载地址：将 `https://map.qq.com/api/js?v=2.exp`（旧版 JS API，对应 `qq.maps`）改为 `https://map.qq.com/api/gljs?v=1.exp`（GL JS API，对应 `TMap`），并增加 `TMap.service` 就绪校验。
- 增强地图选点弹窗容错：每次打开时销毁旧实例、捕获初始化异常、6 秒未加载瓦片则提示密钥无效/域名未授权等常见原因，并保留手动填写经纬度的入口。
- 修复地图搜索逻辑：将错误的 `search.search({keyword})` 改为 `search.searchRegion({keyword, cityName})`，支持按城市直接搜索地址，无需拖动地图。
- 地图搜索增加 `servicesk` 参数传入腾讯地图 Secret Key（`map_secret`），解决 WebService API 签名验证失败问题。
- 关闭地图选点弹窗的「点空白处自动关闭」行为，改由右上角 ×、取消、确定按钮关闭，避免选点时误关闭。

### v0.1.91 (2026-08-25) tweak: 移除 cart5 / cart6 / cart8 加购图标

- 后台「基础设置 → 购物车图标」预置项移除「购物车+（cart5）」「购物车→（cart6）」「cart8」。
- `diy-render.js` 的 `CART_ICON_SVGS` 同步删除对应 SVG。
- `SettingsService.php`、`utils/settings.js` 的枚举注释同步更新。
- 保留：无、cart1、cart2、cart3（默认）、cart4（扁平）、cart7、加号、纯加号。

### v0.1.87 (2026-08-25) tweak: 商品卡片加购按钮底色缩小

- `diy-render.wxss` 中 `.diy-goods-cart` 由 48rpx 减至 40rpx；图标保持 28rpx 不变。

### v0.1.90 (2026-08-25) feat: 搜索框占位文字可配置

- 新增设置项 `search_placeholder`（默认「搜索你想要的好物」）。
- 后台「基础设置 → 搜索框配色」新增「搜索框文字」输入框，最多 20 字。
- 小程序 `pages/index` 的搜索框 `placeholder` 改为绑定 `searchPlaceholder`，跟随后台配置。
- 默认值在 `SettingsService.php`、`utils/settings.js`、`index.js` 同步补充。

### v0.1.89 (2026-08-25) tweak: 前三个购物车图标改扁平化、纯加号再加粗

- `diy-render.js` 中 `cart1/cart2/cart3` 由线框改为实心填充扁平化；后台预览同步用 `flat` 类显示为黑色实心。
- `plus2` 描边由 3 加粗到 4。
- 其他图标（cart4~cart8、plus 圆圈加号）保持不变。

### v0.1.88 (2026-08-25) tweak: 购物车图标线条加粗

- `diy-render.js` 中线框图标 `cart1/cart2/cart3` 描边由 1.6 加粗到 2；`plus` 由 1.8 到 2.4；新增的纯加号 `plus2` 由 2 到 3，更醒目。

### v0.1.87 (2026-08-25) feat: 新增纯加号购物车图标

- `diy-render.js` 的 `CART_ICON_SVGS` 新增 `plus2`（只有 `+` 的按钮，无外圈），与原有带圆圈的 `plus` 区分。
- 后台「购物车图标」新增「纯加号」单选项，枚举注释同步更新。

### v0.1.86 (2026-08-25) feat: 新增多个扁平化购物车图标

- `diy-render.js` 的 `CART_ICON_SVGS` 新增扁平购物车图标：`cart5` 加购、`cart6` 结算、`cart7` 实心方体购物车、`cart8` 实心斜体购物车（均为实心填充）。
- 后台「购物车图标」同步替换对应单选项，保持黑色显示，不跟随颜色配置。
- `SettingsService.php`、`utils/settings.js` 枚举注释更新。

### v0.1.85 (2026-08-25) fix: 商品卡片加购图标真正跟随颜色配置

- 根因：小程序用 `<image src="*.svg">` 加载外部 SVG 时，`currentColor` 无法读取父级 `color`，图标始终渲染为黑色。
- 改为在 `diy-render.js` 内嵌各图标 SVG 模板，运行时把颜色替换进去并生成 `data:image/svg+xml` data-uri 作为 `<image>` 的 `src`，使图标颜色随 `cart_icon_color` 实时变化。
- 移除不再使用的 `miniprogram/images/{cart1,cart2,cart3,cart4,plus}.svg`。

### v0.1.84 (2026-08-25) feat: 商品卡片加购图标支持颜色配置

- 后台「基础设置」新增「购物车图标颜色」取色器（`cart_icon_color`），前端通过 `color: {{cartIconColor}}` 控制图标线条/实心颜色，默认红 `#ff4d4f`。
- `SettingsService.php`、`utils/settings.js`、`admin.html` 默认值同步补充 `cart_icon_color: '#ff4d4f'`。

### v0.1.83 (2026-08-25) feat: 商品卡片加购图标支持底色配置与扁平图标

- 后台「购物车图标」新增「扁平购物车」选项（`cart4`），新增 `miniprogram/images/cart4.svg`。
- 删除「减号」选项与对应的 `miniprogram/images/minus.svg`。
- 后台新增「购物车图标底色」取色器（`cart_icon_bg`），前端商品卡片加购按钮背景色实时跟随。
- `SettingsService.php` 与 `utils/settings.js` 默认值同步补充 `cart_icon_bg: '#ffeded'`、`cart_icon: 'cart3'` 选项枚举更新。

### v0.1.82 (2026-08-25) fix: 接通后台「购物车图标」设置到前端商品卡片加购按钮

- 后台「基础设置 → 购物车图标」单选（无 / cart1 / cart2 / cart3 / 加号 / 减号）此前未生效：前端 `diy-render` 写死使用 `/images/cart.svg`，改后端不联动。
- 新增预设图标文件 `miniprogram/images/{cart1,cart2,cart3,plus,minus}.svg`，与后台预览一致。
- `diy-render` 组件读取 `cart_icon` 设置映射图标；选「无」时隐藏加购按钮。
- `SettingsService` 与 `utils/settings.js` 默认值补充 `cart_icon: 'cart3'`。

> 说明：「强制授权（会员信息 / 手机号）」与「购物车图标」是后台基础设置里的不同配置项，本次仅修复购物车图标的前端联动；会员信息/手机号授权为另一套逻辑（如需同步排查请告知）。

### v0.1.81 (2026-08-24) feat: 全局悬浮按钮抽为组件且支持单独设置图标

- 新增 `components/float-buttons` 组件，统一管理「购物车 / 返回首页 / 客服」三个悬浮按钮，所有页面（`index/category/goods/list/detail/cart/order/confirm/pay/result/member/webview`）均已引入，样式与交互一致。
- 后台「基础设置 → 悬浮按钮图标」新增三个独立上传项：购物车图标 `float_cart_icon`、首页图标 `float_home_icon`、客服图标 `float_service_icon`；留空则使用默认 SVG 图标。
- `SettingsService` 与 `utils/settings.js` 默认值新增 `float_cart_icon` / `float_home_icon` / `float_service_icon`。
- 客服按钮仍受「客服按钮」开关与「客服类型」配置控制；购物车/首页按钮默认常显。
- 修复商品卡片高度不一致：标题固定两行高度、价格/购物车行通过 `margin-top: auto` 吸附到底部，同一行卡片对齐。

### v0.1.80 (2026-08-24) feat: 客服类型支持四种模式并补齐后台配置

- 后台「基础设置 → 客服类型」新增按类型条件显示配置区：微信小程序客服（无需配置）、商家电话（service_phone）、微信客服（wechat_corpid + wechat_url）、第三方客服（third_party_url）。
- 小程序端点击客服按钮按类型分支：商家电话走 `wx.makePhoneCall`；微信客服走 `wx.openCustomerServiceChat`，未配置时回退复制微信号；第三方客服通过 `pages/webview/webview` 以 web-view 打开 H5 地址。
- 新增 `pages/webview/webview` 页面（app.json 注册）。
- SettingsService 新增 `wechat_corpid` / `wechat_url` / `third_party_url` 默认值。
- 修复自定义 tabBar 遮挡首页客服按钮：`.cs-fab` 抬到 tabBar 上方（`bottom: calc(120rpx + env(safe-area-inset-bottom))`，z-index 600）。

**注意**：微信客服需已开通企业微信「微信客服」并绑定；第三方客服 H5 地址需在小程序后台配置业务域名。

### v0.1.79 (2026-08-24) feat: 站点关闭支持在后台自定义闭店提示文案

- 后台「基础设置 → 站点状态」选择“关闭”后，右侧显示闭店文案输入框，可自定义小程序首页的打烊提示文字。
- 输入框在“开启”时禁用置灰，避免误编辑。

### v0.1.78 (2026-08-24) feat: 底部导航支持自定义 tabBar 与后台独立配色（文字/选中/背景/边框色）

**范围**：`miniprogram/custom-tab-bar/*`、`miniprogram/app.json`、`server/app/controller/api/v1/Design.php`、`server/app/service/SettingsService.php`、`server/public/admin.html`、`miniprogram/utils/settings.js`、`miniprogram/pages/*`（index/category/cart/member）、`CHANGELOG.md`、`miniprogram/images/tab/*`、`server/public/uploads/categories/20260824/*`。

**改动**：
- 新增自定义 tabBar（`custom-tab-bar/index.js` + `index.wxml/wxss/json`），通过 `app.json` 设置 `tabBar.custom: true` 接管原生底部导航，使文字颜色可在运行期动态变更（原生 tabBar 颜色写死后无法运行期修改）。
- `Design.php` 新增 `bottom_nav` 接口，返回导航项列表与样式（text_color / selected_color / bg_color / border_color）。
- `SettingsService.php` 新增底部导航配置默认值（`setting_key = bottom_nav`），含菜单项与配色。
- 后台「店铺 → 装修设计 → 底部导航」新增「样式」Tab，可单独设置导航栏文字颜色、选中文字颜色、背景颜色、顶部边框颜色，保存草稿/发布后小程序端即时生效。
- 自定义 tabBar 内改用 `wx.request` 直接拉取 `/api/v1/bottom_nav`，修复此前 `require('../../utils/request')` 在自定义 tabBar 上下文解析失败导致的「can not find module」编译错误。
- 重制底部导航图标为透明背景 81×81 PNG（home/category/cart/mine 的 normal/active 各一份），修复不透明白底遮挡文字的问题。
- 各 tab 页补充分页栏主题色跟随，样式 Tab 配色表单对齐后台基础设置风格。

**验证**：清缓存重新编译后，底部导航正常显示图标与文字；后台改配色并发布后小程序即时生效。

### v0.1.77 (2026-08-24) fix: diy 商品组价格改为红色，标题/价格底部对齐布局

**范围**：`miniprogram/components/diy-render/diy-render.wxml`、`miniprogram/components/diy-render/diy-render.wxss`。

**改动**：
- 商品组价格颜色由 `var(--primary)` 改为红色 `#FF4D4F`。
- 商品卡片改为 `flex-direction: column`，标题与价格包进 `.diy-goods-info`（`flex:1` + `justify-content: space-between`），修复「标题一行时价格跟在标题下方、未贴底对齐」的布局问题，无论标题 1 行或 2 行价格都固定在卡片底部。

### v0.1.76 (2026-08-23) fix: 修复主题色后台保存无效 + 小程序全页/导航栏/tabBar 主题色统一生效

**范围**：`server/public/admin.html`、`miniprogram/utils/settings.js`、`miniprogram/components/diy-render/*`、`miniprogram/pages/category/*`、`miniprogram/utils/mock.js`、`CHANGELOG.md`。

**改动**：
- 后台基础设置「主题色」保存无效根因：①`saveSettings()` 遍历收集表单时 `payWechat/payAlipay` 元素不存在导致 JS 抛错中断；②`fetchA` 仅在 body 为 object 时设置 `Content-Type: application/json`，而原 `saveSettings`/`saveDeliveryBatch` 传入的是 `JSON.stringify` 字符串，后端 `Request::post('config/a')` 解析为空数组，颜色从未写入库。现修复空指针与 body 传参（传 object 由 `fetchA` 统一序列化），hex 文本框重复 `data-setting="theme_color"` 也一并移除。
- 小程序端 diy-render 组件 3 处硬编码 `#5e6ad2` 与轮播指示器色改为 `var(--primary)`，跟随主题色。
- 分类页补齐主题色支持（`category.js` 拉取 `themeColor`、`category.wxml` 绑定 `--primary`、`category.wxss` 补齐 `.cate-left` 样式并选中态用 `var(--primary)`）。
- `settings.js`：`fetchSettings` 成功后自动调用 `getApp().applyThemeToNative(theme_color)`，每个页面（onShow）拉取设置时同步原生导航栏背景色与 tabBar 选中色，修复「仅首页生效、其他页面导航栏仍是 app.json 写死的橙色」问题。
- `mock.js` 补 `/settings` 兜底接口。

**验证**：后台改主题色保存后，`/admin/settings` 与 `/api/v1/settings` 均返回新值；小程序各页 onShow 拉取后导航栏/tabBar/页内主色统一跟随。

### v0.1.75 (2026-08-23) fix: 修复主题色设置保存后小程序刷新仍显示默认橙色的根因（设置模块级缓存不失效）

**范围**：`miniprogram/utils/settings.js`、`miniprogram/app.js`、`miniprogram/pages/*`（index/cart/member/goods/list/goods/detail/order/confirm/pay/result）、`CHANGELOG.md`。

**改动**：
- **根因**：`settings.js` 存在模块级缓存 `cache`，`fetchSettings()` 默认不强制刷新，首次成功后所有调用（含页面 onShow 刷新、app onLaunch）都直接命中缓存，后台修改的主题色永远无法被小程序重新读取；且原生导航栏配色只在 `onLaunch` 执行一次，热刷新/切回前台不会更新。
- `settings.js`：保留并发合并（`fetching`），明确 `fetchSettings(force)` 在 `force=true` 时绕过模块级缓存强制重新请求，保证后台修改能及时读回。
- `app.js`：新增 `applyThemeToNative()`（封装 `wx.setNavigationBarColor` / `wx.setTabBarStyle`）与 `refreshSettings()`；`onLaunch` 与从后台切回前台的 `onShow` 均强制重新拉取设置并重新应用原生导航栏/底部导航主题色，不再只写死 onLaunch 一次。
- 各页面：主题色/基础设置读取全部改为 `fetchSettings(true)` 强制刷新；`goods/list`、`goods/detail` 等页面将主题色应用从 `onLoad` 移到 `onShow`，确保每次进入页面都拿到最新设置。

**回归验证**（供用户 Hello World 在微信开发者工具验证）：
1. 启动后端（`php think run -H 127.0.0.1 -p 8899`），`config.js` 中 `useMock:false`。
2. 打开小程序，确认首页/各页主题色为默认橙 `#FF6B35`。
3. 进入后台「基础设置 → 主题色」，改为绿色（如 `#00B86B`）并保存，确认提示「已保存」。
4. 切回小程序，将小程序切后台再切回（或重新进入页面）触发 `onShow` 强制刷新，确认：
   - 顶部原生导航栏背景变为绿色；
   - 首页/分类/购物车/我的等页面主题色（主按钮、价格、选中态）均变为绿色，不再回退橙色。
5. 验证通过标准：后台修改主题色后，小程序无需重启/重新编译，切回前台即显示新主题色。

### v0.1.74 (2026-08-23) docs: 新增新仓库 PRD 与 MVP 规划文档（用于新仓库原生小程序开发）

**范围**：`docs/新仓库PRD.md`、`docs/新仓库MVP.md`。

**改动**：
- 新增 `docs/新仓库PRD.md`：面向新仓库的原生小程序商城产品需求文档，沉淀已跑通的店铺概况 + 设计装修为 MVP 底座，传承 UI 设计规范（Design Token/字号/圆角/红线），明确后端架构与部署环境（Nginx 1.22.1 + PHP 8.2.31 + MySQL 5.7.40）。
- 新增 `docs/新仓库MVP.md`：新仓库 MVP 规划，含 3 个 Sprint 迭代计划（底座复用 → 交易闭环 → 履约上线）、技术清单、风险与完成定义（DoD）。

### v0.1.73 (2026-08-22) feat: 修复主题色不生效 + 基础设置精简（删除安全/平台账号/网址统一/商家助手等）

**范围**：`server/public/admin.html`、`miniprogram/app.js`、`miniprogram/pages/*`（index/cart/member/goods/list/goods/detail/order/confirm/pay/result）、`CHANGELOG.md`。

**改动**：
- 修复「修改小程序主题色保存后不生效、仍为橙色」：各页面主题色改为异步 `fetchSettings()` 后再应用，消除首屏因设置未加载完成的竞态；并在 `app.js` 同步原生顶部导航栏背景色（`wx.setNavigationBarColor`），不再写死橙色。
- 基础设置菜单精简：删除「平台账号」「网址统一」两项；「安全设置」标签页及内容删除。
- 客服按钮改为「开启 / 关闭」（删除「统一设置」「分端设置」）。
- 客服类型删除「商家助手」。
- 强制授权删除「暂不支持H5和公众号端」提示文案。
- 优化购物车图标：更新 SVG 为更圆润精致的购物车样式（默认 cart3 同步优化）。

### v0.1.70 (2026-08-22) feat: 全站删除确认统一为自定义弹窗并写入设计规范
### v0.1.69 (2026-08-22) fix: 公告图标字段重设计（双图标/URL 文本修复 + 三字段对齐）
### v0.1.68 (2026-08-22) feat: 广告位跳转链接 + 公告图标上传 + 布局删除按钮
### v0.1.67 (2026-08-22) feat: 广告位模块 + 设计装修折叠按钮修复
### v0.1.66 (2026-08-22) feat: 设计装修菜单（通知公告模块 + 折叠/高度修复）
### v0.1.65 (2026-08-22) ui: redesign overview dashboard to match screenshot (5 metrics, tabs, table, chart)

# 更新日志 CHANGELOG

> **本文件是仓库唯一的版本更新记录源，最新版本在最上方。**
>
> **维护约定（强制，每次提交 GitHub 前都要做）**：
> 1. 每次发版 / 重大更新提交到 GitHub 前，必须在本文件**最顶部**追加一条本次版本记录（最新在上）。
> 2. 版本号规则：以 `v0.1.17`（基础设置 Linear）为锚，其后的补丁序列为 `v0.1.17.1`～`v0.1.17.5`；订单管理后台增强独立跃升为 `v0.1.18`（用户确认的唯一正式版）；`v0.1.18.1` 为收尾文档版（仅 CHANGELOG/README/RELEASE 规范，**冻结**，不再续 `v0.1.18.2`）。**下一次发版从 `v0.1.19` 开始**（不再使用 `v0.1.18.x` 补丁序列）。所有号须与 `git tag` 一致。
> 3. 提交信息使用英文，或 UTF-8 无 BOM 文件 + `git commit -F`（**禁止 `git commit -m "中文"`**，Windows GBK 会双重编码成乱码，详见 README「提交规范」与 RELEASE.md「关键坑」）。
> 4. 环境/换机说明见 `RELEASE.md`；本文件只记「改了什么」。
> 5. 推送：记录写完并 commit 后，`git push origin master --tags`。

---

### v0.1.72 (2026-08-22) fix: SQLite 首装建表不完整 + goods 表缺 updated_at 导致后台商品管理 500

**范围**：`server/database/install.sqlite.sql`、`server/database/install.sql`、`server/database/apply_goods_attr.php`、`CHANGELOG.md`。

**改动**：
- 修复「商品增/改/删全部 500（数据表字段不存在:[updated_at]）」：`goods` 主表原本没有 `updated_at` 列，而 `app/controller/admin/Goods.php`、`app/service/GoodsService.php` 均在写该字段。现于 `install.sqlite.sql`（SQLite）与 `install.sql`（MySQL）的 `goods` 建表补上 `updated_at`，并在 `apply_goods_attr.php` 增加幂等迁移 `goods.updated_at`，存量库执行该脚本即可补齐。
- 修复「按 README 快速开始只跑 `php database/init_sqlite.php` 后，后台文章/相册/跳转小程序/操作日志/短信等页面 500（no such table）」：这些表原先分散在 `apply_*.php` 且不会自动执行。现把缺失的扩展表（`article_categories`、`articles`、`album_categories`、`albums`、`album_images`、`mini_apps`、`operation_logs`、`sms_contacts`、`sms_send_logs`）及演示种子数据并入 `install.sqlite.sql`，首装即完整；同步在 `install.sql`（MySQL）补齐对应建表，保证生产 MySQL 首装可用。

**验证**：删除 `database/wxappb2c.sqlite` 后重跑 `init_sqlite.php`（87 条 SQL），`goods` 含 `updated_at`；后台商品新增/编辑/删除接口均返回 200；文章、相册、跳转小程序、操作日志、短信联系人/发送日志等页面均返回 200 且带数据；全部 `apply_*.php` 幂等可重跑。

---

### v0.1.71 (2026-08-22) feat: 精选推荐/广告位列数可选 + 修复商品添加不显示

**范围**：`server/public/admin.html`、`miniprogram/config.js`、`.gitignore`、`CHANGELOG.md`。

**改动**：
- 精选推荐（goods_group）与广告位（banner）模块新增「每行数量」选择：可选 1 / 2 / 3 列，编辑弹窗内即时切换，小程序端按 `columns` 渲染对应列数。
- 修复「精选好物」等 v0.1.10 时代旧结构 goods_group（无 `modules` 字段、仅 `source/category_id/show_count`）添加商品不显示的问题：`normalizeHomeComponents()` 新增老结构归一化分支，自动转换为 `modules:[{id,name,title,goods:[]}]` 并清理旧字段；`openModEditor()` 增加兜底，进入编辑时当场补全 `modules`，保证 `curMod()` 不再返回 undefined、`confirmGoodsPicker()` 能正确写入商品。
- 修复小程序端 `config.js` 端口历史遗留问题：`baseUrl` 由旧 `127.0.0.1:8787` 改为项目统一端口 `127.0.0.1:8899`，注释同步更新，解决小程序请求 `ERR_CONNECTION_REFUSED`。
- `.gitignore` 补充忽略 Playwright 调试产物、开发服务器日志与临时上传图。

**验证**：node 全量编译 admin.html 内嵌 script 通过；Playwright 实测「精选好物」编辑→选 4 商品→确认，`m.goods` 正确写入 4 件且 `modEditGoods` 渲染 4 个商品卡片；小程序各接口（settings/home/bottom_nav/goods/categories）在 8899 端口均返回 200。

---

### v0.1.70 (2026-08-22) feat: 全站删除确认统一为自定义弹窗并写入设计规范

**范围**：`server/public/admin.html`、`UI设计规范.md`、`README.md`、`CHANGELOG.md`。

**改动**：
- 全站 5 处删除确认框由原生 `confirm()` 统一改为 `await confirmDialog()` 自定义弹窗：平台应用删除、首页布局删除首页模块、设计装修广告位删除、短信模板删除、短信联系人删除。
- 弹窗视觉统一为参考图规范：居中圆形「!」图标 +「提示」标题 + 内容文案（删除对象名用「」包裹）+ 底部「取消（`.btn.gray`）/ 确定（`.btn.primary`）」双按钮。
- `UI设计规范.md` 新增 §5.3「删除确认弹窗」：强制使用 `confirmDialog()`、禁止原生 `confirm()`，固定 DOM（`#commonConfirmModal` / `.confirm-icon` / `.confirm-title` / `.confirm-msg` / `.confirm-foot`）与按钮样式，并列出当前覆盖范围。

**验证**：node 全量编译 admin.html 内嵌 script 通过；全文检索 `confirm('` 为 0；后台各删除入口弹出统一自定义确认框。

---

### v0.1.69 (2026-08-22) fix: 公告图标字段重设计（双图标/URL 文本修复 + 三字段对齐）

**范围**：`server/public/admin.html`、`CHANGELOG.md`、`README.md`。

**改动**：
- 修复通知公告「图标」字段同时显示两个图标的问题：改为单一预览框（图标为图片地址时显示图片，否则显示 emoji/文字）。
- 修复上传图标后预览区把整条图片 URL 文本渲染出来的问题：上传后预览框显示图片本身，输入框不再显示 URL。
- 图标字段布局改为与「背景色 / 文字色」一致的纵向结构（label 在上、控件在下），三列水平对齐。
- 增加「恢复默认」按钮，可一键回到默认 📢 图标。

**验证**：后台「设计装修 → 通知公告」图标区只显示一个预览；上传图片后显示图片而非网址；背景色/文字色/图标三字段标签水平对齐；恢复默认回到 📢。

---

### v0.1.68 (2026-08-22) feat: 广告位跳转链接 + 公告图标上传 + 布局删除按钮

**范围**：`server/public/admin.html`、`miniprogram/components/diy-render/*`、`CHANGELOG.md`、`README.md`。

**改动**：
- 通知公告图标支持自定义：可输入 emoji/文字，也可上传图片；小程序端按图片地址自动切换为图片展示（默认 📢）。
- 首页布局「＋ 添加广告位」自动编号（广告位 1、广告位 2…）。
- 修复首页布局广告位编辑弹窗打不开的问题（`openModEditor` 中 const 重赋值导致的 TypeError）。
- 广告位每张广告图支持设置跳转类型（不跳转/商品/分类/活动）与跳转 ID，小程序端点击广告图按链接跳转。
- 统一广告位数据模型（`banners` 统一存放于 `props.banners`）：首页布局添加的广告位与「设计装修 → 广告位」编辑同一份数据；小程序端兼容旧 `modules[0].banners` 结构。
- 首页布局每个模块行新增「删除」按钮，可删除任意首页模块；推荐模块列表同步支持广告位展示与删除。

**验证**：后台首页布局可添加/编辑/删除推荐模块与广告位；广告位可上传图片并设置跳转；通知公告可上传/输入图标；小程序端首页按配置展示。

---

### v0.1.67 (2026-08-22) feat: 广告位（banner）模块 + 设计装修折叠按钮修复

**范围**：`server/public/admin.html`、`miniprogram/components/diy-render/*`、`CHANGELOG.md`、`README.md`。

**改动**：
- 新增「广告位（banner）」模块：设计装修菜单新增「广告位」，可添加/编辑/删除/排序多个广告位，每个广告位可设置名称（便于后台识别）、图片、跳转链接。
- 首页装修可像「精选推荐」一样调用广告位模块，自由插入到首页任意位置。
- 修复设计装修分组（如「设计装修」本身）折叠按钮无效：子菜单展开状态改为只听从 `expanded` 集合，不再因子项被选中而被强制展开；点击子项自动展开父级路径。
- 补充通知公告菜单缺失的 `bell` 图标，并给一级菜单图标加 `undefined` 兜底。

**验证**：管理后台「设计装修 → 广告位」可正常增删改与排序；首页装修可调用广告位模块；设计装修分组折叠/展开按钮恢复正常。

---

### v0.1.66 (2026-08-22) feat: 设计装修菜单 — 通知公告模块 + 折叠/高度修复

**范围**：`server/public/admin.html`、`miniprogram/components/diy-render/*`、`miniprogram/utils/mock.js`、`CHANGELOG.md`、`README.md`。

**改动**：
- 店铺菜单「我的模板」重命名为「设计装修」。
- 设计装修新增「通知公告」模块：可发布多条文字公告，样式支持「固定」「从右往左划入」「自上而下滚动」三种。
- 修复二级子菜单高度被 `max-height:200px` 锁死、设计装修分组下「底部导航」等子项文字显示不全的问题（放宽至 1000px）。
- 修复设计装修分组项折叠按钮无效的问题：点击分组项可切换展开/收起。
- DIY 渲染组件（diy-render）补充通知公告等模块的前端渲染。
- 数据修正：将库内旧的 `127.0.0.1:8080` 轮播图地址批量替换为 `127.0.0.1:8787`。

**验证**：管理后台点击「设计装修」可正常展开/收起，全部子项文字完整显示；首页装修可添加并预览通知公告。

---

### v0.1.65 (2026-08-22) ui: redesign overview dashboard to match screenshot
### v0.1.63 · 2026-08-22 · 后台内页宽度统一：统一撑满内容区

**范围**：`server/public/admin.html`、`CHANGELOG.md`。

**背景**：用户反馈后台各内页宽度不统一，有的页面被限制得较窄。

**改动**：
- 统一移除页面级最大宽度限制：`.plugins-panel`（原 1200px）、`.plugin-config-panel`（原 1200px）、`.bn-editor`（原 880px）的 `max-width`。
- 所有内页现在统一撑满 `.content` 内容区，避免 880px 这种窄页带来的右侧留白，同时让大屏下插件中心、插件配置等页面也随内容区自然展开。
- 弹窗、表单输入、富文本编辑器、小表格等组件级 `max-width` 保持不变，避免表单控件过度拉伸。

**验证**：本地浏览器验证底部导航编辑器与插件中心面板均已撑满内容区，布局无错位。

---

### v0.1.62 · 2026-08-22 · 平台管理应用列表：操作列增加删除功能

**范围**：`server/public/admin.html`、`CHANGELOG.md`。

**背景**：用户反馈平台管理「应用管理」Tab 的表格操作列中缺少删除功能。

**改动**：
- 在应用表格的操作列追加红色「删除」链接。
- 新增 `deletePlatformApp(id, event)` 函数，点击后弹出 `confirm` 确认框，确认后从 `PLATFORM_APPS` 数组中移除对应记录，刷新表格与分页，并 toast 提示删除结果。
- 与现有「上传设置」「接口授权码」两个操作链接保持同一视觉层级，使用已有的 `.link.danger` 红色样式。

**验证**：本地浏览器验证，操作列已显示「删除」入口，点击可正常删除并刷新表格。

---

### v0.1.61 · 2026-08-22 · 插件中心：超管「平台管理」页面（6 Tab 复刻）

**范围**：`server/public/admin.html`、`CHANGELOG.md`。

**背景**：用户提供了插件菜单下「超管」分类中「平台管理」的两张设计参考图（平台权限 Tab、应用管理 Tab），要求复刻。

**改动**：
- 新增 `#platformManagePanel` 插件配置面板，包含 6 个 Tab：平台权限、应用管理、微信模板库、快手模板库、分销设置、分账设置；后 4 个 Tab 暂为「功能开发中」占位。
- 平台权限 Tab：复刻「小程序版权显示」单选（隐藏 / 图片 / 文字）、「小程序版权」输入框及蓝色「确定」按钮；选中「隐藏」时自动隐藏版权输入框。
- 应用管理 Tab：复刻「批量修改上传设置」按钮、右上角搜索框、应用数据表格（ID / 账号 / 应用名称 / 统一版权 / 插件显示 / 过期时间 / 接口授权码 / 创建时间 / 操作）、底部分页；表格开关可交互，支持全选、翻页、每页条数切换、关键词搜索。
- 为插件中心「超管」分类调整数据：仅「平台管理」可点击进入配置页，其余超管插件锁定。
- 调整 `backToPlugins()`，使其隐藏所有 `.plugin-config-panel` 类型的面板，兼容微信小程序和平台管理两个配置页。
- 新增 `.app-toolbar`、`.table-pagination` 及 `#platformAppTable` 表格样式，确保应用管理表格不挤扁、不换行，内容超出时横向滚动。

**验证**：本地 PHP 内置服务器（8899）启动后，进入「插件 → 超管 → 平台管理」，平台权限 Tab 和应用管理 Tab 的视觉效果与交互均符合设计参考图。

---

### v0.1.60 · 2026-08-22 · 微信小程序配置页修复：空白布局 + 输入框原生样式

**范围**：`server/public/admin.html`、`CHANGELOG.md`。

**背景**：用户反馈微信小程序配置页存在两处问题——① 进入配置页后顶部出现大片空白，内容被挤到下方；② 部分输入框（页面路径「关键词搜索」、订阅消息「模板 ID」）呈现浏览器原生丑样式，不符合设计规范中「输入框统一用 `.input` 类」的要求。

**改动**：
- 修复顶部空白：`wechatMiniProgramPanel` 在 DOM 中位于 `.content` 闭合标签之外（挂在 `main` 下），`onPluginClick` 进入配置页时若该面板不在 `.content` 容器内，则自动 `appendChild` 移入，使其正常显示在内容区顶部。
- 新增全局 `.input` / `.input.sm` / `.input.lg` 基础样式（白底 + 边框 + 圆角 + padding + focus 态主色阴影），与既有 `.form-input` 规范一致，消除各面板里 Fallback 的原生输入框。
- 订阅消息模板 ID 输入框移除 `placeholder="模板ID"`，避免空值时重复显示占位文字。
- 面板切换（菜单 / 插件详情 / 返回）统一调用 `resetContentScroll()`，复位 `.content` 内部滚动位置。

**验证**：本地 PHP 内置服务器（8899）启动后，进入「插件 → 渠道 → 微信小程序」，配置页顶部空白消失，关键词搜索框与订阅消息输入框均呈现统一规范样式。

---

### v0.1.59 · 2026-08-21 · 插件中心：渠道「微信小程序」配置页（6 Tab 复刻）
**范围**：`server/public/admin.html`。

**背景**：用户提供了渠道菜单下「微信小程序」的 7 张参考图及「订阅消息所有文字.txt」「页面路径所有.txt」，要求复刻配置界面。
**改动**：
- 在 `pluginsPanel` 基础上新增 `wechatMiniProgramPanel` 配置面板；渠道插件卡片中「微信小程序」设置为可点击进入，其余渠道插件标记为锁定。
- 顶部标题区：标题 + 描述 +「微信小程序官方文档」外链，左上角「返回」按钮可回到插件列表。
- 6 个 Tab：工具发布、基础设置、支付配置、退款证书、页面路径、订阅消息。
- **工具发布**：版本号输入、版本描述多行文本、提交按钮。
- **基础设置**：小程序名称 / APPID / APP_SECRET 三个必填输入框 + 确定按钮。
- **支付配置**：微信支付商户号 / 密钥 V2 / 密钥 V3、验签方式单选（平台证书 / 微信支付公钥 / 商户 API 证书 + 微信支付公钥）、平台证书序列号、订单优惠标记对照表。
- **退款证书**：证书说明文案、是否打开分段控件、两个 `.pem` 文件上传、「已配置」链接、确定按钮。
- **页面路径**：关键词搜索 + 列表/卡片视图切换按钮 + 数据表格；完整导入 `页面路径所有.txt` 中的 72 条路径数据，支持复制链接。
- **订阅消息**：一键配置按钮 + 数据表格；完整导入 `订阅消息所有文字.txt` 中的 10 条模板数据，含启用开关、模板 ID 输入、单条一键配置。
- 样式遵循 `UI设计规范.md`：表单输入框 hover/focus 态、分段控件、原生 radio/checkbox + `accent-color`、表格圆角边框、主题变量。
- 本地 Chrome 截图验证 6 个 Tab 与参考图一致。

---

### v0.1.58 · 2026-08-21 · 新增「插件中心」菜单页（工具/会员/行业/营销/渠道/超管）
**范围**：`server/public/admin.html`。

**背景**：用户提供了插件菜单下「工具、会员、行业、营销」四个页面的参考设计图，要求复刻为后台可视页面。
**改动**：
- 新增 `pluginsPanel` 插件中心面板，左侧二级导航（全部 / 渠道 / 营销 / 会员 / 行业 / 工具 / 超管）联动右侧内容。
- 卡片采用 5 列响应式网格（大屏 5 列，中屏 4 列，小屏依次递减）。
- 各分类主题色：工具蓝 `#3b82f6`、会员金 `#f59e0b`、行业绿 `#22c55e`、营销红 `#ef4444`、渠道紫 `#7c3aed`、超管蓝灰 `#64748b`。
- 锁定插件显示灰色卡片 + 右侧锁图标并禁用 hover 动效；解锁插件点击给出轻提示。
- 按参考图补齐工具、会员、行业、营销四类插件数据，渠道/超管按常见功能补全（含锁定状态标记）。
- 复用项目既有内联 SVG 图标体系，新增 `PLUGINS` 数据与 `renderPlugins()` 渲染函数，菜单点击 `switchMenu('plugins','<分类>')` 即渲染。
- 本地 Chrome 截图验证四类页面布局、配色、锁定态与参考图一致。

---

### v0.1.56 · 2026-08-21 · 计划/ 目录移出版本库 + 中文编码规范强化
**范围**：`.gitignore`、`RELEASE.md`、`CHANGELOG.md`、`计划/`（从 git 移除，本地保留）。

**背景**：用户要求「计划文件夹里的所有文件都不进 GitHub」；同时发现 Windows 下中文编码坑导致 `计划/` 被提交进仓库、gitignore 中文规则失效。
**改动**：
- **`计划/` 目录（55 个文件）从 git 索引移除**（`git rm -r --cached`，本地文件完整保留），配合 `.gitignore` 新增 `/计划/` 规则，使参考截图目录不再进入 GitHub。
- **中文编码规范写入 `RELEASE.md` 踩坑 #1（强化）**：所有含中文文本文件必须 UTF-8 无 BOM；禁止 `git commit -m "中文"`（改用 UTF-8 无 BOM 文件 + `-F`，或 `chcp 65001`，或配置 `i18n.*`）；含中文路径/规则勿用 PowerShell 管道传参给 git（编码错乱误判）；推送前自检 `git log -1 --pretty=%s` 与 `git show HEAD --name-only`。
- **`RELEASE.md` 新增踩坑 #12**：`.gitignore` 对已跟踪文件无效，移除已提交目录须 `git rm -r --cached` + gitignore 规则。
- **实现细节**：由于 PowerShell 向 git 传中文参数会 GBK 双重编码导致 pathspec 匹配失败，实际用 Python 脚本从 git 索引精确取 `计划/` 路径后执行 `git rm --cached`，规避编码坑。

---

### v0.1.55 · 2026-08-21 · 文档治理：合并设计规范 + 换机交接文档重构 + README 全面更新
**范围**：`README.md`、`RELEASE.md`、`UI设计规范.md`、`计划/UI设计规范.md`、`server/README.md`、`miniprogram/README.md`、`CHANGELOG.md`。

**背景**：用户要求检查所有 md 文档——合并重复设计规范、补齐换机交接文档（项目目标/已完成/未完成/关键文件/运行方式/踩坑）、更新过时 README。

**改动**：
- **UI 规范合并**：`计划/UI设计规范.md` 为根目录 `UI设计规范.md` 的早期精简副本，已改为指向根目录版的说明页；根目录版补写 §5.2 checkbox 规范（原生 checkbox + `accent-color`，替代 `appearance:none` 自绘）与两端主题色说明（后台紫 `#5e6ad2` / 小程序橙 `#FF6B35`），自检清单加 checkbox 检查项。
- **RELEASE.md 重构为完整换机交接文档**：新增项目目标、已完成功能清单（小程序端/运营后台/后端，截至 v0.1.55）、未完成与规划（真实微信登录支付未接、权限/插件菜单为占位）、关键文件表、运行方式（端口约定 **8899**）、发版流程、踩坑记录 11 条（中文乱码、CHANGELOG 与 tag 同步、admin.html 内嵌 JS 校验、checkbox 教训、端口混淆、GitHub 凭据等）。
- **根 README.md 更新**：从 MVP 阶段说明升级为当前功能概览、最新目录结构、快速开始（端口 8899）、部署、提交规范。
- **server/README.md / miniprogram/README.md 更新**：端口 8899、后台接口/控制器清单、前后端主题色说明。
- 修正过时信息：远程仓库地址由 cnb.cool 改为 GitHub `saning18888-hue/wxappshopv1`；端口统一为 8899。

**约定**：后续版本号与 CHANGELOG 严格同步；`计划/UI设计规范.md` 不再维护，唯一规范源为根目录 `UI设计规范.md`。

---

### v0.1.54 · 2026-08-20 · 补记 v0.1.49~v0.1.53 缺失的变更记录
**范围**：`CHANGELOG.md`。

**问题**：v0.1.49~v0.1.53 五个版本发版时只打了 git tag、未同步更新 CHANGELOG，导致 CHANGELOG 顶部停留在 v0.1.48，与 git tag 不一致（违反「CHANGELOG 为唯一版本更新记录源」约定）。
**修复**：
- 按时间倒序补写 v0.1.49～v0.1.53 五条记录，内容与各 tag 的实际改动一一对应（推送选择样式反复调整过程：grid 自适应列宽 → flex wrap 防挤压 → 原生 checkbox + 全局紫色按钮 → 3+3+1 三行布局）。
- 本次补记自身作为 v0.1.54 记录，保证「CHANGELOG 顶部版本号 == 最新 git tag」。

---

### v0.1.53 · 2026-08-20 · 推送选择改为 3+3+1 三行布局
**范围**：`server/public/admin.html`。

**问题**：用户反馈「把这些选项排成两行」。7 项中最长 label 为 8 字（商家提现申请提醒），4 列会被自动挤换行。
**修复**：
- `.sms-subscribe .radio-inline` 的 `flex-basis` 从 `calc(25% - 11px)` 改为 `calc(33.333% - 10px)`，每行明确放 3 项，7 项自然排成 3+3+1。
- `#smsModal .field>label` 宽度 96→84px，给推选区多腾 12px。
- `box-sizing:border-box` 防止 gap/padding 把列宽撑爆。
- chromium 截图验证：7 项 3 行渲染、label 完整、勾选框小巧、按钮为全局紫色主题。

---

### v0.1.52 · 2026-08-20 · 推送选择改用原生 checkbox + 按钮回退全局紫色主题
**范围**：`server/public/admin.html`。

**问题**：用户反馈自绘 12px 方框+模拟对勾仍不协调（「把这个破框改了，换个设计方式」），且蓝色 `#409eff` 按钮与全局紫色 `--primary` 设计风格冲突（「按钮颜色跟我之前的设计风格和颜色对起来」）。
**修复**：
- 放弃 `appearance:none` 自绘 checkbox，改用浏览器原生 checkbox + `accent-color:var(--primary)`，由浏览器绘制干净小巧的对勾，不再依赖宽度/伪元素 hack。
- 选中 label 文字变 `var(--primary)` 并加粗（原为 #409eff）。
- `#smsModal` 底部按钮改用 `var(--primary)/var(--primary-700)`，`.btn.gray` 用系统灰 `#f2f3f5`，与全局按钮一致。
- chromium 截图验证通过。

---

### v0.1.51 · 2026-08-20 · 弹窗加宽至 620px + 推选区改 flex wrap
**范围**：`server/public/admin.html`。

**问题**：用户截图指出文字仍截断（「商家订单提醒」被切）、勾选框仍大、推送区贴左。根因是弹窗仅 560px、`.field` 用 flex+`min-width:0`、grid `repeat(2,max-content)` 在窄 flex 容器里被压成 min-content。
**修复**：
- `#smsModal .modal-card` 宽度 560→620px。
- `.sms-subscribe` 从 grid 改为 `flex flex-wrap`，每项 `flex:0 0 calc(50% - 12px)`，不再被父容器压扁。
- checkbox 13→12px 并加 `box-sizing:border-box`；对勾伪元素重新定位。
- `#smsModal .field>label` 宽度 90→96px（推选区右移 10px）；移除 v0.1.50 加的 `padding-left:14px`（误伤 input）。
- 取消按钮 hover 不再变蓝，仅底色 `#fafbfc` 微调。
- chromium 截图验证：7 项完整、checkbox 小巧、按钮配色正确。

---

### v0.1.50 · 2026-08-20 · 修复 label 截断 + checkbox 再缩 + 字段左内缩
**范围**：`server/public/admin.html`。

**问题**：用户截图指出文字仍截断、勾选框仍大、红框内字太靠左。
**修复**：
- `.sms-subscribe` 列改为 `repeat(2,max-content)` + `width:max-content` + 父级 `flex:0 0 auto`，长 label 不再被截断。
- checkbox 14→13px 并加 `box-sizing:border-box`。
- `#smsModal .field` 加 `padding-left:14px`（该方案后被 v0.1.51 撤销，因误伤 input 对齐）。
- 已附 chromium 截图验证。

---

### v0.1.49 · 2026-08-20 · 推送选择 label 完整显示 + checkbox 缩小
**范围**：`server/public/admin.html`。

**问题**：用户截图指出文字显示不全（「商家订单提醒」被截断）、选择框太大。
**修复**：
- `.sms-subscribe` 列宽由 `repeat(2,minmax(0,1fr))` 改为 `repeat(2,auto)` + `width:fit-content`，列宽由最长 label 自适应。
- checkbox 16→14px，对勾字号 12→10px。
- 列间距 24px、行间距 10px，更接近参考图视觉密度。

---

### v0.1.48 · 2026-08-20 · 修复后台登录失效（v0.1.47 残留数组项致 JS 语法错误）
**范围**：`server/public/admin.html`。

**问题**：用户反馈「后台又没法登录了」。排查发现后端登录接口正常（`POST /admin/login` 返回 token），根因是 v0.1.47 精简 `smsSubscribeOptions` 时仅替换了前 15 行，数组尾部残留 `member_reserve`、`stock_warning`、`commission_withdraw`、`member_shipped`、`dispatch`、`pay_success`、`lottery` 等 7 行，且上一项 `order_bargain` 末尾缺少逗号，导致整个内嵌 `<script>` 编译报 `Unexpected token '{'`（`new vm.Script` 定位到 admin-inline.js:4419），整页 JS 失效、`login()` 未定义、登录按钮无响应。
**修复**：
- 删除 `smsSubscribeOptions` 数组尾部残留的 7 项，恢复为参考图一致的 7 项数组语法。
- `node` 全量编译内嵌 script 验证通过（1/1），端到端验证 `POST /admin/login` → token → `GET /admin/goods` 均返回 `code=0`。
- 补充约定：精简/重构内嵌 JS 数组后必须用 `node -e "new vm.Script(...)"` 做一次全量语法校验再提交。

---

### v0.1.47 · 2026-08-20 · 联系人推送选择严格对齐参考图文字与顺序
**范围**：`server/public/admin.html`。

**问题**：用户再次指出推送选择要按照参考图片里的文字和布局做。核对 `计划/2.系统/4短信模板/商家联系人点击编辑按钮.png` 后，发现当前选项数量和文案与截图不一致。
**修复**：
- 将 `smsSubscribeOptions` 精简为参考图里的 7 项：商家订单提醒、商家订单退款提醒、商家提现申请提醒、表单提交成功提醒、商家拼团订单提醒、商家秒杀订单提醒、商家砍价订单提醒。
- 文案由「表单提交成功通知」改为截图中的「表单提交成功提醒」。
- 保持已有的 2 列蓝色自定义复选框布局与底部按钮样式不变。

---

### v0.1.46 · 2026-08-20 · 联系人编辑弹窗复选框与按钮按参考图重构
**范围**：`server/public/admin.html`。

**问题**：用户给参考图指出推送选择应为蓝色多选框、多列排列、选中后文字变蓝，底部取消/确定按钮应为白底灰字 + 蓝底白字。
**修复**：
- 推送选择改为 2 列 grid 布局，自定义蓝色 checkbox（选中背景 `#409eff`）。
- 复选框 label 文字用 `<span>` 包裹，通过相邻兄弟选择器实现选中后文字变蓝。
- `#smsModal` 底部按钮统一为蓝色主题：取消白底灰字灰边框，确定蓝底白字。

---

### v0.1.45 · 2026-08-20 · 补全短信模板为 22 条完整预置
**范围**：`server/app/service/SettingsService.php`、`server/public/admin.html`。

**问题**：用户反馈「我给你的文字模板就这点？？？」，指出模板数量不对。核对 `计划/2.系统/4短信模板/*.txt`：阿里云、腾讯云各 **22 条**（短信验证码、商家订单/秒杀/拼团/砍价/积分/预约/退款/提现、表单提交、会员各类型订单、库存预警、佣金提现到账、发货、派单、支付成功、全渠道抽奖等），而此前代码只预置了 7 条且内容与模板文件不一致。
**修复**：
- `SettingsService::defaults()` 的 `sms_templates` 补全为阿里云 / 腾讯云各 22 条，内容、变量格式严格按用户提供的 txt（阿里云 `${var}`、腾讯云 `{n}`）。
- 同步前端 `admin.html` 的 `smsTemplateDefaults`，键名与后端一致（`order_seckill`/`order_group`/`order_bargain`/`order_points`/`order_reserve`/`withdraw_apply`/`form_submit`/`member_*`/`stock_warning`/`commission_withdraw`/`member_shipped`/`dispatch`/`pay_success`/`lottery`）。
- `smsSubscribeOptions`（联系人推送选择）同步扩展到全部 22 项。
- 将本地数据库中已保存的旧 7 条 `sms_templates` 重置为完整 22 条（临时引导脚本执行后已删除），已验证接口返回 `aliyun=22 tencent=22`。

---

### v0.1.44 · 2026-08-20 · 短信模板表格改为全列居中 + 操作列文字链接
**范围**：运营后台 UI（`server/public/admin.html`）。

**问题**：用户反馈"你看看人家是怎么排的"，截图显示参考布局为：描述、内容、状态、操作四列全部居中对齐，内容文字换行后仍居中，操作列是蓝色文字链接（模板ID / 发送 / 删除）。
**修复**：
- 四列统一 `text-align:center;vertical-align:middle`。
- 描述列宽度 140px，内容列自适应，状态列 80px，操作列 200px。
- 操作列「发送」「删除」从按钮改为蓝色文字链接，与「模板ID」风格一致。
- 调整左右内边距，避免文字贴边。

---

### v0.1.43 · 2026-08-20 · 调整短信模板表格左右内边距
**范围**：运营后台 UI（`server/public/admin.html`）。

**问题**：短信模板弹窗描述列文字「太靠左」、操作列表头「操作」「太靠右」，贴着表格边框。
**修复**：
- 描述列第一格 `padding-left` 从默认 14px 加大到 **20px**，文字不再贴左边框。
- 操作列最后一格 `padding-right` 加大到 **20px**，「操作」表头与右侧边框留出舒适距离。
- 内容列保持自适应剩余空间。

---

### v0.1.42 · 2026-08-20 · 调整短信模板表格列宽
**范围**：运营后台 UI（`server/public/admin.html`）。

**问题**：短信模板弹窗「左边太窄、右边太宽」，描述列文字换行，操作列表头「操作」太靠边。
**修复**：
- 描述列从 130px 加宽到 **180px**，让「商家订单退款提醒」「商家拼团订单提醒」等不再换行。
- 操作列从 320px 缩窄到 **260px**，三元素（模板ID 链接 + 发送 + 删除）仍在一行，表头不再紧贴右边缘。
- 内容列保持自适应剩余空间。

---

### v0.1.41 · 2026-08-20 · 短信模板「模板ID」改为点击编辑弹窗
**范围**：运营后台 UI（`server/public/admin.html`）。

**需求**：用户截图显示，模板列表里「模板ID」是可点击的蓝色链接，点击后弹出「编辑」窗口，包含只读的「描述」「内容」和可编辑的「模板code」。
**之前实现**：操作列里直接放了一个 `模板ID` 输入框，与截图交互不符。
**修复**：
- 列表操作列改为：`模板ID` 蓝色链接 + 发送按钮 + 删除按钮。
- 点击链接打开编辑弹窗，展示描述、内容、模板code 输入框；保存后仅更新当前模板的 `template_id`。
- 底部按钮取消用 `.btn.gray`、确定用 `.btn.primary`，与截图一致。
- 调整 `#smsModal .field` 为左右布局（label 固定 90px，右侧内容自适应），保证弹窗内描述/内容/模板code 对齐。

---

### v0.1.40 · 2026-08-20 · 设计文档：统一关闭按钮规范
**范围**：`server/public/admin.html`、`UI设计规范.md`。

**内容**：把弹窗关闭按钮的圆形灰底 × 样式写进 `UI设计规范.md` §5.1，作为以后所有弹窗的强制规范；全站代码里残留的 `modal-close` 全部替换为 `close`，确保实现与文档一致。

---

### v0.1.39 · 2026-08-20 · 修复联系人复选框竖排与关闭按钮样式统一
**范围**：运营后台 UI（`server/public/admin.html`）。

**问题 1**：联系人编辑弹窗推送选择里的文字又竖起来了。
**根因**：`.sms-subscribe .radio-inline` 虽然改成 flex，但没有禁止文本换行；当弹窗实际宽度被 `.modal-card{width:640px}` 默认限制时，label 文本被挤压成竖排。
**修复**：给 `.sms-subscribe .radio-inline` 加 `white-space:nowrap`；把 `#smsModal .modal-card` 行内样式由 `max-width:560px` 改为 `width:560px;max-width:98vw`，避免被默认 640px 宽度影响。

**问题 2**：短信弹窗关闭按钮样式与其它弹窗不一致。
**根因**：短信三个弹窗的关闭按钮用了 `class="modal-close"`，而全站其它弹窗统一用 `class="close"`；`.modal-header .close` 已有圆角灰底样式，`.modal-close` 不生效。
**修复**：`smsConfigModal` / `smsTemplateModal` / `smsModal` 的关闭按钮全部改为 `class="close"`。

---

### v0.1.38 · 2026-08-20 · 修复模板弹窗宽度与联系人复选框布局
**范围**：运营后台 UI（`server/public/admin.html`）。

**问题 1**：短信模板弹窗「还是太挤」，变量名被从中间截断（如 `${cod e}`、`${statu s}`），仍有横向滚动条。
**根因**：之前只改了 `max-width`，但 `.modal-card` 默认 `width:640px` 仍生效，弹窗实际只有 640px 宽；`word-break:break-all` 又把变量名从中间斩断。
**修复**：把模板弹窗 `.modal-card` 行内样式改为 `width:1100px;max-width:98vw`，真正变宽；内容列取消 `break-all`，改用正常换行；描述列 130px、状态列 80px、操作列 320px，内容列自适应剩余空间。

**问题 2**：联系人编辑弹窗「打对勾的框都排到哪里了」——复选框和 label 没在同一行，两列 grid 对不齐。
**根因**：推送选择用了两列 grid，文字长度不同时行高不一，checkbox 和 label 错位。
**修复**：把 `.sms-subscribe` 改成单列 flex 布局，每个选项一行，checkbox 与 label 严格同行、固定 8px 间距。

---

### v0.1.37 · 2026-08-20 · 修复联系人编辑对齐与模板弹窗再变宽
**范围**：运营后台 UI（`server/public/admin.html`）。

**问题 1**：联系人编辑弹窗「姓名/手机号」与推送选择复选框「不齐」。
**根因**：`#smsModal .field` 是 label 在上、输入框在下的上下结构，label 与输入框没有严格左对齐；复选框 grid 行高由文字长度决定，导致两行没对齐。
**修复**：将 `#smsModal .field` 改为左右 flex 布局，`label` 固定 80px 宽度；复选框 grid 项固定 `height:32px` 并垂直居中，整体整齐排列。

**问题 2**：短信模板弹窗仍「太窄」，删除按钮被挤到下一行/右侧被截断。
**根因**：弹窗 900px 仍不够，操作列 260px 放不下「模板ID 输入框 + 发送 + 删除」三个元素（因 `.a-actions` 默认 `flex-wrap:wrap`）；内容列英文变量名不会自动换行也加剧了宽度占用。
**修复**：弹窗宽度从 900px 放宽到 980px；描述列缩至 96px、状态列 66px、操作列扩到 300px；操作列强制 `flex-wrap:nowrap`、固定输入框 130px；内容列加 `word-break:break-all` 保证长变量名换行。

---

### v0.1.36 · 2026-08-20 · 修复短信配置对齐与模板弹窗显示不全
**范围**：运营后台 UI（`server/public/admin.html`）。

**问题 1**：短信配置弹窗 label 和输入框「不一样齐」。
**根因**：`.form-row` 只定义 `display:flex;gap:16px`，没有固定 label 宽度；三个 label 文字长度不同，导致输入框起始位置参差不齐。
**修复**：新增 `#smsConfigForm .form-label{width:170px;flex:none;text-align:left}` 与 `#smsConfigForm .form-input{width:100%}`，让 label 定宽、输入框在同一垂直线上对齐。

**问题 2**：短信模板弹窗「显示不全」，右侧发送按钮被截断，出现横向滚动条。
**根因**：弹窗最大宽度只有 760px，操作列仅 200px，放不下「模板ID 输入框 + 发送 + 删除」；同时全局 `.article-table-wrap th:first-child,td:first-child{width:44px}` 被优先应用，进一步挤压可用空间。
**修复**：弹窗宽度从 760px 放宽到 900px；描述列 110px、状态列 76px、操作列 260px、内容列自适应 max-width:320px；操作列按钮与输入框加水平间距，避免重叠。

---

### v0.1.35 · 2026-08-20 · 修复短信弹窗背景与模板表格竖排
**范围**：运营后台 UI（`server/public/admin.html`）。

**问题 1**：短信配置/模板/通用弹窗看起来「没背景」。
**根因**：全站弹窗内容容器统一用 `.modal-card`（白底、圆角、阴影），而短信三个弹窗错写成 `.modal-box`，该 class 未定义任何背景样式，导致弹窗背景缺失。
**修复**：将 `.modal-box` 统一改为 `.modal-card`。

**问题 2**：短信模板弹窗里「描述」列文字竖着排（如「短信验证码」成竖排）。
**根因**：全局 `.article-table-wrap th:first-child,td:first-child{width:44px;text-align:center}` 被应用到弹窗内表格，且弹窗位于 `#smsPanel` 外部，之前针对 `#smsPanel` 的覆盖未生效；44px 宽度把文字挤成竖排。
**修复**：新增 `#smsTemplateModal .article-table-wrap ...` 样式，为模板表格四列分别设置合理宽度与对齐，描述列 `white-space:normal`、操作列 `white-space:nowrap`，并垂直居中。

---

### v0.1.34 · 2026-08-20 · 修复短信弹窗无法打开（按钮「点不动」）
**范围**：运营后台 UI（`server/public/admin.html`）。

**问题**：「短信管理」平台列表里的「配置」「商城短信模板」按钮、模板弹窗内「测试发送」、以及联系人「添加/编辑」弹窗点击无反应（看起来像按钮点不动）。
**根因**：`.modal` 基础样式为 `display:none`，全站弹窗靠增加 `show` 类显示；而短信相关的三个弹窗（`smsConfigModal` / `smsTemplateModal` / 通用 `smsModal`）只移除了 `hidden` 类，移除后仍是 `display:none`，弹窗从未真正显示。
**修复**：三个短信弹窗的打开逻辑统一改为 `classList.add('show')`、关闭逻辑改为 `classList.remove('show')`，与后台其余弹窗保持一致。

---

### v0.1.33 · 2026-08-20 · 短信管理（单菜单 + 平台开关 + 阿里云/腾讯云独立模板）
**范围**：运营后台 UI（`server/public/admin.html`）、后端 API（`server/app/service/SettingsService.php`、新建 `server/app/controller/admin/SmsContact.php`、`SmsSendLog.php`、`SmsSend.php`、数据库迁移 `server/database/apply_sms_tables.php`）、路由（`server/route/app.php`）。

**短信管理（按截图重做，去掉原 4 子菜单拆分方案）**
- 「系统 > 短信管理」为单个菜单，进入后默认展示「短信管理」标签，另含「商家联系人」「发送日志」两个标签。
- **短信平台列表**：阿里云短信配置、腾讯云短信配置两行，每行含「状态」开关（启用/禁用）与「配置」「商城短信模板」两个按钮。
  - 「配置」弹窗按平台不同：阿里云填 AccessKeyId / AccessKeySecret / 短信签名；腾讯云填 AppId / AppKey / 短信签名。
  - 「商城短信模板」弹窗按平台分别维护，阿里云与腾讯云模板内容变量格式不同：
    - 阿里云：`${code}`、`${status}`、`${remark}`、`${name}`、`${amount}`、`${goods_name}`、`${order_sn}` 等占位符。
    - 腾讯云：`{1}`、`{2}`、`{3}` 数字占位符。
  - 每个模板行含「模板ID」输入框、「状态」开关、「发送」（测试）与「删除」按钮，底部「保存」。
  - 预置 7 种模板：短信验证码、商家订单提醒、商家订单退款提醒、商家提现申请提醒、商家拼团订单提醒、商家秒杀订单提醒、商家砍价订单提醒（阿里云/腾讯云各一套）。
- **商家联系人**：姓名、手机号、启用状态开关、推送选择（商家订单提醒/退款/提现/表单提交成功/拼团/秒杀/砍价），支持新增、编辑、删除、状态切换、关键词筛选。
- **发送日志**：记录手机号、模板key、发送内容、结果、短信配置key值（ALI_SMS_CONFIG / TENCENT_SMS_CONFIG）、时间，支持分页与关键词筛选。

**后端**
- `SettingsService::defaults()` 的 `sms` 改为 `aliyun`/`tencent` 双平台独立结构（各自含 `enabled` + 凭证字段）；`sms_templates` 改为 `aliyun`/`tencent` 两套，每模板含 `template_id`、`enabled`、`content`。
- 新增数据库表 `sms_contacts`、`sms_send_logs` 及迁移脚本 `database/apply_sms_tables.php`（幂等，含默认店长示例数据）。
- 新增控制器：`SmsContact.php`（联系人 CRUD / 启用切换）、`SmsSendLog.php`（日志列表）、`SmsSend.php`（单条 `send` / 批量 `batch` 发送，演示模式，按平台解析变量，已预留真实 SDK 接入点）。
- 新增 `route/app.php` 路由：`/admin/sms_contacts`、`/admin/sms_send_logs`、`/admin/sms_send`、`/admin/sms_send_batch`。
- 管理员写操作自动写入 `operation_logs`（已有自动记录逻辑）。

---

### v0.1.32 · 2026-08-20 · 附件设置（远程附件配置）
**范围**：运营后台 UI（`server/public/admin.html`）、后端 API（`server/app/service/SettingsService.php`、`server/app/controller/admin/Settings.php`、`server/route/app.php`）。

**附件设置菜单补全**
- 后台「系统 > 附件设置」绑定独立 `attachPanel`。
- 远程附件支持 5 种类型切换：系统默认 / FTP服务器 / 阿里云OSS / 七牛云储存 / 腾讯云储存，每种类型展示对应配置表单。
- 系统默认：提示附件保存在本机服务器。
- FTP服务器：启用SSL连接、FTP服务器地址/端口、账号、密码、被动模式(pasv)、远程附件目录、远程访问URI、传输超时时间。
- 阿里云OSS：Access Key ID、Access Key Secret、内网上传开关、Bucket、自定义URL（去掉了原截图中 OSS 工具链接推荐区域）。
- 七牛云储存：Accesskey、Secretkey、Bucket、Url。
- 腾讯云储存：APPID、SecretID、SecretKEY、Bucket、bucket所在区域、Url。
- 底部提供「保存配置」和「测试配置(无需保存)」两个按钮。

**后端**
- `SettingsService::defaults()` 增加 `attachment` 配置项及各类型的默认值。
- `SettingsController` 新增 `attachmentTest()` 接口：按当前选中的存储类型校验必填项，并预留真实 SDK 接入注释（当前只做配置格式校验）。
- `route/app.php` 注册 `POST /admin/settings/attachment_test` 路由。

### v0.1.31 · 2026-08-20 · 操作日志管理模块 + 自动记录管理员操作
**范围**：运营后台 UI（`server/public/admin.html`）、后端 API（`server/app/controller/admin/OperationLog.php`、`server/app/common/controller/AdminController.php`、`server/route/app.php`）、数据库迁移（`server/database/apply_operation_logs.php`）。

**操作日志管理**
- 后台「系统 > 操作日志」：绑定独立 `logPanel`，列表展示账号、姓名、角色、操作、IP、操作时间、详情。
- 列表支持：起止时间筛选、账号/姓名/操作关键词查询、分页、批量删除、按时间段删除。
- 详情弹窗：完整展示账号、姓名、角色、操作、请求方法、请求路径、IP、操作时间、参数。

**自动记录管理员操作**
- 所有非 GET 请求（POST/PUT/DELETE/PATCH）在 `AdminController` 鉴权成功后自动写入 `operation_logs`。
- 操作描述自动推断模块（商品、订单、会员、相册、跳转小程序、站点设置、上传等）和动作类型（删除/编辑/操作）。
- 登录接口本身不记录；日志管理自身的写操作不记录，避免噪声。

**后端**
- 新建 `OperationLog` 控制器：列表、详情、批量删除、按时间段删除。
- 注册路由：`GET /admin/operation_logs`、`GET /admin/operation_logs/info`、`POST /admin/operation_logs/batch_delete`、`POST /admin/operation_logs/delete_by_time`。
- 数据库迁移：`apply_operation_logs.php` 幂等新建 `operation_logs` 表（SQLite 兼容）并建立索引。

### v0.1.30 · 2026-08-20 · 站点设置补全（独立面板：基础信息 + 域名校验）
**范围**：运营后台 UI（`server/public/admin.html`）、后端 API（`server/app/service/SettingsService.php`、`server/app/controller/admin/Upload.php`、`server/route/app.php`）。

**站点设置菜单补全**
- 新建独立 `sitePanel`，与原来的 `basePanel`（基础设置）彻底分离。
- 左侧「系统 > 站点设置」菜单绑定到 `sitePanel`，打开后显示：
  - 基础设置：站点图标上传（100×100，1:1）、站点名称、后台版权信息；
  - 域名校验：`.txt` 校验文件上传并保存到 `public/` 根目录。

**后端**
- `SettingsService::defaults()` 增加 `store_name`、`store_logo`、`admin_copyright`、`domain_verify_file` 默认值。
- `Upload.php` 新增 `domainVerify()` 方法，仅允许 `.txt` 文件，保存到 `public/` 根目录，并做路径遍历防护。
- `route/app.php` 注册 `POST /admin/upload/domain_verify` 路由。

### v0.1.29 · 2026-08-20 · 新增跳转小程序管理模块
**范围**：运营后台 UI（`server/public/admin.html`）、后端 API（`server/app/controller/admin/MiniApp.php`、`server/route/app.php`）、数据库迁移（`server/database/apply_mini_apps.php`）。

**新增跳转小程序管理**
- 后台「内容 > 跳转小程序」：支持微信 / 百度 / 支付宝 / 字节跳动四个平台 tab 切换，列表展示小程序名称、APPID、跳转地址、排序、手机端是否显示、创建时间、操作。
- 列表功能：关键词筛选、分页、批量删除、状态开关切换；添加 / 编辑弹窗含名称、APPID、跳转地址，关闭按钮沿用全局 28px 圆形×样式。
- 后端：`MiniApp` 控制器（列表 / 详情 / 保存 / 删除 / 批量删除 / 状态切换），`route/app.php` 注册 `/admin/mini_apps` 相关路由。
- 数据库：幂等迁移 `apply_mini_apps.php` 新建 `mini_apps` 表（含 platform、name、appid、path、sort、status、created_at 字段）。

### v0.1.28 · 2026-08-20 · 后台 UI 统一美化整改 + 新增相册管理模块
**范围**：运营后台 UI（`server/public/admin.html`）、相册 API（`server/app/controller/admin/Album.php`、`AlbumCategory.php`、`AlbumImage.php`、`server/route/app.php`）、数据库迁移（`server/database/apply_albums.php`）、工程配置（`.gitignore`）。

**后台 UI 统一美化整改**
- 统一全站关闭按钮：所有弹窗 `.modal-header .close` 改为 28px 圆形（浅灰底 + 居中叉号），与文章 / 相册管理子菜单一致。
- 全局表单控件：新增 `.form-input` / `.form-select` / `.form-textarea` 统一样式（极淡背景 + 1px 描边 + focus 靛蓝光环），`.form-select` 使用自定义 SVG 箭头（`appearance:none` 去除原生外观）；商品分析 / 经营概况等面板日期框、会员编辑弹窗下拉框、配送 / 自提 / 同城 / 商品工具栏、地图 / 分页等输入框全部套用。
- 会员编辑弹窗：radio 选项与增减（stepper）控件修正到同一水平线。
- 工具栏对齐：会员列表工具栏右侧搜索框 / 查询 / 视图切换错位修复（`.toolbar-right{display:flex;align-items:center;gap:8px}`，搜索框与按钮等高）。

**原生弹窗全面替换（网站一体风格）**
- 新增自定义弹窗：图片重命名 `#albumImageRenameModal`、通用确认 `#commonConfirmModal`（「!」图标 + 取消 / 确定双按钮）、通用输入 `#commonInputModal`。
- 整份文件全部原生 `confirm()`（31 处）/ `prompt()`（8 处）替换为 `await confirmDialog()` / `await promptDialog()` 的网站风格 Promise 弹窗（会员 / 商品 / 订单 / 卡券 / 评论 / 配送 / 文章 / 相册 / 精选推荐等多处删除、改名、链接选择等），相关调用函数改为 `async`。

**新增相册管理模块（后端补全，前端 UI 此前已存在）**
- 后台「内容 > 相册管理」：相册分类（上级分类 / 排序 / 启用）、相册（封面 / 名称 / 分类 / 状态）、相册图片（上传 / 重命名 / 设封面 / 移动到其他相册 / 批量删除）。
- 后端：`Album` / `AlbumCategory` / `AlbumImage` 三个控制器（列表 / 详情 / 保存 / 删除 / 批量删除 / 状态切换 / 上传 / 设封面 / 移动 / 重命名接口），`route/app.php` 注册相册相关路由。
- 数据库：幂等迁移 `apply_albums.php` 新建 `album_categories` / `albums` / `album_images` 三张表。

**工程治理**
- 更新 `.gitignore`：排除本机调试 / 临时文件（`_*.ps1`、`_*.png`、`**/_*/`、`node_modules/`、`stats_*.json`、`stats_*.html`、`php_server.*`、`server/_test.ps1`、`server/check_tables.php`），避免误入库。

### v0.1.27 · 2026-08-20 · 移除 banner 管理模块
**范围**：运营后台 UI（`server/public/admin.html`）、后端（删除 `server/app/controller/admin/Banner.php`、`server/database/apply_banners.php`、`server/route/app.php` 中的 banner 路由）、数据库（sqlite 中 `banners` 表）。
**改动**：
- 移除「内容」菜单的 banner 管理功能：菜单项、列表面板、添加/编辑弹窗、选择链接弹窗及全部 JS 逻辑、全局变量、`switchMenu` 加载分支。
- 删除后端 Banner 控制器、`banners` 迁移脚本与路由；清理 sqlite 中此前创建的空 `banners` 表（已 drop）。
- 装修模块（店铺 › 我的模板）的轮播设置 / 魔方导航 / 精选推荐 / 分类导航均保持不变。

### v0.1.26 · 2026-08-19 · 新增文章管理模块（列表/分类/设置）+ 文章管理 UI 美化 + 项目 UI 设计规范
**范围**：运营后台 UI（`server/public/admin.html`）、文章 API（`server/app/controller/admin/Article.php`、`ArticleCategory.php`、`Settings.php`、`route/app.php`）、数据库迁移（`server/database/apply_articles.php`）、封面资源（`server/public/uploads/banner/20260819/`）、项目规范（`UI设计规范.md`）。
**改动**：
- 新增「文章管理」完整模块：文章列表（封面 / 标题 + 作者·浏览量副行 / 推荐 / 状态 / 显示隐藏 / 操作）、文章分类（上级分类 / 排序 / 启用）、基础设置（文章详情页字段显隐）。
- 新增后台接口：文章 CRUD、分类 CRUD、文章设置读写；新增 `apply_articles.php` 幂等迁移脚本与 `banner/20260819` 封面目录。
- 文章管理 UI 美化：tab 下划线高亮、工具栏圆角控件 + 自定义下拉箭头、表格圆角包裹、编辑弹窗两栏 grid（主表单 + 封面展示侧栏）、状态徽章 `.badge`、操作 `.btn.sm`。
- 基础设置重构为「带图标分段控件」：每项一行卡片，左侧 16px 线性图标 + 名称，右侧胶囊式二选一（显示 / 隐藏），图标与文字、选项圆点均留 ≥8px 间距，告别拥挤死板。
- 新增项目级 `UI设计规范.md`：统一间距呼吸感、表单控件（禁止裸 radio、必须 hover/focus 态）、图标用法、表格 / 弹窗 / 颜色变量化与提交前自检清单，约束后续页面设计。

### v0.1.25 · 2026-08-19 · 修复：登录后空白、F5 自动退出、数据分析子菜单不显示
**范围**：后端配置（`server/config/database.php`、`server/.env`）、运营后台 UI（`server/public/admin.html`）。
**改动**：
- 修复 SQLite 数据库文件路径解析：`.env` 的 `DB_SQLITE_PATH` 相对路径统一以项目根目录 `root_path()` 为基准解析为绝对路径，修复因 PHP 进程启动目录不同导致的 `unable to open database file`，从而解决登录后所有数据接口 500、后台空白、F5 刷新即退出登录的问题。
- `.env` 注释由 `#` 改为标准的 `;`，规避 `parse_ini_file` 仅识别 `;` 的解析隐患。
- 修复「数据」一级菜单下 5 个分析子菜单（商城概况 / 交易分析 / 商品分析 / 网站分析 / 汇总分析）点开空白：面板原先置于可见内容区 `.content` 之外，现于 `switchMenu` 显示前将其移入 `.content` 容器。
- 前端容错增强：`fetchA` 在 500 等非 JSON 响应时不再抛出解析异常导致整页崩溃；启动逻辑仅在真正 401（未授权）时退出登录，临时服务端错误不再强制退出。

### v0.1.24 · 2026-08-18 · 新增数据分析套件：商城概况 / 交易分析 / 商品分析 / 网站分析 / 汇总分析
**范围**：运营后台 UI（`server/public/admin.html`）、数据分析 API（`server/app/controller/admin/Stats.php`、`StatsService.php`、`route/app.php`）、数据库（`server/database/install.sqlite.sql`、新增 `apply_stats_page_views.php`）。
**改动**：
- 新增「数据」一级菜单下的 5 个分析子菜单，每个菜单对应独立面板，并统一使用 Chart.js 图表与日期筛选。
- 商城概况：付款金额、付款订单数、付款买家数、付款商品数、订单总利润 5 个彩色指标卡 + 多指标趋势折线图。
- 交易分析：访客→下单→付款漏斗图 + 三段转化率，附关键指标。
- 商品分析：新上架商品、商品访客数、商品浏览量、访问商品数指标卡 + 商品排行表格（图片/名称/浏览量/访客数/付款人数/付款金额/付款件数/转化率）。
- 网站分析：PV/UV/IP/VV/平均访问深度/人均浏览页数/平均停留时长/跳出率 8 个指标卡 + 流量趋势图 + 新老访客饼图 + 着陆页面 TOP10。
- 汇总分析：会员数/销售额/已提现/待提现/未结算/积分/储值/分销商佣金/队长分红/股东分红/代理分红/批发金额 多维度汇总表。
- 新增 `page_views`、`visitor_sessions` 流量表；新增幂等迁移脚本 `database/apply_stats_page_views.php`，无数据时自动填充最近 7 天演示流量数据。
- 所有面板支持今天/昨天/最近7天/最近30天/自定义日期范围，自定义范围最大 30 天。

### v0.1.23 · 2026-08-18 · 核销管理「验证核销」界面 UI 优化
**范围**：运营后台 UI（`server/public/admin.html`）。
**改动**：
- 重设计「核销管理 > 验证核销」表单：卡片式容器 + 渐变背景 + 核销图标，提升视觉层级与精致度。
- 核销类型下拉框自定义箭头样式，告别浏览器默认原生外观。
- 核销码输入框放大加粗、聚焦主色光晕；确认核销按钮改为通栏大按钮 + 勾选图标 + 悬浮阴影。

### v0.1.22 · 2026-08-18 · 新增核销管理：到店自提/电子卡券/优惠券核销
**范围**：运营后台 UI（`server/public/admin.html`）、核销 API（`server/app/controller/admin/Verify.php`、`VerifyService.php`、`route/app.php`）、数据库（`server/database/install.sqlite.sql`、新增 `apply_verify_records.php`）。
**改动**：
- 新增「订单 > 核销管理」独立菜单入口，按截图还原：验证核销 / 核销记录 两个 tab。
- 验证核销：核销类型下拉（到店自提/电子卡券/优惠券）、核销码输入、空值校验、一键核销。
- 新增后台核销接口 `POST /admin/verify`：到店自提更新订单状态为已完成，电子卡券更新卡券状态为已使用，优惠券更新优惠券状态为已使用。
- 新增核销记录列表接口 `GET /admin/verify_records`，支持按类型过滤（到店自提/电子卡券）与关键词搜索。
- 新增 `user_coupons`、`verify_records` 表；新增幂等迁移脚本 `database/apply_verify_records.php`。
- 核销记录列表列：自提码/券码、提货人/会员、手机号、订单编号、核销员、核销日期、操作（查看订单）。

### v0.1.21 · 2026-08-18 · 新增评论管理
**范围**：运营后台 UI（`server/public/admin.html`）、评论 API（`server/app/controller/admin/Review.php`、`ReviewService.php`、`route/app.php`）、数据库（`server/database/install.sqlite.sql`、新增 `apply_goods_reviews.php`）。
**改动**：
- 新增「订单 > 评论管理」独立菜单入口，按截图还原评论列表。
- 列表列：用户头像、商品名称、评论内容、评论图片、星级、隐藏/显示开关、评论时间、回复内容、操作（回复/删除）。
- 新增后台评论列表 `/admin/reviews`、回复 `/admin/reviews/:id/reply`、切换隐藏 `/admin/reviews/:id/toggle_hidden`、批量隐藏显示 `/admin/reviews/batch_toggle_hidden`、批量删除 `/admin/reviews/batch_delete` 接口。
- 新增 `goods_reviews` 表；新增幂等迁移脚本 `database/apply_goods_reviews.php`。
- 页面功能：列表加载、关键词搜索、分页、全选批量操作；导出按钮占位。

### v0.1.20 · 2026-08-18 · 新增电子卡券管理
**范围**：运营后台 UI（`server/public/admin.html`）、卡券 API（`server/app/controller/admin/Card.php`、`CardService.php`、`route/app.php`）、数据库（`server/database/install.sqlite.sql`、新增 `apply_order_cards.php`）。
**改动**：
- 新增「订单 > 电子卡券」独立菜单入口，按截图还原：电子卡券列表 / 转赠记录 两个 tab。
- 新增后台卡券列表 `/admin/cards`、转赠记录 `/admin/cards/transfers`、卡券作废 `/admin/cards/:id/void` 接口。
- 新增 `order_cards`、`card_transfers` 表；新增幂等迁移脚本 `database/apply_order_cards.php`。
- 页面功能：列表加载、关键词搜索、分页、作废操作；导出按钮占位。

### v0.1.19 · 2026-08-18 · 新增订单售后管理：待退款/已退款/回收站
**范围**：运营后台 UI（`server/public/admin.html`）、订单 API（`server/app/controller/admin/Order.php`、`OrderService.php`、`route/app.php`）、数据库（`server/database/install.sqlite.sql`、新增 `apply_order_refund.php`）。
**改动**：
- 新增「订单 > 订单售后」独立菜单入口，按截图还原：全部 / 待退款 / 已退款 / 回收站 四个 tab。
- 新增后端售后订单列表接口 `GET /admin/orders_aftersale`，支持 tab 过滤与关键词搜索。
- 新增退款完成接口 `POST /admin/orders_aftersale/:id/refund`（标记 status=12 并记录退款金额/原因/时间）。
- 新增软删除/恢复接口 `POST /admin/orders_aftersale/soft_delete` 与 `POST /admin/orders_aftersale/restore`，实现回收站。
- 数据库 `orders` 表新增 `is_deleted`、`refund_apply_at`、`refund_finish_at`、`refund_reason`、`refund_amount` 字段；新增幂等迁移脚本 `database/apply_order_refund.php`。
- 页面对应功能：列表加载、分页、关键词搜索、全选/批量删除、批量恢复、单条退款弹窗、查看订单详情；导出按钮占位（后续接入）。

### v0.1.18.1 · 2026-08-18 · 会员/商品/小程序端增强 + 工程治理
**范围**：会员管理、商品规格/属性、小程序端底部导航配置、交付弹窗、调试清理、CHANGELOG 规范固化。
**改动**（汇总 `v0.1.18` 之后、本次统一发版的提交）：
- **会员管理模块**（`Member.php` / `MemberService.php` / `route/app.php` / `install.sqlite.sql` / `apply_member.php`）：后台会员 CRUD、会员分组管理、资产调整弹窗重设计、会员后台 UI 1:1 还原（列、资产弹窗、编辑表单、分配搜索/分页、双协议编辑器）；新增幂等迁移 `apply_member.php`。
- **商品规格管理**（`Goods.php` / `GoodsService.php` / `apply_goods_spec.php`）：商品规格增删改 + 修复 `modal show()` bug；新增迁移 `apply_goods_spec.php`。
- **商品属性管理**（`Goods.php` / `GoodsService.php` / `apply_goods_attr.php`）：商品属性增删改；新增迁移 `apply_goods_attr.php`。
- **小程序端**（`app.js` + `api/v1/Design.php` + `api/v1/Settings.php` + 路由）：支持底部导航图标动态配置；修复 `Settings` 控制器 500。
- **交付弹窗**：`admin.html` 交付相关弹窗布局与 z-index 优化。
- **工程治理**：清理调试临时文件、新增 `.gitignore`；新增本 `CHANGELOG.md` 更新文档并固化「每次提交 GitHub 前记录」规范（见 README「提交规范」、RELEASE.md「关键坑」）。

### v0.1.18 · 2026-08-18 · 订单管理后台增强：搜索/编辑/批量发货/代下单
**范围**：后台订单管理（`server/app/controller/admin/Order.php`、`OrderService.php`、`route/app.php`、SQLite 安装脚本）、运营后台 UI（`server/public/admin.html`）、幂等迁移脚本（`server/database/apply_orders.php`）。
**改动**：
- **订单服务层**（`OrderService.php`）：`adminList` 新增关键词搜索；`formatOrder` 透出交易号、订单类型/来源、会员优惠、余额抵扣、优惠券、买家留言、备注、物流公司与物流单号；新增 `save`（编辑订单：收件人/地址/留言/备注/实付）、`batchDelete`（批量删除）、`batchShip`（批量发货，支持快递与无需物流两种模式并补全物流公司与单号）、`create`（后台代下单）。
- **后台接口**（`route/app.php` + `admin/Order.php`）：新增 `order/save`、`order/batchDelete`、`order/batchShip`、`order/create` 路由与权限校验。
- **数据表升级**：`install.sqlite.sql` 的 `orders` 表新增 `trade_no / member_discount / balance_used / coupon_amount / order_type / source / buyer_message / remark / shipping_company / shipping_no` 字段。
- **迁移脚本**：新增 `server/database/apply_orders.php`，对已存在的 SQLite 库幂等补列，避免重复执行报错。
- **运营后台 UI**（`admin.html`）：订单列表升级——关键词搜索、详情/编辑弹窗、批量发货（含物流公司下拉与单号、无需物流开关）、批量删除、后台代下单弹窗、状态列与文案优化。
- **素材**：新增 banner 示例视频 `server/public/uploads/banner/20260814/...mp4`。
**兼容性**：`apply_orders.php` 为幂等迁移，可反复执行；新字段均有默认值，不影响旧订单展示。

### v0.1.17.5 · 2026-08-18 · 同城配送支持多规则、地图选点、阶梯运费、定时达时间设置
**范围**：`server/public/admin.html`（运营后台 · 同城配送配置）。
**改动**：同城配送由单规则升级为多规则；支持地图选点、阶梯运费、定时达时间设置。

### v0.1.17.4 · 2026-08-18 · 到店自提支持多自提点管理、地图选点、批量操作
**范围**：`server/public/admin.html`（运营后台 · 到店自提配置）。
**改动**：到店自提支持多自提点管理、地图选点、批量操作。

### v0.1.17.3 · 2026-08-18 · 新增配送设置：快递发货模板、到店自提、同城配送
**范围**：`server/public/admin.html`（运营后台 · 配送设置）。
**改动**：新增配送设置模块，含快递发货模板、到店自提、同城配送三类配送方式配置。

### v0.1.17.2 · 2026-08-18 · 店铺设置地图位置选择改用腾讯地图并支持点击选点/搜索
**范围**：`server/public/admin.html`（运营后台 · 店铺设置）。
**改动**：店铺设置的位置选择由旧地图改为腾讯地图，支持点击选点与关键词搜索。

### v0.1.17.1 · 2026-08-18 · 后台设置页统一 Linear 紫色风格并与菜单左对齐
**范围**：`server/public/admin.html` 后台设置页整体视觉。
**改动**：后台设置页统一 Linear 紫色风格，并与左侧菜单左对齐，视觉与基础设置（v0.1.17）保持一致。

### v0.1.17 · 2026-08-17 · 基础设置页视觉升级：套用 Linear 浅色设计系统
**范围**：`server/public/admin.html` 的「基础设置」`basePanel` 样式（其余面板不变）。
**改动**：按品牌设计风格专家（Linear）的浅色模式令牌重做——Inter 字体 + `cv01/ss03` 特性、weight 510/590 字重、近黑标题 + 紫调 `#5e6ad2` 强调、4 个 Tab 改为 Linear pill 分段导航、单选分段控件选中态用品牌靛蓝、输入框极淡背景 + 聚焦紫环、8px 栅格间距与极淡边框。字段顺序严格沿用截图结构（基础设置 → 商品设置 → 交易设置 → 安全设置）。

### v0.1.16 · 2026-08-17 · 新增「基础设置」并真正生效于小程序端
**范围**：新增后端 `store_settings` 配置表 + `SettingsService` + `admin/Settings`、`api/v1/Settings` 接口 + 路由；运营后台 `basePanel`（基础/商品/交易/安全 4 个 Tab）；小程序 `utils/settings.js` 全局拉取，并在首页、商品详情、下单确认页落地生效。

**基础设置字段（与截图 Tab 对应）**
- 基础设置：站点状态（开启/打烊）、打烊文案、站点名称/Logo、客服类型（在线/电话/微信）、客服电话/微信号、首页悬浮按钮、门店地图（经纬度/地址/名称）。
- 商品设置：购买权限（所有人/登录用户/有会员卡）、详情页展示项（销量/库存/划线原价/评价）、加购与立即购买按钮。
- 交易设置：未支付订单自动取消分钟数、下单需绑定手机号、允许评价、可用支付方式（微信/支付宝）、支付后动作。
- 安全设置：登录图形验证码、下单图形验证码、滑块验证、风控等级。

**真正影响小程序行为（非仅保存）**
- 站点状态=打烊 → 首页全屏遮罩拦截（`index` 站点打烊层）。
- 购买权限 → 下单确认页拦截无权限用户（登录/会员卡）。
- 客服类型 → 商品详情「客服」按钮按类型调起电话/复制微信/在线提示；「门店」按钮 `wx.openLocation` 按配置定位。
- 商品详情开关 → 销量/库存/划线原价/评价、加购/立即购买按钮按设置显隐。
- 交易设置 → 下单需手机号校验；下单图形验证码（开启时输入校验）。
- 配置下发：小程序启动经 `/api/v1/settings` 拉取并缓存到 `globalData.settings`，各页读取生效。

**数据/兼容**
- 新表 `store_settings`（MySQL + SQLite 安装脚本均已包含）；`SettingsService` 首次访问自动建表，旧库零迁移。
- 读接口合并 `SettingsService::defaults()`，前端永远拿到完整结构。

### v0.1.15 · 2026-08-17 · 精选推荐「拍平」：每个模块成为首页独立可排序区块
**范围**：运营后台 `server/public/admin.html`；后端接口、小程序 `diy-render` 无需改动（数据结构兼容）。

**改动**
- 数据模型重构：原「精选推荐」是一个 `goods_group` 组件、内部含 `modules` 数组（模块只能在该区块内排序）。现把每个推荐模块**拍平**为 `designConfig.components` 里独立的一级 `goods_group` 组件（每个 `props.modules` 仅 1 项）。
- 首页顺序由组件数组顺序决定 → 每个推荐模块可在「首页布局」里任意拖拽到轮播上/分类下；上/下架改用 `props.hidden`（按组件索引），逻辑与轮播/导航/分类完全一致。
- 「首页布局」面板每个 `goods_group` 行直接显示其标题、带「编辑」按钮；新增「＋ 添加推荐模块」按钮（在布局面板与该模块管理列表均可添加）。
- 模块编辑弹窗字段语义更新：「区块标题（首页展示）」写入 `props.title`（小程序大标题），「副标题（可选）」写入模块 `title`。
- 旧数据兼容：加载首页配置时 `normalizeHomeComponents()` 自动把含多个子模块的 `goods_group` 拆成多个独立组件，旧数据零迁移成本。
- 后端与小程序端零改动：`/design/home/save|publish` 仅整份落库，`diy-render` 仍按 `props.modules`（长度 1 同样工作）渲染。

### v0.1.14 · 2026-08-17 · 新增「首页布局」菜单（拖拽排序 + 模块显隐）
**范围**：运营后台 `server/public/admin.html`、小程序 `miniprogram/components/diy-render/diy-render.js`。

**改动**
- 在「我的模板」下新增二级菜单「首页布局」，集中管理首页各模块的顺序与显隐。
- 顶部模块（轮播设置 / 魔方导航 / 精选推荐 / 分类导航）支持拖拽排序，顺序即首页从上到下展示顺序。
- 每个模块支持「在首页显示」开关：关闭则下架该模块（`props.hidden`）。
- 「精选推荐」展开后列出其内部各子模块，同样支持拖拽排序与单独上/下架首页（子模块 `hidden`），并可一键「编辑」跳转配置商品与标题。
- 保存/发布复用首页装修接口，整份 `designConfig` 落库；小程序端 `diy-render` 过滤 `hidden` 的组件与子模块。

### v0.1.13 · 2026-08-17 · 「分类导航」配置表单设计统一为 Linear 风格
**范围**：运营后台 `server/public/admin.html`。

**改动**
- 分类导航的「标题 / 每行列数 / 来源」改为 Linear 风格行内表单控件，三个字段底部对齐、等高。
- 来源由原生下拉改为分段控制器（Segmented Control）：「全部分类 / 指定分类」，与 Banner、入口图标等区域的风格统一。
- 标题和每行列数使用 `.lin-input`，指定分类多选使用统一样式的 `.lin-multi-select`。

### v0.1.12 · 2026-08-17 · 精选推荐弹窗层级修复 + 模块可自由增删
**范围**：运营后台 `server/public/admin.html`、后端 `server/app/service/PageService.php`、种子 `server/database/migrate_design.php`、小程序 `miniprogram/utils/mock.js`。

**改动**
- 修复「精选推荐」内点「添加商品」时，商品选择弹窗被模块编辑弹窗遮挡的问题（`#goodsPickerModal` 层级提升至 110，置于所有模块弹窗之上）。
- 商品选择弹窗筛选区重排：分类下拉、搜索输入框、搜索按钮等高（36px），「搜索」标签与输入框/按钮同一行不再换行。
- 推荐模块取消固定 9 个限制：默认改为 4 个，模块列表每项新增「删除」按钮；底部新增「+ 添加模块」按钮（自动递增 `id`），拖拽排序/编辑/保存逻辑保持不变。

### v0.1.11 · 2026-08-17 · 「精选推荐」重构为「9 个推荐模块」（每模块独立名称/标题/商品）
**范围**：运营后台 `server/public/admin.html`、后端 `server/app/service/PageService.php`、种子 `server/database/migrate_design.php`、小程序 `miniprogram/utils/mock.js`、`miniprogram/components/diy-render/*`。

**改动**
- 数据结构由「9 个商品卡位」改为「9 个推荐模块」：`props.modules = [{id,name,title,goods:[{id,title,cover,price}]}]`。
- 后台「精选推荐」表单变为 9 个模块行，可拖拽排序、点击「编辑」弹出模块编辑窗：设置模块名称（后台标识）、展示标题（用户可见）、从该模块内多次「添加商品」多选加入；已选商品可单独移除。
- 小程序端：`goods_group` 渲染为「区域大标题 + N 个模块（每个带展示标题的小卡片块 + 商品网格）」，空模块自动不展示，方便后期按首页顺序整体排序各模块。
- 兼容旧数据：无 `modules` 字段时仍按原 `source/category_id/show_count` 逻辑展示。

### v0.1.10 · 2026-08-17 · 「精选好物」升级为卡片式「精选推荐」（9 商品卡位）
**范围**：运营后台 `server/public/admin.html`、后端 `server/app/service/PageService.php`、种子 `server/database/migrate_design.php`、小程序 `miniprogram/utils/mock.js`、`miniprogram/components/diy-render/*`。

**改动**
- 板块「精选好物」更名为「精选推荐」，组件类型保持 `goods_group`（兼容旧数据），数据结构由「来源/分类/展示数量」改为 **9 个固定商品卡位**。
- 后台编辑：改为 3×3 商品卡片网格，每个卡位可点击选择商品、拖拽调整顺序、一键清空；每行数量 2/3/4/5 可选。
- 小程序渲染层：若配置存在 `props.items` 则按卡位渲染指定商品，否则回退到旧的智能推荐/指定分类逻辑；商品卡片使用 `colWidth` 动态列宽。
- 设计：延续 Linear 浅色风格（圆角 12–16rpx、轻阴影、主色 #5e6ad2）。

### v0.1.9 · 2026-08-17 · 模板菜单新增「底部导航」二级菜单
**范围**：运营后台 `server/public/admin.html` + 后端 `server/app/service/PageService.php`、`server/app/controller/admin/Design.php`、`server/route/app.php`。

**新增功能**
- 后台左侧菜单「店铺 > 我的模板」下新增「底部导航」二级菜单。
- 底部导航配置页：
  - 支持「常用 / 样式」Tab 切换。
  - 菜单项列表展示未选中/选中两套图标、名称，支持拖拽排序。
  - 菜单数量限制：最少 2 个，最多 5 个；少于 2 个时禁止保存/发布，达到 5 个时隐藏添加按钮。
- 底部导航编辑弹窗：
  - 左侧卡片展示所有菜单项（带序号、两套图标），支持拖拽排序、点击选中。
  - 右侧表单可编辑名称、上传未选中/选中图标、设置链接（page/goods/category/activity）。
- 后端支持 `/admin/design/bottom_nav` 查询、`/admin/design/bottom_nav/save` 保存草稿、`/admin/design/bottom_nav/publish` 发布上线，默认返回首页/分类/购物车/我的 4 项兜底配置。

**设计**
- 遵循项目已有的 Linear 浅色设计系统（圆角、阴影、主色 #5e6ad2、12px/13px/14px 字号层级）。

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

**Git**：仓库默认分支 `master`，tag `v0.1`（commit `bf5954f`）。根 `.gitignore` 忽略 `.codebuddy/`、IDE；`server/.gitignore` 忽略 `vendor/`、`runtime/`、`.env`、`*.sqlite`、`composer.phar`。
