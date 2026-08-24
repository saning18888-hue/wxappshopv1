const api = require('../../utils/request');
const settings = require('../../utils/settings');
const app = getApp();

Page({
  data: { list: [], total: 0, themeColor: '#FF6B35' },

  onShow() {
    this.applyTheme();
    this.load();
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
  },

  // 应用主题色（基础设置 → 主题色设计）
  applyTheme() {
    settings.fetchSettings(true).then((s) => {
      this.setData({ themeColor: s.theme_color || '#FF6B35' });
    });
  },

  load() {
    api.get('/cart')
      .then((res) => {
        const total = res.list.reduce((s, i) => s + i.price * i.quantity, 0);
        this.setData({ list: res.list, total: Math.round(total * 100) / 100 });
      })
      .catch(() => {});
  },

  changeQty(e) {
    const id = e.currentTarget.dataset.id;
    const delta = Number(e.currentTarget.dataset.delta);
    const item = this.data.list.find((i) => i.id === id);
    if (!item) return;
    const qty = item.quantity + delta;
    if (qty <= 0) {
      this.remove(id);
      return;
    }
    if (qty > item.stock) {
      wx.showToast({ title: '超过库存', icon: 'none' });
      return;
    }
    api.put('/cart/' + id, { quantity: qty }).then(() => this.load());
  },

  remove(id) {
    wx.showModal({
      title: '提示',
      content: '确定移除该商品？',
      success: (r) => {
        if (r.confirm) api.del('/cart/' + id).then(() => this.load());
      },
    });
  },

  removeTap(e) {
    this.remove(e.currentTarget.dataset.id);
  },

  checkout() {
    const items = this.data.list.map((i) => ({ sku_id: i.sku_id, quantity: i.quantity }));
    if (!items.length) {
      wx.showToast({ title: '购物车是空的', icon: 'none' });
      return;
    }
    app.globalData.pendingCheckout = { items };
    wx.navigateTo({ url: '/pages/order/confirm/confirm' });
  },
});
