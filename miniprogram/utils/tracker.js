// 流量埋点工具：在小程序端采集访客会话与页面曝光，上报到后端 /api/v1/track/*
// 数据用于后台「网站分析 / 交易分析(访客) / 商品分析(浏览)」。
const api = require('./request');

const SESSION_KEY = 'track_session_id';
const VISITED_KEY = 'track_visited_before';

// 路由 -> 网站分析页面标签（与后台 seed 标签保持一致，便于统计口径对齐）
const PAGE_LABELS = {
  'pages/index/index': '首页',
  'pages/category/category': '商品分类',
  'pages/goods/detail/detail': '商品详情',
  'pages/goods/list/list': '搜索',
  'pages/cart/cart': '购物车',
  'pages/order/confirm/confirm': '确认订单',
  'pages/order/list/list': '我的订单',
  'pages/order/detail/detail': '订单详情',
  'pages/address/address': '收货地址',
  'pages/address-form/address-form': '地址编辑',
  'pages/logistics/logistics': '物流信息',
  'pages/pay/result/result': '支付结果',
  'pages/member/member': '会员中心',
  'pages/aftersale/apply/apply': '售后申请',
  'pages/aftersale/list/list': '售后列表',
  'pages/webview/webview': '网页',
};

function getSessionId() {
  let sid = wx.getStorageSync(SESSION_KEY);
  if (!sid) {
    sid = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
    wx.setStorageSync(SESSION_KEY, sid);
  }
  return sid;
}

function labelOf(route) {
  return PAGE_LABELS[route] || route || '未知页面';
}

let sessionId = null;
let visitedBefore = false;
let lastTrackTs = 0;
let visitorSent = false;

function ensureSession() {
  if (!sessionId) {
    sessionId = getSessionId();
    visitedBefore = !!wx.getStorageSync(VISITED_KEY);
    lastTrackTs = Date.now();
  }
}

// 冷启动：登记一次访客会话（is_new 区分新老访客）
function registerVisitor() {
  ensureSession();
  if (visitorSent) return;
  visitorSent = true;
  const isNew = visitedBefore ? 0 : 1;
  api.post('/track/visitor', { session_id: sessionId, is_new: isNew })
    .then(() => {
      if (!visitedBefore) wx.setStorageSync(VISITED_KEY, 1);
    })
    .catch(() => {});
}

// 页面曝光：每次 onShow 调用，上报页面标签与停留时长（秒）
function trackPage(route) {
  ensureSession();
  const now = Date.now();
  let stay = 0;
  if (lastTrackTs > 0) {
    stay = Math.max(0, Math.round((now - lastTrackTs) / 1000));
  }
  lastTrackTs = now;
  const page = labelOf(route);
  api.post('/track/page_view', { session_id: sessionId, page, stay_time: stay })
    .catch(() => {});
}

module.exports = { registerVisitor, trackPage, labelOf };
