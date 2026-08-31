const api = require('../../../utils/request');

Page({
  data: {
    tabs: [
      { key: '', label: '全部' },
      { key: '0', label: '待付款' },
      { key: '1', label: '待发货' },
      { key: '2', label: '待收货' },
      { key: 'review', label: '待评价' },
    ],
    tabIndex: 0,
    status: '',
    list: [],
    page: 1,
    size: 10,
    finished: false,
    loading: false,
    themeColor: '#FF6B35',
  },

  onLoad(q) {
    const status = q.status || '';
    const idx = this.data.tabs.findIndex((t) => t.key === status);
    this.setData({ status, tabIndex: idx >= 0 ? idx : 0 });
    this.load(true);
  },

  onShow() {
    if (this.data.list.length) this.load(true);
  },

  onPullDownRefresh() {
    this.load(true, () => wx.stopPullDownRefresh());
  },

  onReachBottom() {
    if (!this.data.finished && !this.data.loading) this.load(false);
  },

  switchTab(e) {
    const i = e.currentTarget.dataset.i;
    const status = this.data.tabs[i].key;
    if (status === this.data.status) return;
    this.setData({ tabIndex: i, status });
    this.load(true);
  },

  load(reset, done) {
    if (this.data.loading) { done && done(); return; }
    const page = reset ? 1 : this.data.page + 1;
    this.setData({ loading: true });
    api.get('/order', { status: this.data.status, page, page_size: this.data.size })
      .then((res) => {
        const list = (res.list || []).map((o) => this.decorate(o));
        this.setData({
          list: reset ? list : this.data.list.concat(list),
          page,
          finished: (res.list || []).length < this.data.size,
          loading: false,
        });
        done && done();
      })
      .catch((err) => {
        this.setData({ loading: false });
        wx.showToast({ title: err.message || '加载失败', icon: 'none' });
        done && done();
      });
  },

  decorate(o) {
    o.price_yuan = (o.pay_amount || 0).toFixed(2);
    o.items = (o.items || []).map((it) => Object.assign({}, it, {
      price_yuan: ((it.price || 0) / 100).toFixed(2),
    }));
    return o;
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/order/detail/detail?id=' + e.currentTarget.dataset.id });
  },

  goAftersale(e) {
    wx.navigateTo({ url: '/pages/aftersale/apply/apply?order_id=' + e.currentTarget.dataset.id });
  },
});
