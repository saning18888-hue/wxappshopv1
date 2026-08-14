const auth = require('./utils/auth');

App({
  globalData: {
    brand: { primary: '#FF6B35', green: '#00B86B' },
    // 结算中间数据：由购物车/立即购买写入，确认订单页读取
    pendingCheckout: null,
  },
  onLaunch() {
    // 自动登录（Mock 模式直接换 token）
    auth.ensureLogin();
  },
});
