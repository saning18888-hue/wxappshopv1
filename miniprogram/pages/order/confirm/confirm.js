const api = require('../../../utils/request');
const app = getApp();

Page({
  data: {
    items: [],
    preview: null,
    address: { name: '', phone: '', address: '' },
  },

  onLoad() {
    const ck = app.globalData.pendingCheckout;
    if (!ck || !ck.items || ck.items.length === 0) {
      wx.showToast({ title: '未选择商品', icon: 'none' });
      return;
    }
    this.setData({ items: ck.items });
    this.loadPreview(ck.items, this.data.address);
  },

  onAddressInput(e) {
    const field = e.currentTarget.dataset.field;
    const address = Object.assign({}, this.data.address);
    address[field] = e.detail.value;
    this.setData({ address });
    this.loadPreview(this.data.items, address);
  },

  loadPreview(items, address) {
    api.post('/order/preview', { items, address })
      .then((p) => this.setData({ preview: p }))
      .catch((err) => wx.showToast({ title: err.message, icon: 'none' }));
  },

  submit() {
    const a = this.data.address;
    if (!a.name || !a.phone || !a.address) {
      wx.showToast({ title: '请填写完整收货信息', icon: 'none' });
      return;
    }
    api.post('/order', { items: this.data.items, address: a })
      .then((res) => {
        app.globalData.pendingCheckout = null;
        wx.redirectTo({ url: '/pages/pay/result/result?order_no=' + res.order_no + '&mock=1' });
      })
      .catch((err) => wx.showToast({ title: err.message, icon: 'none' }));
  },
});
