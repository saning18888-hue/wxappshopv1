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

  addCart(e) {
    const id = e.currentTarget.dataset.id;
    api.get('/goods/' + id)
      .then((detail) => {
        const skus = detail.skus || [];
        if (!skus.length) {
          wx.showToast({ title: '该商品暂无规格', icon: 'none' });
          return Promise.reject(new Error('no sku'));
        }
        const sku = skus[0];
        return api.post('/cart', { sku_id: sku.id, quantity: 1 });
      })
      .then(() => wx.showToast({ title: '已加入购物车', icon: 'success' }))
      .catch((err) => {
        if (err && err.message === 'no sku') return;
        wx.showToast({ title: err.message || '添加失败', icon: 'none' });
      });
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/goods/detail/detail?id=' + e.currentTarget.dataset.id });
  },
});
