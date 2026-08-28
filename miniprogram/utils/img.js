// 图片地址补全：后端返回的头像/商品图等多为 /uploads/... 相对路径
// 这里按当前 config.baseUrl 自动拼成完整可访问地址；已是完整 http(s) 的原样返回。
const config = require('../config');

const ASSET_BASE = (config.baseUrl || '').replace(/\/api\/v1$/, '');

function asset(path) {
  if (!path || typeof path !== 'string') return path;
  if (path.indexOf('http://') === 0 || path.indexOf('https://') === 0) return path;
  // 后端返回的相对路径可能带或不带前导斜杠，统一补全
  if (path.indexOf('/') !== 0) path = '/' + path;
  return ASSET_BASE + path;
}

module.exports = { asset, ASSET_BASE };
