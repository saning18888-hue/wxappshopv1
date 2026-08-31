const api = require('../../../utils/request');

Page({
  data: {
    orderId: 0,
    order: null,
    type: 'only_refund',
    reasons: ['不喜欢/不想要了', '商品质量问题', '与描述不符', '缺件/漏发', '其他'],
    reasonIndex: 0,
    reason: '',
    amountYuan: '',
    remark: '',
    images: [],
    themeColor: '#FF6B35',
    submitting: false,
  },

  onLoad(q) {
    const id = parseInt(q.order_id, 10) || 0;
    this.setData({ orderId: id });
    api.get('/order/' + id)
      .then((o) => {
        const pay = (o.pay_amount || 0).toFixed(2);
        o.pay_amount_yuan = pay;
        this.setData({ order: o, amountYuan: pay });
      })
      .catch((err) => wx.showToast({ title: err.message, icon: 'none' }));
  },

  selType(e) {
    this.setData({ type: e.currentTarget.dataset.v });
  },

  onReason(e) {
    const i = e.detail.value;
    this.setData({ reasonIndex: i, reason: this.data.reasons[i] });
  },

  onAmount(e) {
    this.setData({ amountYuan: e.detail.value });
  },

  onRemark(e) {
    this.setData({ remark: e.detail.value });
  },

  chooseImg() {
    wx.chooseMedia({
      count: 3,
      mediaType: ['image'],
      success: (res) => {
        const tmp = res.tempFiles.map((f) => f.tempFilePath);
        this.setData({ images: this.data.images.concat(tmp).slice(0, 3) });
      },
    });
  },

  delImg(e) {
    const i = e.currentTarget.dataset.i;
    const images = this.data.images.slice();
    images.splice(i, 1);
    this.setData({ images });
  },

  submit() {
    if (!this.data.reason) {
      wx.showToast({ title: '请选择退款原因', icon: 'none' });
      return;
    }
    const amount = parseFloat(this.data.amountYuan || '0');
    if (!amount || amount <= 0) {
      wx.showToast({ title: '请输入退款金额', icon: 'none' });
      return;
    }
    this.setData({ submitting: true });
    api.post('/order/refund', {
      order_id: this.data.orderId,
      type: this.data.type,
      reason: this.data.reason,
      amount: amount,
      remark: this.data.remark,
      images: this.data.images,
    })
      .then(() => {
        wx.showToast({ title: '申请已提交' });
        setTimeout(() => wx.redirectTo({ url: '/pages/order/detail/detail?id=' + this.data.orderId }), 800);
      })
      .catch((err) => {
        this.setData({ submitting: false });
        wx.showToast({ title: err.message, icon: 'none' });
      });
  },
});
