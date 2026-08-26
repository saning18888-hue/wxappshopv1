const api = require('../../../utils/request');
const settings = require('../../../utils/settings');

Page({
  data: { order: null, mock: false, themeColor: '#FF6B35' },

  onLoad(q) {
    const mock = q.mock === '1';
    const paid = q.paid === '1'; // 余额支付成功，无需再调 mock 回调
    this.setData({ mock });
    settings.fetchSettings(true).then((s) => {
      this.setData({ themeColor: s.theme_color || '#FF6B35' });
    });
    if (paid) {
      this.loadOrder(q.order_no);
      return;
    }
    const after = mock
      ? api.post('/payment/mock_notify', { order_no: q.order_no })
      : Promise.resolve();

    after
      .then(() => this.loadOrder(q.order_no))
      .catch(() => {});
  },

  loadOrder(orderNo) {
    api.get('/order', { page: 1, page_size: 50 })
      .then((res) => {
        const order = (res.list || []).find((o) => o.order_no === orderNo);
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
