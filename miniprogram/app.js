const auth = require('./utils/auth');
const settings = require('./utils/settings');
const api = require('./utils/request');
const tracker = require('./utils/tracker');

// 后台底部导航 link.id -> 小程序 tabBar pagePath 映射
const BOTTOM_NAV_PAGE_MAP = {
  home: 'pages/index/index',
  category: 'pages/category/category',
  cart: 'pages/cart/cart',
  user: 'pages/member/member',
  member: 'pages/member/member',
};

// 与原生 tabBar（app.json）顺序保持一致的 pagePath 列表
const TAB_BAR_PAGES = [
  'pages/index/index',
  'pages/category/category',
  'pages/cart/cart',
  'pages/member/member',
];

function downloadFile(url) {
  return new Promise((resolve) => {
    if (!url) return resolve('');
    wx.downloadFile({
      url,
      success: (res) => resolve(res.tempFilePath || ''),
      fail: () => resolve(''),
    });
  });
}

function applyBottomNav() {
  api.get('/bottom_nav')
    .then((cfg) => {
      const comp = cfg && cfg.components && cfg.components.find((c) => c.type === 'bottom_nav');
      const items = (comp && comp.props && comp.props.items) || [];
      items.forEach((it) => {
        const pagePath = BOTTOM_NAV_PAGE_MAP[it.link && it.link.id];
        if (!pagePath) return;
        const index = TAB_BAR_PAGES.indexOf(pagePath);
        if (index === -1) return;
        Promise.all([downloadFile(it.icon), downloadFile(it.active_icon)])
          .then(([iconPath, selectedIconPath]) => {
            const setCfg = { index };
            if (it.name) setCfg.text = it.name;
            if (iconPath) setCfg.iconPath = iconPath;
            if (selectedIconPath) setCfg.selectedIconPath = selectedIconPath;
            wx.setTabBarItem(setCfg);
          });
      });
    })
    .catch(() => {});
}

App({
  globalData: {
    brand: { primary: '#FF6B35', green: '#00B86B' },
    // 结算中间数据：由购物车/立即购买写入，确认订单页读取
    pendingCheckout: null,
    // 基础设置（全局生效，见 utils/settings.js）
    settings: null,
  },
  // 购物车数量变更事件总线
  _cartCountSubs: [],
  onCartCountChange(cb) {
    if (typeof cb === 'function') this._cartCountSubs.push(cb);
    return () => {
      this._cartCountSubs = this._cartCountSubs.filter((f) => f !== cb);
    };
  },
  emitCartCount(count) {
    (this._cartCountSubs || []).forEach((cb) => {
      try { cb(count); } catch (e) {}
    });
  },
  // 将主题色应用到原生导航栏 / 底部导航（复用，避免只写死 onLaunch 一次）
  applyThemeToNative(themeColor) {
    if (!themeColor) return;
    this.globalData.brand.primary = themeColor;
    // 同步原生顶部导航栏背景色（不再写死橙色）
    wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: themeColor });
    // 同步原生底部导航选中色
    wx.setTabBarStyle({ selectedColor: themeColor });
  },
  // 拉取并应用最新基础设置
  refreshSettings(force) {
    return settings.fetchSettings(force).then((s) => {
      this.globalData.settings = s;
      // 应用主题色（基础设置 → 主题色设计）
      if (s && s.theme_color) this.applyThemeToNative(s.theme_color);
      return s;
    });
  },
  onLaunch() {
    // 流量埋点：冷启动登记访客会话
    tracker.registerVisitor();
    // 页面曝光埋点：监听「路由完成」事件自动上报（用官方事件而非重写 Page，
    // 避免微信开发者工具启动时报 appLaunch with non-empty page stack）
    if (wx.onAppRouteDone) {
      wx.onAppRouteDone(() => {
        try {
          const pages = getCurrentPages();
          const cur = pages[pages.length - 1];
          const route = (cur && cur.route) || '';
          if (route) tracker.trackPage(route);
        } catch (e) {}
      });
    }
    // 自动登录（Mock 模式直接换 token）
    auth.ensureLogin();
    // 冷启动：首次强制拉取最新基础设置并应用主题色
    this.refreshSettings(true);
    // 拉取后台底部导航配置并应用到原生 tabBar
    applyBottomNav();
  },
  onShow() {
    // 从后台切回前台：强制重新拉取设置，确保后台修改的主题色及时生效
    if (this.globalData.settings) this.refreshSettings(true);
  },
});
