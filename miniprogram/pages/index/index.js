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
    searchBoxColor: '#FFFFFF',          // 搜索框背景色
    searchBoxIcon: DEFAULT_SEARCH_ICON, // 搜索框图标（上传图片 URL；空则使用默认放大镜）

    // 首页扩展
    collectTip: 'open',                 // 收藏提示
    homeSubtitle: '',                 // 首页副标题
    scrollOrder: 'close',               // 滚动订单提示
    scrollOrderList: [],                // 滚动订单文案列表
    currentScrollOrder: 0,              // 当前滚动订单索引
    scrollOrderVisible: false,          // 滚动订单是否显示
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

  // 应用基础设置（主题色 / 名称 / 搜索框 / 客服 / 首页扩展）
  applySettings() {
    settings.fetchSettings(true).then((s) => {
      this.setData({
        themeColor: s.theme_color || '#FF6B35',
        miniProgramName: s.mini_program_name || '优选商城',
        miniProgramNameColor: s.mini_program_name_color || '#333333',
        pageTitleAlign: s.page_title_align || 'left',
        searchBoxColor: s.search_box_color || '#FFFFFF',
        searchBoxIcon: s.search_box_icon || DEFAULT_SEARCH_ICON,
        collectTip: s.collect_tip || 'open',
        homeSubtitle: s.home_subtitle || '',
        scrollOrder: s.scroll_order || 'close',
        scrollOrderList: Array.isArray(s.scroll_order_list) ? s.scroll_order_list : [],
      }, () => {
        this.showCollectTip();
        this.startScrollOrder();
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

  // 收藏提示：开启时首页首次显示右上角收藏引导
  showCollectTip() {
    if (this.data.collectTip !== 'open') return;
    const shownKey = '__collect_tip_shown';
    wx.getStorage({
      key: shownKey,
      fail: () => {
        if (typeof wx.showFavoriteGuide === 'function') {
          wx.showFavoriteGuide({
            type: 'tip',
            content: '收藏小程序，下次访问更快',
            success: () => wx.setStorage({ key: shownKey, data: 1 }),
            fail: () => {},
          });
        }
      },
    });
  },

  // 启动/停止滚动订单提示
  startScrollOrder() {
    this.stopScrollOrder();
    const list = this.data.scrollOrderList || [];
    if (this.data.scrollOrder !== 'open' || !list.length) {
      this.setData({ scrollOrderVisible: false });
      return;
    }
    this.setData({ scrollOrderVisible: true });
    this.scrollTimer = setInterval(() => {
      const idx = (this.data.currentScrollOrder + 1) % list.length;
      this.setData({ currentScrollOrder: idx });
    }, 3500);
  },
  stopScrollOrder() {
    if (this.scrollTimer) {
      clearInterval(this.scrollTimer);
      this.scrollTimer = null;
    }
  },

  onHide() {
    this.stopScrollOrder();
  },
  onUnload() {
    this.stopScrollOrder();
  },
});
