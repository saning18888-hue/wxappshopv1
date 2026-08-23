const auth = require('./utils/auth');
const settings = require('./utils/settings');
const api = require('./utils/request');

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
  onLaunch() {
    // 自动登录（Mock 模式直接换 token）
    auth.ensureLogin();
    // 拉取基础设置并缓存到全局，供各页面读取
    settings.fetchSettings().then((s) => {
      this.globalData.settings = s;
      // 应用主题色（基础设置 → 主题色设计）
      if (s && s.theme_color) {
        this.globalData.brand.primary = s.theme_color;
        // 同步原生底部导航选中色
        wx.setTabBarStyle({ selectedColor: s.theme_color });
      }
    });
    // 拉取后台底部导航配置并应用到原生 tabBar
    applyBottomNav();
  },
});
