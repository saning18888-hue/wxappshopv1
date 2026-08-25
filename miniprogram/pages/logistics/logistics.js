const { request } = require('../../utils/request');

Page({
  data: {
    loading: true,
    info: { company: '', no: '', state_text: '', traces: [] },
  },

  onLoad(query) {
    this.load(query);
  },

  async load(query) {
    this.setData({ loading: true });
    try {
      const params = {};
      if (query.order_id) params.order_id = query.order_id;
      if (query.company) params.company = query.company;
      if (query.no) params.no = query.no;
      if (query.phone) params.phone = query.phone;
      const data = await request('GET', 'logistics/track', params);
      this.setData({ info: data || {}, loading: false });
    } catch (e) {
      this.setData({ loading: false });
      wx.showToast({ title: e.message || '加载失败', icon: 'none' });
    }
  },
});
