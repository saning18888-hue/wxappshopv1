const api = require('../../../utils/request');

Page({
  data: {
    list: [],
    themeColor: '#FF6B35',
    loading: false,
  },

  onLoad() {
    this.load();
  },

  onShow() {
    if (this.data.list.length) this.load();
  },

  load() {
    this.setData({ loading: true });
    api.get('/order/refunds')
      .then((res) => {
        const list = (res.list || []).map((o) => {
          o.price_yuan = (o.pay_amount || 0).toFixed(2);
          o.items = (o.items || []).map((it) => Object.assign({}, it, {
            price_yuan: ((it.price || 0) / 100).toFixed(2),
          }));
          if (o.refund_amount) o.refund_amount_yuan = Number(o.refund_amount).toFixed(2);
          return o;
        });
        this.setData({ list, loading: false });
      })
      .catch((err) => {
        this.setData({ loading: false });
        wx.showToast({ title: err.message, icon: 'none' });
      });
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/order/detail/detail?id=' + e.currentTarget.dataset.id });
  },
});
