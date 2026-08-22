// 全局配置：Mock 模式 / 真实 API 地址
//
// 两种运行模式：
//  A) 纯前端演示（默认，无需后端）：useMock = true
//     所有接口走本地 Mock 数据，开发者工具导入即可体验完整下单流程。
//  B) 联调本地后端（ThinkPHP + SQLite 已搭好）：useMock = false
//     1) 后端已启动：php think run -H 127.0.0.1 -p 8899（项目统一端口 8899，见 RELEASE.md）
//     2) 把下面 useMock 改为 false，baseUrl 保持下面的本地地址即可。
//     3) 开发者工具 → 详情 → 本地设置，勾选「不校验合法域名」。
//     注意：用真机预览时需把 127.0.0.1 换成电脑局域网 IP（如 http://192.168.x.x:8899/api/v1）。
module.exports = {
  useMock: false,
  // 本地后端地址（php think run 默认端口 8899）
  baseUrl: 'http://127.0.0.1:8899/api/v1',
  // 服务器域名示例：https://api.example.com/api/v1
};
