const api = require('../../utils/request');
const app = getApp();

function calcNav() {
  try {
    const sys = wx.getDeviceInfo ? wx.getDeviceInfo() : wx.getSystemInfoSync();
    const statusBar = sys.statusBarHeight || 20;
    const menu = wx.getMenuButtonBoundingClientRect();
    const navH = (menu.top - statusBar) * 2 + menu.height;
    return { statusBarHeight: statusBar, navHeight: navH };
  } catch (e) {
    return { statusBarHeight: 20, navHeight: 44 };
  }
}

Page({
  data: {
    list: [],
    total: '0.00',
    selectedCount: 0,
    allSelected: false,
    isEdit: false,
    themeColor: '#FF6B35',
    statusBarHeight: 20,
    navHeight: 44,
  },

  onLoad() {
    const nav = calcNav();
    this.setData({ statusBarHeight: nav.statusBarHeight, navHeight: nav.navHeight });
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ active: '/pages/cart/cart' });
    }
    this.load();
  },

  load() {
    api.get('/cart').then((res) => {
      // request.js 已解包 body.data，mock 返回 { list, total_count }
      const list = ((res && res.list) || []).map((item) => ({
        ...item,
        selected: item.selected === 1 || item.selected === true,
      }));
      this.setData({ list }, () => this.calcTotal());
    }).catch(() => {
      this.setData({ list: [] });
    });
  },

  calcTotal() {
    const list = this.data.list;
    let total = 0;
    let count = 0;
    let all = list.length > 0;
    list.forEach((item) => {
      if (item.selected) {
        total += (parseFloat(item.price) || 0) * item.quantity;
        count += item.quantity;
      } else {
        all = false;
      }
    });
    this.setData({
      total: total.toFixed(2),
      selectedCount: count,
      allSelected: all,
    });
  },

  toggleEdit() {
    this.setData({ isEdit: !this.data.isEdit });
  },

  selectItem(e) {
    const id = e.currentTarget.dataset.id;
    const list = this.data.list.map((item) =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    this.setData({ list }, () => this.calcTotal());
  },

  selectAll() {
    const all = !this.data.allSelected;
    const list = this.data.list.map((item) => ({ ...item, selected: all }));
    this.setData({ list, allSelected: all }, () => this.calcTotal());
  },

  changeQty(e) {
    const { id, delta } = e.currentTarget.dataset;
    const list = this.data.list.map((item) => {
      if (item.id !== id) return item;
      const next = item.quantity + parseInt(delta, 10);
      if (next <= 0) return null;
      return { ...item, quantity: next };
    }).filter(Boolean);
    this.setData({ list }, () => {
      this.calcTotal();
      this.syncQty(id);
    });
  },

  syncQty(id) {
    const item = this.data.list.find((i) => i.id === id);
    if (!item) return;
    api.post('/cart/update', { goods_id: item.goods_id, sku_id: item.sku_id, quantity: item.quantity }).catch(() => {});
  },

  removeTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该商品吗？',
      success: (r) => {
        if (r.confirm) this.remove([id]);
      },
    });
  },

  remove(ids) {
    api.post('/cart/delete', { ids }).then(() => this.load()).catch(() => {});
  },

  batchDelete() {
    const ids = this.data.list.filter((i) => i.selected).map((i) => i.id);
    if (!ids.length) {
      wx.showToast({ title: '请选择要删除的商品', icon: 'none' });
      return;
    }
    wx.showModal({
      title: '提示',
      content: `确定删除选中的 ${ids.length} 件商品吗？`,
      success: (r) => {
        if (r.confirm) this.remove(ids);
      },
    });
  },

  onSubmit() {
    if (this.data.isEdit) {
      this.batchDelete();
      return;
    }
    const selected = this.data.list.filter((i) => i.selected);
    if (!selected.length) {
      wx.showToast({ title: '请选择要结算的商品', icon: 'none' });
      return;
    }
    const items = selected.map((i) => ({ sku_id: i.sku_id, quantity: i.quantity }));
    app.globalData.pendingCheckout = { items };
    wx.navigateTo({ url: '/pages/order/confirm/confirm' });
  },

  goShopping() {
    wx.switchTab({ url: '/pages/index/index' });
  },
});
