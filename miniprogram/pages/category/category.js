const api = require('../../utils/request');
const settings = require('../../utils/settings');

Page({
  data: { cats: [], activeId: 0, list: [], loading: false, themeColor: '#FF6B35' },

  onLoad() {
    settings.fetchSettings(true).then((s) => {
      this.setData({ themeColor: s.theme_color || '#FF6B35' });
    });
    api.get('/categories').then((res) => {
      const cats = res.list || [];
      const activeId = cats[0] ? cats[0].id : 0;
      this.setData({ cats, activeId });
      this.loadGoods(activeId);
    });
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
  },

  switchCat(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ activeId: id, list: [] });
    this.loadGoods(id);
  },

  loadGoods(categoryId) {
    if (!categoryId) return;
    this.setData({ loading: true });
    api.get('/goods', { category_id: categoryId, page: 1, page_size: 50 })
      .then((res) => {
        this.setData({ list: res.list || [], loading: false });
      })
      .catch(() => {
        this.setData({ loading: false });
      });
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/goods/detail/detail?id=' + e.currentTarget.dataset.id });
  },
});
