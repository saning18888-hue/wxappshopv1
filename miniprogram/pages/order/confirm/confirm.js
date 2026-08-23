const api = require('../../../utils/request');
const settings = require('../../../utils/settings');
const auth = require('../../../utils/auth');
const app = getApp();

Page({
  data: {
    items: [],
    preview: null,
    address: { name: '', phone: '', address: '' },
    buyDenied: '',           // 购买权限拦截提示
    needCaptcha: false,      // 下单需图形验证码（基础设置 → 安全设置）
    captchaInput: '',
    captchaCode: '',
    themeColor: '#FF6B35',
  },

  onLoad() {
    const ck = app.globalData.pendingCheckout;
    if (!ck || !ck.items || ck.items.length === 0) {
      wx.showToast({ title: '未选择商品', icon: 'none' });
      return;
    }
    this.setData({ items: ck.items });
    this.applySettings();
    this.loadPreview(ck.items, this.data.address);
  },

  // 应用基础设置（购买权限 / 下单验证码 / 主题色）
  applySettings() {
    settings.fetchSettings(true).then((s) => {
      let denied = '';
      if (s.buy_permission === 'login' && !auth.getToken()) {
        denied = '请先登录后再下单';
      } else if (s.buy_permission === 'member') {
        const u = auth.getUser() || {};
        if (!u.member_card) denied = '仅限持有会员卡的用户下单';
      }
      const needCaptcha = !!s.captcha_order;
      this.setData({
        buyDenied: denied,
        needCaptcha,
        captchaCode: needCaptcha ? String(Math.floor(1000 + Math.random() * 9000)) : '',
        captchaInput: '',
        themeColor: s.theme_color || '#FF6B35',
      });
    });
  },

  onAddressInput(e) {
    const field = e.currentTarget.dataset.field;
    const address = Object.assign({}, this.data.address);
    address[field] = e.detail.value;
    this.setData({ address });
    this.loadPreview(this.data.items, address);
  },

  refreshCaptcha() {
    this.setData({ captchaCode: String(Math.floor(1000 + Math.random() * 9000)), captchaInput: '' });
  },

  onCaptchaInput(e) {
    this.setData({ captchaInput: e.detail.value });
  },

  loadPreview(items, address) {
    api.post('/order/preview', { items, address })
      .then((p) => this.setData({ preview: p }))
      .catch((err) => wx.showToast({ title: err.message, icon: 'none' }));
  },

  submit() {
    const s = settings.getSettings();
    // 购买权限
    if (this.data.buyDenied) {
      wx.showToast({ title: this.data.buyDenied, icon: 'none' });
      return;
    }
    // 下单图形验证码
    if (this.data.needCaptcha && String(this.data.captchaInput) !== String(this.data.captchaCode)) {
      wx.showToast({ title: '验证码错误', icon: 'none' });
      this.refreshCaptcha();
      return;
    }
    const a = this.data.address;
    if (!a.name || !a.phone || !a.address) {
      wx.showToast({ title: '请填写完整收货信息', icon: 'none' });
      return;
    }
    // 下单需绑定手机号（基础设置 → 交易设置）
    if (s.require_mobile && !/^1\d{10}$/.test(a.phone)) {
      wx.showToast({ title: '请填写正确的手机号', icon: 'none' });
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
