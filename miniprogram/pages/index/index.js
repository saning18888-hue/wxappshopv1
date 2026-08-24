const api = require('../../utils/request');
const settings = require('../../utils/settings');

// 默认放大镜图标（本地 PNG，避免 base64 data URI 兼容问题）
const DEFAULT_SEARCH_ICON = '/images/search.png';

Page({
  data: {
    components: [],
    goodsList: [],
    cats: [],
    loading: true,

    // 站点状态
    siteClosed: false,
    closeReason: '',

    // 主题 / 基础设置
    themeColor: '#FF6B35',
    miniProgramName: '优选商城',        // 小程序名称
    miniProgramNameColor: '#333333',    // 小程序名称颜色
    pageTitleAlign: 'left',             // 页面标题对齐 left/center
    customerServiceButton: 'open',      // 客服按钮开关
    customerServiceType: 'business_phone',
    servicePhone: '',
    serviceWechat: '',
    wechatCorpid: '',
    wechatUrl: '',
    thirdPartyUrl: '',
    searchBoxColor: '#FFFFFF',          // 搜索框背景色
    searchBoxIcon: DEFAULT_SEARCH_ICON, // 搜索框图标（上传图片 URL；空则使用默认放大镜）
  },

  onLoad() {
    this.load();
  },

  onShow() {
    this.applySettings();
    this.checkSiteStatus();
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
  },

  // 应用基础设置（主题色 / 名称 / 搜索框 / 客服）
  applySettings() {
    settings.fetchSettings(true).then((s) => {
      this.setData({
        themeColor: s.theme_color || '#FF6B35',
        miniProgramName: s.mini_program_name || '优选商城',
        miniProgramNameColor: s.mini_program_name_color || '#333333',
        pageTitleAlign: s.page_title_align || 'left',
        customerServiceButton: s.customer_service_button || 'open',
        customerServiceType: s.customer_service_type || 'business_phone',
        servicePhone: s.service_phone || '',
        serviceWechat: s.service_wechat || '',
        wechatCorpid: s.wechat_corpid || '',
        wechatUrl: s.wechat_url || '',
        thirdPartyUrl: s.third_party_url || '',
        searchBoxColor: s.search_box_color || '#FFFFFF',
        searchBoxIcon: s.search_box_icon || DEFAULT_SEARCH_ICON,
      });
    });
  },

  // 站点状态：关闭则整页拦截
  checkSiteStatus() {
    settings.fetchSettings(true).then((s) => {
      this.setData({ siteClosed: s.site_status === 'close', closeReason: s.close_reason || '' });
    });
  },

  load() {
    Promise.all([
      api.get('/home'),
      api.get('/goods', { page_size: 20 }),
      api.get('/categories'),
    ])
      .then(([home, goods, cats]) => {
        this.setData({
          components: (home && home.components) || [],
          goodsList: (goods && goods.list) || [],
          cats: (cats && cats.list) || [],
          loading: false,
        });
        this.checkSiteStatus();
      })
      .catch(() => this.setData({ loading: false }));
  },

  onSearch(e) {
    const kw = (e.detail.value || '').trim();
    if (!kw) return;
    wx.navigateTo({ url: '/pages/goods/list/list?keyword=' + encodeURIComponent(kw) });
  },

  onCustomerService() {
    const { customerServiceType, servicePhone, serviceWechat, wechatCorpid, wechatUrl, thirdPartyUrl } = this.data;
    if (customerServiceType === 'weapp') return; // 使用 open-type=contact 按钮
    if (customerServiceType === 'business_phone') {
      if (servicePhone) {
        wx.makePhoneCall({ phoneNumber: servicePhone, fail: () => {} });
      } else {
        wx.showToast({ title: '暂未配置商家电话', icon: 'none' });
      }
      return;
    }
    if (customerServiceType === 'wechat') {
      if (wechatCorpid && wechatUrl && typeof wx.openCustomerServiceChat === 'function') {
        wx.openCustomerServiceChat({
          corpid: wechatCorpid,
          url: wechatUrl,
          fail: () => wx.showToast({ title: '调起微信客服失败', icon: 'none' }),
        });
      } else if (serviceWechat) {
        wx.setClipboardData({ data: serviceWechat, success: () => wx.showToast({ title: '微信号已复制', icon: 'none' }) });
      } else {
        wx.showToast({ title: '暂未配置微信客服', icon: 'none' });
      }
      return;
    }
    if (customerServiceType === 'third_party') {
      if (thirdPartyUrl) {
        wx.navigateTo({ url: '/pages/webview/webview?url=' + encodeURIComponent(thirdPartyUrl) });
      } else {
        wx.showToast({ title: '暂未配置第三方客服', icon: 'none' });
      }
      return;
    }
    wx.showToast({ title: '暂未配置客服', icon: 'none' });
  },
});
