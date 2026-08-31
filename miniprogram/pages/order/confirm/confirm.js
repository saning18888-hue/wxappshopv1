const api = require('../../../utils/request');
const settings = require('../../../utils/settings');
const auth = require('../../../utils/auth');
const app = getApp();

Page({
  data: {
    items: [],
    preview: null,
    address: { name: '', phone: '', address: '' },
    remark: '',              // 订单留言
    delivery: 'express',     // 配送方式 express=快递配送 self_pickup=到店自提 same_city=同城配送
    deliveryOptions: [],     // 可用配送方式（后端按后台开关返回）
    pickupPoints: [],        // 自提点列表（self_pickup 时）
    pickupPointId: '',       // 选中的自提点 id
    pickupIndex: 0,          // 选中的自提点序号（picker 用）
    addrWarn: '',            // 地址异常提示（如超出配送范围）
    buyDenied: '',           // 购买权限拦截提示
    needCaptcha: false,      // 下单需图形验证码（基础设置 → 安全设置）
    captchaInput: '',
    captchaCode: '',
    themeColor: '#FF6B35',
    payMethods: [],          // 可用支付方式列表
    payMethod: 'wechat',     // 当前选中支付方式
    balanceHint: '',         // 余额提示
    devicePlatform: '',      // ios / android / devtools
  },

  onLoad() {
    const ck = app.globalData.pendingCheckout;
    if (!ck || !ck.items || ck.items.length === 0) {
      wx.showToast({ title: '未选择商品', icon: 'none' });
      return;
    }
    this.setData({ items: ck.items });
    // 记录设备平台，用于 iOS 支付限制判断
    try {
      const dev = wx.getDeviceInfo ? wx.getDeviceInfo() : wx.getSystemInfoSync();
      this.setData({ devicePlatform: (dev.platform || '').toLowerCase() });
    } catch (e) {
      this.setData({ devicePlatform: '' });
    }
    this.applySettings();
    this.loadPreview(ck.items, this.data.address);
  },

  // 应用基础设置（购买权限 / 下单验证码 / 主题色 / 支付方式）
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

      // 支付方式：依据后台 pay_methods + iOS 限制 生成可选列表
      const allMap = {
        wechat:  { value: 'wechat',  label: '微信支付' },
        balance: { value: 'balance', label: '储值余额' },
      };
      let methods = (s.pay_methods || ['wechat'])
        .map((m) => allMap[m])
        .filter((m) => !!m);

      const isIOS = this.data.devicePlatform === 'ios';
      if (isIOS && s.ios_pay_limit) {
        methods = methods.filter((m) => {
          if (m.value === 'balance' && s.ios_pay_limit.balance) return false;
          if (m.value === 'card' && s.ios_pay_limit.card) return false;
          if (m.value === 'knowledge' && s.ios_pay_limit.knowledge) return false;
          return true;
        });
      }
      if (methods.length === 0) methods = [{ value: 'wechat', label: '微信支付' }];

      // 余额提示
      const u = auth.getUser() || {};
      const balanceHint = methods.some((m) => m.value === 'balance')
        ? '可用余额 ¥' + (Number(u.balance || 0) / 100).toFixed(2)
        : '';

      this.setData({
        buyDenied: denied,
        needCaptcha,
        captchaCode: needCaptcha ? String(Math.floor(1000 + Math.random() * 9000)) : '',
        captchaInput: '',
        themeColor: s.theme_color || '#FF6B35',
        payMethods: methods,
        payMethod: methods[0].value,
        balanceHint,
        delivery: s.default_delivery || 'express',
      });
    });
  },

  // 选择支付方式
  selPay(e) {
    this.setData({ payMethod: e.currentTarget.dataset.v });
  },

  // 数量 +1
  qtyPlus(e) {
    const idx = e.currentTarget.dataset.i;
    const items = this.data.items.slice();
    items[idx].quantity = (items[idx].quantity || 1) + 1;
    this.setData({ items });
    this.loadPreview(items, this.data.address);
  },

  // 数量 -1
  qtyMinus(e) {
    const idx = e.currentTarget.dataset.i;
    const items = this.data.items.slice();
    if (items[idx].quantity <= 1) return;
    items[idx].quantity -= 1;
    this.setData({ items });
    this.loadPreview(items, this.data.address);
  },

  // 订单留言
  onRemark(e) {
    this.setData({ remark: e.detail.value });
  },

  // 跳转收货地址页
  goAddress() {
    wx.navigateTo({
      url: '/pages/address/address?from=confirm',
      events: {
        // 接收地址页返回的数据
        acceptAddr: (addr) => {
          if (addr && addr.name && addr.phone && addr.address) {
            this.setData({ address: addr, addrWarn: '' });
            this.loadPreview(this.data.items, addr);
          }
        },
      },
    });
  },

  // 配送方式切换
  setDelivery(e) {
    const v = e.currentTarget.dataset.v;
    this.setData({ delivery: v, pickupPointId: '', pickupIndex: 0 });
    this.loadPreview(this.data.items, this.data.address);
  },
  // 自提点选择（picker 的 value 是序号，需映射到自提点 id）
  onPickupPoint(e) {
    const idx = e.detail.value;
    const pt = this.data.pickupPoints[idx];
    this.setData({
      pickupIndex: idx,
      pickupPointId: pt ? String(pt.id) : '',
    });
  },

  // 优惠券入口
  onCoupon() {
    wx.showToast({ title: '暂无可用优惠券', icon: 'none' });
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
    api.post('/order/preview', { items, address, delivery: this.data.delivery })
      .then((p) => {
        // 价格格式化：分 → 元（保留2位小数）
        const fmt = (fen) => (Number(fen || 0) / 100).toFixed(2);
        p.goods_amount_yuan = fmt(p.goods_amount);
        p.shipping_fee_yuan = fmt(p.shipping_fee);
        p.discount_yuan = fmt(p.discount);
        p.pay_amount_yuan = fmt(p.pay_amount);
        if (p.items) {
          p.items.forEach((it) => { it.price_yuan = fmt(it.price); });
        }
        // 校正当前选中的配送方式（若后端回退到其它启用的方式）
        let delivery = this.data.delivery;
        const opts = p.delivery_options || [];
        if (opts.length && !opts.some((o) => o.type === delivery)) {
          delivery = opts[0].type;
        }
        const pickup = opts.find((o) => o.type === 'self_pickup');
        this.setData({
          preview: p,
          delivery,
          deliveryOptions: opts,
          pickupPoints: pickup ? (pickup.points || []) : [],
        });
      })
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
    api.post('/order', {
      items: this.data.items,
      address: a,
      pay_method: this.data.payMethod,
      platform: this.data.devicePlatform,
      delivery: this.data.delivery,
      pickup_point_id: this.data.pickupPointId,
    })
      .then((res) => {
        app.globalData.pendingCheckout = null;
        if (res.paid) {
          // 储值余额支付已直接到账，无需走 mock 回调
          wx.redirectTo({ url: '/pages/pay/result/result?order_no=' + res.order_no + '&paid=1' });
        } else {
          wx.redirectTo({ url: '/pages/pay/result/result?order_no=' + res.order_no + '&mock=1' });
        }
      })
      .catch((err) => wx.showToast({ title: err.message, icon: 'none' }));
  },
});
