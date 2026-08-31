# 状态灯（AI 主动控灯）约定

本仓库使用桌面悬浮状态灯（`D:\Project\ai-indicator`）显示 AI 工作状态。
由于 **CodeBuddy IDE 版不触发工具级 / Notification hook**（仅触发 `UserPromptSubmit`/`SessionStart` 会话级事件），
灯色由 AI **主动写入** `D:\Project\wxappshopv1\server\.codebuddy\ai_status.json` 来控制
（`indicator.py` 已改为优先读取该文件，不被 hooks 时间戳压制）。

## 规则（AI 必须遵守）
1. 每次准备调用**可能需用户批准**的工具（`delete_file` / `execute_command` / 其他需确认操作）**之前**，
   先 `write_to_file` 把状态文件写为：
   ```json
   {"state":"need_confirm","message":"<一句话说明>","source":"ai-auto","session_id":"","updated_at":"<当前时间>"}
   ```
   → 灯变黄（用户「需要确认」时可见）。
2. 工具成功完成后，写：
   ```json
   {"state":"done","message":"<说明>","source":"ai-auto","session_id":"","updated_at":"<当前时间>"}
   ```
   → 灯变绿；若仍需继续处理可写 `{"state":"working",...}` → 灯变蓝。
3. 该状态文件已加入 `server/.gitignore`，**不要入库**。

## 状态色对照
| 色 | state | 含义 |
|---|---|---|
| 蓝 | working | 处理中 |
| 绿 | done | 完成 |
| 黄 | need_confirm | 待你确认 |
| 红 | error / failed | 出错 |
| 灰 | idle | 空闲 |
