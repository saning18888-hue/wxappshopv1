const STYLE_DEFAULTS = {
  text_color: '#999999',
  selected_color: '#FF6B35',
  bg_color: '#FFFFFF',
  border_color: '#EEEEEE',
};

function getApiBase() {
  // 与 utils/request.js 保持一致
  return typeof __wxConfig !== 'undefined' && __wxConfig.envVersion === 'develop'
    ? 'http://127.0.0.1:8899'
    : 'https://your-domain.com';
}

function getBottomNavStyle() {
  return new Promise((resolve) => {
    wx.request({
      url: `${getApiBase()}/api/v1/bottom_nav`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data && res.data.code === 0 && res.data.data) {
          resolve(res.data.data.style || STYLE_DEFAULTS);
        } else {
          resolve(STYLE_DEFAULTS);
        }
      },
      fail: () => resolve(STYLE_DEFAULTS),
    });
  });
}

Component({
  data: {
    selected: 0,
    textColor: STYLE_DEFAULTS.text_color,
    selectedColor: STYLE_DEFAULTS.selected_color,
    bgColor: STYLE_DEFAULTS.bg_color,
    borderColor: STYLE_DEFAULTS.border_color,
    list: [
      { pagePath: '/pages/index/index',        text: '首页',   icon: '/images/tab/home-normal.png',     selectedIcon: '/images/tab/home-active.png' },
      { pagePath: '/pages/category/category',  text: '分类',   icon: '/images/tab/category-normal.png', selectedIcon: '/images/tab/category-active.png' },
      { pagePath: '/pages/cart/cart',          text: '购物车', icon: '/images/tab/cart-normal.png',     selectedIcon: '/images/tab/cart-active.png' },
      { pagePath: '/pages/member/member',      text: '我的',   icon: '/images/tab/mine-normal.png',     selectedIcon: '/images/tab/mine-active.png' },
    ],
  },

  lifetimes: {
    attached() {
      this.applyStyle();
    },
  },

  pageLifetimes: {
    show() {
      this.applyStyle();
    },
  },

  methods: {
    applyStyle() {
      getBottomNavStyle().then((style) => {
        this.setData({
          textColor: style.text_color || STYLE_DEFAULTS.text_color,
          selectedColor: style.selected_color || STYLE_DEFAULTS.selected_color,
          bgColor: style.bg_color || STYLE_DEFAULTS.bg_color,
          borderColor: style.border_color || STYLE_DEFAULTS.border_color,
        });
      });
    },

    switchTab(e) {
      const idx = e.currentTarget.dataset.index;
      wx.switchTab({ url: this.data.list[idx].pagePath });
    },
  },
});
