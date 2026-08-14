const api = require('../../utils/request');
const auth = require('../../utils/auth');

Page({
  data: { user: null, avatarChar: '客', orders: [] },

  onShow() {
    const u = auth.getUser();
    this.setData({ user: u, avatarChar: u && u.nickname ? u.nickname[0] : '客' });
    api.get('/order', { page: 1, page_size: 5 })
      .then((res) => this.setData({ orders: res.list || [] }))
      .catch(() => {});
  },

  goOrders() {
    wx.showToast({ title: '全部订单开发中', icon: 'none' });
  },
});
