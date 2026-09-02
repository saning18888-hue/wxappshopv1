// pages/article/detail/detail.js
const app = getApp();
const api = require('../../../utils/request.js');

Page({
  data: {
    article: null,
    loading: true,
    error: '',
    showTitle: true,
    showPublish: true,
    showViews: true,
  },

  onLoad(query) {
    const id = query.id;
    if (!id) {
      this.setData({ error: '缺少文章 id', loading: false });
      return;
    }
    this.loadSettings();
    this.loadArticle(id);
  },

  loadSettings() {
    api.get('/settings').then((r) => {
      if (r && r.code === 0 && r.data && r.data.article) {
        const a = r.data.article;
        this.setData({
          showTitle:   a.title_show   !== 0,
          showPublish: a.publish_show !== 0,
          showViews:   a.views_show   !== 0,
        });
      }
    }).catch(() => {});
  },

  loadArticle(id) {
    this.setData({ loading: true, error: '' });
    // request.js 在成功时 resolve(body.data),所以 r 已经是 data 本身,不要再取 r.data / r.msg
    api.get('/articles/' + id).then((r) => {
      if (r && r.id) {
        r.publish_time_text = this.formatTime(r.publish_time);
        this.setData({ article: r, loading: false });
        wx.setNavigationBarTitle({ title: r.title || '文章详情' });
      } else {
        this.setData({ error: '文章数据为空', loading: false });
      }
    }).catch((e) => {
      // e.message 可能是后端 fail 的 msg(如「文章不存在或已下架」),也可能是 wx.request fail 的提示
      const msg = (e && e.message) ? e.message : '网络异常,请检查后端是否启动,真机预览需把 config.js 的 baseUrl 改为电脑局域网 IP';
      this.setData({ error: msg, loading: false });
    });
  },

  formatTime(ts) {
    if (!ts) return '';
    const s = String(ts);
    // 取 YYYY-MM-DD 部分
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? `${m[1]}-${m[2]}-${m[3]}` : s;
  },

  onShareAppMessage() {
    const a = this.data.article;
    if (!a) return {};
    return {
      title: a.title || '文章详情',
      path: '/pages/article/detail/detail?id=' + a.id,
    };
  },
});