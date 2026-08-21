# B2C 小程序前端（原生）

## 运行
1. 微信开发者工具 → 导入项目 → 选择本目录（`miniprogram/`）。
2. AppId 选「测试号」即可（项目已配 `touristappid`）。
3. 默认 `config.js` 中 `useMock:true`，无需后端即可体验完整下单闭环。

## 目录
- `config.js`：全局配置（`useMock` / `baseUrl`，端口约定 **8899**）
- `utils/request.js`：统一请求层（Mock / 真实双模式，统一 JSON 信封）
- `utils/auth.js`：登录态（token 缓存 + 自动 Mock 登录）
- `utils/mock.js`：内存 Mock 数据（与后端种子一致）
- `components/diy-render/`：首页 DIY 装修渲染组件（banner / nav_grid / goods_group）
- `pages/`：index 首页、category 分类、goods 商品、cart 购物车、order 确认订单、pay 支付结果、member 我的

## 切真实后端
改 `config.js`：`useMock:false`，`baseUrl:'http://127.0.0.1:8899/api/v1'`（本地）或 `'https://你的域名/api/v1'`（生产）。
请求层会自动带 `Authorization: Bearer <token>`。

## 设计规范
- 主色 `#FF6B35`（橙）、配送绿 `#00B86B`，已在 `app.wxss` 以 CSS 变量声明。
- 尺寸统一用 `rpx`，适配多屏；底部 tabBar 文字型（无需图标二进制）。
- 整体设计语言与后台的紫色 Linear 风格独立：小程序端主题见 `app.wxss`，全站 UI 规范见根目录 `UI设计规范.md`。
