const api = require('../../../utils/request');
const settings = require('../../../utils/settings');

Page({
  data: {
    list: [],
    keyword: '',
    categoryId: 0,
    sort: 'new',
    loading: false,
    themeColor: '#FF6B35',
    sorts: [
      { key: 'new', label: '综合' },
      { key: 'sales', label: '销量' },
      { key: 'price_asc', label: '价格↑' },
      { key: 'price_desc', label: '价格↓' },
    ],
  },

  onLoad(q) {
    this.setData({
      keyword: q.keyword || '',
      categoryId: Number(q.category_id) || 0,
    });
    this.load();
  },

  // 每次进入页面都强制拉取最新设置，确保后台修改的主题色及时生效
  onShow() {
    settings.fetchSettings(true).then((s) => {
      this.setData({ themeColor: s.theme_color || '#FF6B35' });
    });
  },

  onPullDownRefresh() {
    this.load();
  },

  load() {
    this.setData({ loading: true });
    api.get('/goods', {
      category_id: this.data.categoryId,
      keyword: this.data.keyword,
      sort: this.data.sort,
      page: 1,
      page_size: 20,
    })
      .then((res) => {
        this.setData({ list: res.list, loading: false });
        wx.stopPullDownRefresh();
      })
      .catch(() => {
        this.setData({ loading: false });
        wx.stopPullDownRefresh();
      });
  },

  setSort(e) {
    this.setData({ sort: e.currentTarget.dataset.sort }, () => this.load());
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/goods/detail/detail?id=' + e.currentTarget.dataset.id });
  },
});
