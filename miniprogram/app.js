const auth = require('./utils/auth');
const settings = require('./utils/settings');

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
    settings.fetchSettings().then(() => {
      this.globalData.settings = settings.getSettings();
    });
  },
});
