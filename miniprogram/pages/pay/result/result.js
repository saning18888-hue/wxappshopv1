const api = require('../../../utils/request');
const settings = require('../../../utils/settings');

Page({
  data: { order: null, mock: false, themeColor: '#FF6B35' },

  onLoad(q) {
    const mock = q.mock === '1';
    this.setData({ mock });
    settings.fetchSettings(true).then((s) => {
      this.setData({ themeColor: s.theme_color || '#FF6B35' });
    });
    const after = mock
      ? api.post('/payment/mock_notify', { order_no: q.order_no })
      : Promise.resolve();

    after
      .then(() => api.get('/order', { page: 1, page_size: 50 }))
      .then((res) => {
        const order = (res.list || []).find((o) => o.order_no === q.order_no);
        this.setData({ order });
      })
      .catch(() => {});
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' });
  },

  goOrders() {
    wx.switchTab({ url: '/pages/member/member' });
  },
});
