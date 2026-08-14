const api = require('../../utils/request');

Page({
  data: { cats: [], activeId: 0, children: [] },

  onLoad() {
    api.get('/categories').then((res) => {
      const cats = res.list || [];
      this.setData({
        cats,
        activeId: cats[0] ? cats[0].id : 0,
        children: cats[0] ? cats[0].children : [],
      });
    });
  },

  switchCat(e) {
    const id = e.currentTarget.dataset.id;
    const cat = this.data.cats.find((c) => c.id === id);
    this.setData({ activeId: id, children: cat ? cat.children : [] });
  },

  goList(e) {
    wx.navigateTo({ url: '/pages/goods/list/list?category_id=' + e.currentTarget.dataset.id });
  },
});
