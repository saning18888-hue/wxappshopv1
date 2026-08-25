const api = require('../../../utils/request');
const settings = require('../../../utils/settings');
const app = getApp();

Page({
  data: {
    goods: null,
    selected: {},     // { spec_id: value_id }
    currentSku: null,
    quantity: 1,
    // 商品详情页展示开关（基础设置 → 商品设置）
    showSales: true,
    showStock: true,
    showOriginalPrice: true,
    showComment: true,
    cartButton: true,
    buyButton: true,
    themeColor: '#FF6B35',
  },

  onLoad(q) {
    api.get('/goods/' + q.id).then((g) => {
      this.setData({ goods: g });
      this.matchSku();
    });
  },

  // 每次进入页面都强制拉取最新设置，确保后台修改的主题色及时生效
  onShow() {
    settings.fetchSettings(true).then((s) => {
      this.setData({
        showSales: !!s.show_sales,
        showStock: !!s.show_stock,
        showOriginalPrice: !!s.show_original_price,
        showComment: !!s.show_comment,
        cartButton: !!s.cart_button,
        buyButton: !!s.buy_button,
        themeColor: s.theme_color || '#FF6B35',
      });
    });
  },


  selectSpec(e) {
    const specId = e.currentTarget.dataset.specId;
    const valueId = e.currentTarget.dataset.valueId;
    const selected = Object.assign({}, this.data.selected);
    selected[specId] = valueId;
    this.setData({ selected }, () => this.matchSku());
  },

  matchSku() {
    const g = this.data.goods;
    if (!g) return;
    if (!g.spec_groups || g.spec_groups.length === 0) {
      this.setData({ currentSku: (g.skus || [])[0] || null });
      return;
    }
    const selCount = Object.keys(this.data.selected).length;
    if (selCount < g.spec_groups.length) {
      this.setData({ currentSku: null });
      return;
    }
    const selArr = Object.values(this.data.selected).map(Number).sort();
    const sku = (g.skus || []).find((s) => {
      const arr = s.spec_value_ids.split(',').map(Number).sort();
      if (arr.length !== selArr.length) return false;
      return arr.every((v, i) => v === selArr[i]);
    });
    this.setData({ currentSku: sku || null });
  },

  incQty() {
    const max = this.data.currentSku ? this.data.currentSku.stock : 99;
    if (this.data.quantity < max) this.setData({ quantity: this.data.quantity + 1 });
  },
  decQty() {
    if (this.data.quantity > 1) this.setData({ quantity: this.data.quantity - 1 });
  },

  addCart() {
    if (!this.ensureSku()) return;
    api.post('/cart', { sku_id: this.data.currentSku.id, quantity: this.data.quantity })
      .then(() => wx.showToast({ title: '已加入购物车', icon: 'success' }))
      .catch((err) => wx.showToast({ title: err.message, icon: 'none' }));
  },

  buyNow() {
    if (!this.ensureSku()) return;
    app.globalData.pendingCheckout = {
      items: [{ sku_id: this.data.currentSku.id, quantity: this.data.quantity }],
    };
    wx.navigateTo({ url: '/pages/order/confirm/confirm' });
  },

  ensureSku() {
    if (!this.data.currentSku) {
      wx.showToast({ title: '请选择规格', icon: 'none' });
      return false;
    }
    if (this.data.currentSku.stock <= 0) {
      wx.showToast({ title: '该规格库存不足', icon: 'none' });
      return false;
    }
    return true;
  },
});
