const api = require('../../utils/request');
const auth = require('../../utils/auth');
const settings = require('../../utils/settings');

Page({
  data: {
    user: null,
    avatarChar: '客',
    themeColor: '#FF6B35',
    statusList: [
      { key: 'pending_payment', label: '待付款', icon: '/images/mine/pending-pay.svg', count: 0 },
      { key: 'pending_ship', label: '待发货', icon: '/images/mine/pending-send.svg', count: 0 },
      { key: 'pending_receive', label: '待收货', icon: '/images/mine/pending-receive.svg', count: 0 },
      { key: 'pending_review', label: '待评价', icon: '/images/mine/pending-review.svg', count: 0 },
      { key: 'refund', label: '退款/售后', icon: '/images/mine/refund.svg', count: 0 },
    ],
  },

  onShow() {
    const u = auth.getUser();
    this.setData({
      user: u,
      avatarChar: u && u.nickname ? u.nickname[0] : '客',
    });
    settings.fetchSettings(true).then((s) => {
      this.setData({ themeColor: s.theme_color || '#FF6B35' });
    });
    this.loadOrderCounts();
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 });
    }
  },

  loadOrderCounts() {
    api.get('/order/counts')
      .then((res) => {
        const counts = (res && res.counts) || {};
        const statusList = this.data.statusList.map((item) => ({
          ...item,
          count: counts[item.key] || 0,
        }));
        this.setData({ statusList });
      })
      .catch(() => {});
  },

  onSign() {
    wx.showToast({ title: '签到功能开发中', icon: 'none' });
  },

  onOpenVip() {
    wx.showToast({ title: '会员卡功能开发中', icon: 'none' });
  },

  goOrders() {
    wx.showToast({ title: '全部订单开发中', icon: 'none' });
  },

  onStatusTap(e) {
    const key = e.currentTarget.dataset.key;
    const item = this.data.statusList.find((i) => i.key === key);
    wx.showToast({ title: (item ? item.label : '') + ' 开发中', icon: 'none' });
  },

  goAddress() {
    wx.navigateTo({ url: '/pages/address/address' });
  },

  goCoupon() {
    wx.showToast({ title: '优惠券开发中', icon: 'none' });
  },

  goService() {
    wx.showToast({ title: '客服中心开发中', icon: 'none' });
  },

  goAbout() {
    wx.showToast({ title: '关于我们开发中', icon: 'none' });
  },
});
