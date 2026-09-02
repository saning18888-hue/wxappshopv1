const api = require('../../utils/request');

Page({
  data: {
    orderId: 0,
    goodsId: 0,
    goodsTitle: '',
    goodsImage: '',
    rating: 5,
    content: '',
    submitting: false,
  },

  onLoad(q) {
    this.setData({
      orderId: parseInt(q.order_id, 10) || 0,
      goodsId: parseInt(q.goods_id, 10) || 0,
      goodsTitle: q.goods_title || '',
      goodsImage: decodeURIComponent(q.goods_image || ''),
    });
  },

  setRating(e) {
    this.setData({ rating: parseInt(e.currentTarget.dataset.v, 10) });
  },

  onInput(e) {
    this.setData({ content: e.detail.value });
  },

  submit() {
    if (this.data.submitting) return;
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请输入评价内容', icon: 'none' });
      return;
    }
    this.setData({ submitting: true });
    api.post('/reviews', {
        order_id: this.data.orderId,
        goods_id: this.data.goodsId,
        rating: this.data.rating,
        content: this.data.content,
        images: [],
      })
      .then(() => {
        wx.showToast({ title: '评价成功', icon: 'success' });
        setTimeout(() => {
          const pages = getCurrentPages();
          const prev = pages[pages.length - 2];
          if (prev && typeof prev.load === 'function') prev.load();
          wx.navigateBack();
        }, 800);
      })
      .catch((err) => {
        this.setData({ submitting: false });
        wx.showToast({ title: err.message || '提交失败', icon: 'none' });
      });
  },
});
