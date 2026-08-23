// 基础设置：全局读取，与后端 SettingsService::defaults() 保持一致
const api = require('./request');

const DEFAULTS = {
  site_status: 'open',
  close_reason: '店铺暂时休息中，请稍后再来~',
  store_name: 'B2C 商城',
  store_logo: '',
  theme_color: '#FF6B35',
  service_type: 'online',
  service_phone: '',
  service_wechat: '',
  show_float_button: true,
  map_lng: 116.404,
  map_lat: 39.915,
  map_address: '北京市朝阳区',
  map_name: 'B2C 商城（总店）',
  buy_permission: 'all',
  show_sales: true,
  show_stock: true,
  show_original_price: true,
  show_comment: true,
  cart_button: true,
  buy_button: true,
  auto_cancel_minutes: 30,
  require_mobile: true,
  allow_comment: true,
  pay_methods: ['wechat'],
  pay_after_action: 'none',
  captcha_login: false,
  captcha_order: false,
  slider_verify: true,
  risk_control: 'low',
};

let cache = null;
let fetching = null;

function getDefaults() {
  return JSON.parse(JSON.stringify(DEFAULTS));
}

// 拉取设置（force=true 时绕过模块级缓存强制重新请求，保证后台修改能及时生效）
function fetchSettings(force) {
  if (cache && !force) return Promise.resolve(cache);
  if (fetching) return fetching;
  fetching = api
    .get('/settings')
    .then((data) => {
      cache = Object.assign(getDefaults(), data || {});
      const app = getApp();
      if (app && app.globalData) app.globalData.settings = cache;
      return cache;
    })
    .catch(() => {
      cache = getDefaults();
      return cache;
    })
    .finally(() => {
      fetching = null;
    });
  return fetching;
}

// 同步读取（优先用已缓存/全局的，否则用默认值）
function getSettings() {
  const app = getApp();
  if (app && app.globalData && app.globalData.settings) return app.globalData.settings;
  return cache || getDefaults();
}

module.exports = { DEFAULTS, fetchSettings, getSettings };
