const api = require('../../utils/request');
const settings = require('../../utils/settings');

Page({
  data: { components: [], goodsList: [], cats: [], loading: true, siteClosed: false, closeReason: '', themeColor: '#FF6B35' },

  onLoad() {
    this.load();
  },

  onShow() {
    this.applyTheme();
    this.checkSiteStatus();
  },

  // 应用主题色（基础设置 → 主题色设计）
  applyTheme() {
    settings.fetchSettings(true).then((s) => {
      this.setData({ themeColor: s.theme_color || '#FF6B35' });
    });
  },

  // 站点状态：关闭则整页拦截（基础设置 → 站点状态）
  checkSiteStatus() {
    settings.fetchSettings(true).then((s) => {
      this.setData({ siteClosed: s.site_status === 'close', closeReason: s.close_reason || '' });
    });
  },

  load() {
    Promise.all([
      api.get('/home'),
      api.get('/goods', { page_size: 20 }),
      api.get('/categories'),
    ])
      .then(([home, goods, cats]) => {
        this.setData({
          components: home.components,
          goodsList: goods.list,
          cats: cats.list,
          loading: false,
        });
        this.checkSiteStatus();
      })
      .catch(() => this.setData({ loading: false }));
  },

  onSearch(e) {
    const kw = (e.detail.value || '').trim();
    if (!kw) return;
    wx.navigateTo({ url: '/pages/goods/list/list?keyword=' + encodeURIComponent(kw) });
  },
});
