// pages/article/list/list.js
const api = require('../../../utils/request.js');

Page({
  data: {
    list: [],
    page: 1,
    pageSize: 10,
    total: 0,
    lastPage: 1,
    loading: true,
    finishing: false,
    error: '',
    keyword: '',
    categoryId: 0,
  },

  onLoad(query) {
    const kw = (query && query.keyword) || '';
    const cid = (query && query.category_id) ? parseInt(query.category_id) : 0;
    if (kw) this.setData({ keyword: kw });
    if (cid) this.setData({ categoryId: cid });
    wx.setNavigationBarTitle({ title: '文章列表' });
    this.loadList(true);
  },

  onReachBottom() {
    if (this.data.finishing || this.data.loading) return;
    if (this.data.page >= this.data.lastPage) return;
    this.setData({ page: this.data.page + 1 });
    this.loadList(false);
  },

  onPullDownRefresh() {
    this.setData({ page: 1 });
    this.loadList(true).then(() => wx.stopPullDownRefresh());
  },

  loadList(reset) {
    const page = reset ? 1 : this.data.page;
    if (reset) this.setData({ loading: true, error: '' });
    const params = { page, page_size: this.data.pageSize };
    if (this.data.keyword) params.keyword = this.data.keyword;
    if (this.data.categoryId) params.category_id = this.data.categoryId;
    const qs = Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
    // request.js 成功时 resolve(body.data),所以 r 已经是 { list, pagination }
    return api.get('/articles?' + qs).then((r) => {
      if (r && r.list) {
        const incoming = (r.list || []).map((a) => {
          a.publish_time_text = this.formatTime(a.publish_time);
          return a;
        });
        const merged = reset ? incoming : this.data.list.concat(incoming);
        const p = r.pagination || {};
        this.setData({
          list: merged,
          total: p.total || 0,
          lastPage: p.last_page || 1,
          loading: false,
          finishing: (page >= (p.last_page || 1)),
        });
      } else {
        this.setData({ error: '列表数据为空', loading: false });
      }
    }).catch((e) => {
      const msg = (e && e.message) ? e.message : '网络异常,请检查后端是否启动,真机预览需把 config.js 的 baseUrl 改为电脑局域网 IP';
      this.setData({ error: msg, loading: false });
    });
  },

  formatTime(ts) {
    if (!ts) return '';
    const s = String(ts);
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? `${m[1]}-${m[2]}-${m[3]}` : s;
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    wx.navigateTo({ url: '/pages/article/detail/detail?id=' + id });
  },

  onShareAppMessage() {
    return {
      title: '文章列表',
      path: '/pages/article/list/list',
    };
  },
});