const api = require('../../../utils/request');

Page({
  data: {
    id: 0,
    order: null,
    themeColor: '#FF6B35',
  },

  onLoad(q) {
    this.setData({ id: parseInt(q.id, 10) || 0 });
    this.load();
  },

  onShow() {
    if (this.data.order) this.load();
  },

  load() {
    api.get('/order/' + this.data.id)
      .then((o) => {
        o.price_yuan = (o.pay_amount || 0).toFixed(2);
        o.items = (o.items || []).map((it) => Object.assign({}, it, {
          price_yuan: ((it.price || 0) / 100).toFixed(2),
        }));
        if (o.refund_amount) o.refund_amount_yuan = Number(o.refund_amount).toFixed(2);
        o.goods_amount_yuan = (o.goods_amount || 0).toFixed(2);
        o.shipping_fee_yuan = (o.shipping_fee || 0).toFixed(2);
        o.discount_yuan = (o.discount || 0).toFixed(2);
        this.setData({ order: o });
      })
      .catch((err) => wx.showToast({ title: err.message || '加载失败', icon: 'none' }));
  },

  goAftersale() {
    wx.navigateTo({ url: '/pages/aftersale/apply/apply?order_id=' + this.data.id });
  },

  cancelRefund() {
    wx.showModal({
      title: '提示',
      content: '确定撤销本次售后申请？',
      success: (r) => {
        if (!r.confirm) return;
        api.post('/order/refund/cancel', { order_id: this.data.id })
          .then(() => { wx.showToast({ title: '已撤销' }); this.load(); })
          .catch((err) => wx.showToast({ title: err.message, icon: 'none' }));
      },
    });
  },

  copyNo() {
    if (this.data.order) wx.setClipboardData({ data: this.data.order.order_no });
  },
});
