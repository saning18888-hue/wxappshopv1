# 项目 UI 设计规范（后台管理页 + 小程序）

> 目的：统一全项目界面风格，杜绝"死板、拥挤、简陋"的原始控件外观。
> 适用范围：`server/public/admin.html` 后台页、`miniprogram/` 小程序，及后续新增页面。
> 所有视觉变量基于页面/小程序已有主题变量（如 `--primary`、`--border`、`--radius*`、`--text*`、`--surface`），不要写死颜色。

---

## 1. 间距与呼吸感（最重要）

- 区块（卡片/设置项）之间 `margin-bottom: 14~18px`；同一容器内子项间距 `gap: 8~12px`。
- **文字标签与控件/图标之间必须留白**：
  - 标签与左侧图标：`gap: 9px`
  - 选项图标（如单选圆点）与选项文字：`gap: 8px`
  - 设置项「名称列」与「操作列」：`gap: 20~22px`
- 禁止让 `<label>` 文字紧贴 `<input>` / `radio` 图标，原始裸控件（无边框、无间距）一律视为不合格。

## 2. 表单控件（后台 admin.html）

- 输入框 `.input`：白底 + `1px solid var(--border)` + `border-radius: 8px` + 内边距 `10~12px`；**必须有 hover（边框变深）与 focus（主色边框 + 3px 主色光晕）态**。
- 下拉框 `select.input`：必须 `appearance:none` 并加自定义 SVG 箭头，不要出现浏览器原生丑箭头。
- **布尔/二选一项（显示/隐藏、推荐/不推荐）禁止用裸 radio**，统一用「分段控件 `.a-seg`」：
  - 外层浅灰底圆角容器，内部每个选项为可点击胶囊；选中态白底 + 主色文字 + 圆点高亮 + 轻阴影。
  - 结构参考基础设置的 `.a-set` / `.a-seg` / `.a-set-name`。
- 字段间距 `.a-field { margin-bottom: 18px }`；基础设置等密集场景可放大到 `26px`。

## 3. 图标使用

- 设置项、分区标题等需配一个 16px 线性图标（SVG，`stroke=currentColor`，主色），图标与文字 `gap: 9px`。
- 选项内用 9px 圆点 `.dot` 表示选中态，与文字 `gap: 8px`。
- 小程序端对应使用 `icon` 组件或同风格线性图标，保持尺寸与间距一致。

## 4. 表格

- 表格外层用 `.article-table-wrap` 包裹：`1px` 边框 + 圆角 + `overflow-x:auto`，表头与数据分离。
- 状态用 `.badge`（`green`/`gray`），操作按钮用 `.btn.sm`，禁止未定义类（如 `.tag`、`.btn.xss`）导致回退原生大按钮。
- 封面图、主次信息（标题 + 副行作者·浏览量）要有视觉层次，不要平铺。

## 5. 弹窗与布局

- 编辑弹窗用两栏 `.a-modal-grid`（1.5fr / 1fr）：左主表单，右 `.a-side` 封面与展示（主色浅底卡片）。
- 内容编辑器 `.a-full` 跨整行；窄屏（≤680px）退化为单栏。

### 5.1 弹窗关闭按钮（统一规范，所有弹窗必须遵循）

> 所有弹窗（`.modal-card` / 旧版 `.modal-head` 结构）的右上角关闭按钮，**统一使用圆形灰底 × 样式**，class 固定为 `close`，不要使用 `modal-close` 等其它类名，也不要用裸 `×` 文本。

- 结构：弹窗头部放 `<span class="close" onclick="closeXxx()">&times;</span>`（`&times;` 即 ×）。
- 样式（已在 `admin.html` 的 `.modal-header .close` 定义，全站复用，**禁止重复写死，直接复用该类**）：
  - 尺寸 `28px × 28px`，`border-radius:50%`，`border:0`
  - 背景 `background:#f2f3f5`（中性浅灰，非主题变量的极个别允许值之一）
  - 文字色 `color:var(--text-secondary)`，字号 `18px`，`line-height:1`，Flex 居中
  - 光标 `cursor:pointer`，`transition:all .15s`
  - hover：`background:#eee;color:var(--text)`（轻微加深 + 文字转深）
- 位置：弹窗头部 flex 布局右侧（`justify-content:space-between`），与标题同行。

### 5.2 多选/勾选项（checkbox 规范，v0.1.52 起强制）

> 背景：推送选择等处曾用 `appearance:none` 自绘方框 + `::after` 模拟对勾，导致"框太大 / 对勾偏位 / 截断"反复返工。**统一改用浏览器原生 checkbox + `accent-color`**。

- 结构：`<label class="radio-inline"><input type="checkbox"><span>文案</span></label>`，选中时 `input:checked + span{color:var(--primary)}`。
- 样式：`width:14px;height:14px;margin:0;flex:none;accent-color:var(--primary)`，**禁止** `appearance:none`、禁止自绘对勾、禁止写死 12px 以下尺寸。
- 布局：多选项用 `flex flex-wrap`，每项 `flex:0 0 calc(33.333% - 10px)`（每行 3 个；长文案优先保证不截断，不用 `overflow:hidden`）。
- 参照实现：`admin.html` 的 `.sms-subscribe`（v0.1.53 已定型）。

## 6. 颜色与一致性

- 只用主题变量，禁止写死灰/蓝值（除极个别 hover 边框 `#c4c8d4` 等中性灰）。
- 主操作按钮 `.btn.primary` 带轻投影；危险操作用 `.btn.danger`。
- **后台主色为紫色 `--primary:#5e6ad2`**（Linear 风格）；**小程序端主色为橙色 `#FF6B35`**（见 `app.wxss`）。两端各自遵循本端主题变量，不混用。
- 小程序端遵循 `app.wxss` 中的主题色与圆角变量，保持两端观感统一。

## 7. 自检清单（提交前过一遍）

- [ ] 是否还有原生 `<select>` 箭头 / 原生大按钮？
- [ ] 标签文字与图标、选项之间是否有 ≥8px 间距？
- [ ] 二选一项是否用了分段控件而非裸 radio？
- [ ] hover / focus 态是否齐全？
- [ ] 颜色是否全部来自主题变量？
- [ ] 弹窗关闭按钮是否统一为圆形灰底 `class="close"`，无裸 `×` / 无 `modal-close`？
- [ ] 多选/勾选项是否用原生 checkbox + `accent-color:var(--primary)`，无 `appearance:none` 自绘？
- [ ] 改完 JS 后用 `node --check` 校验脚本，避免整页挂掉。
