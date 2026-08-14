const api = require('../../utils/request');

Page({
  data: { components: [], goodsList: [], cats: [], loading: true },

  onLoad() {
    this.load();
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
      })
      .catch(() => this.setData({ loading: false }));
  },

  onSearch(e) {
    const kw = (e.detail.value || '').trim();
    if (!kw) return;
    wx.navigateTo({ url: '/pages/goods/list/list?keyword=' + encodeURIComponent(kw) });
  },
});
