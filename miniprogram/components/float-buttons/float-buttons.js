const settings = require('../../utils/settings');

Component({
  data: {
    showService: true,
    serviceType: 'business_phone',
    servicePhone: '',
    serviceWechat: '',
    wechatCorpid: '',
    wechatUrl: '',
    thirdPartyUrl: '',
    cartIcon: '/images/cart.svg',
    homeIcon: '/images/home.svg',
    serviceIcon: '/images/message.svg',
  },
  methods: {
    loadSettings() {
      settings.fetchSettings(false).then((s) => this.applySettings(s));
    },
    applySettings(s) {
      if (!s) return;
      this.setData({
        showService: s.customer_service_button !== 'close',
        serviceType: s.customer_service_type || 'business_phone',
        servicePhone: s.service_phone || '',
        serviceWechat: s.service_wechat || '',
        wechatCorpid: s.wechat_corpid || '',
        wechatUrl: s.wechat_url || '',
        thirdPartyUrl: s.third_party_url || '',
        cartIcon: s.float_cart_icon || '/images/cart.svg',
        homeIcon: s.float_home_icon || '/images/home.svg',
        serviceIcon: s.float_service_icon || '/images/message.svg',
      });
    },
    onTapCart() {
      wx.switchTab({ url: '/pages/cart/cart' });
    },
    onTapHome() {
      wx.switchTab({ url: '/pages/index/index' });
    },
    onCustomerService() {
      const d = this.data;
      if (d.serviceType === 'weapp') return;
      if (d.serviceType === 'business_phone') {
        if (d.servicePhone) {
          wx.makePhoneCall({ phoneNumber: d.servicePhone, fail: () => {} });
        } else {
          wx.showToast({ title: '暂未配置商家电话', icon: 'none' });
        }
        return;
      }
      if (d.serviceType === 'wechat') {
        if (d.wechatCorpid && d.wechatUrl && typeof wx.openCustomerServiceChat === 'function') {
          wx.openCustomerServiceChat({
            corpid: d.wechatCorpid,
            url: d.wechatUrl,
            fail: () => wx.showToast({ title: '调起微信客服失败', icon: 'none' }),
          });
        } else if (d.serviceWechat) {
          wx.setClipboardData({
            data: d.serviceWechat,
            success: () => wx.showToast({ title: '微信号已复制', icon: 'none' }),
          });
        } else {
          wx.showToast({ title: '暂未配置微信客服', icon: 'none' });
        }
        return;
      }
      if (d.serviceType === 'third_party') {
        if (d.thirdPartyUrl) {
          wx.navigateTo({ url: '/pages/webview/webview?url=' + encodeURIComponent(d.thirdPartyUrl) });
        } else {
          wx.showToast({ title: '暂未配置第三方客服', icon: 'none' });
        }
        return;
      }
      wx.showToast({ title: '暂未配置客服', icon: 'none' });
    },
  },
  lifetimes: {
    attached() {
      this.loadSettings();
    },
  },
  pageLifetimes: {
    show() {
      this.loadSettings();
    },
  },
});
