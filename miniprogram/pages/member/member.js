const api = require('../../utils/request');
const auth = require('../../utils/auth');
const settings = require('../../utils/settings');

Page({
  data: { user: null, avatarChar: '客', orders: [], themeColor: '#FF6B35' },

  onShow() {
    const u = auth.getUser();
    this.setData({ user: u, avatarChar: u && u.nickname ? u.nickname[0] : '客' });
    settings.fetchSettings().then((s) => {
      this.setData({ themeColor: s.theme_color || '#FF6B35' });
    });
    api.get('/order', { page: 1, page_size: 5 })
      .then((res) => this.setData({ orders: res.list || [] }))
      .catch(() => {});
  },

  goOrders() {
    wx.showToast({ title: '全部订单开发中', icon: 'none' });
  },
});
