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
