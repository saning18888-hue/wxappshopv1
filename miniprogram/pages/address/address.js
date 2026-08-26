const app = getApp();

Page({
  data: {
    list: [],           // 地址列表
    fromPage: '',       // 来源页（confirm=确认订单选择模式）
  },

  onLoad(opts) {
    this.setData({ fromPage: opts.from || '' });
    this.loadList();
  },

  onShow() {
    // 从编辑页返回时刷新列表
    if (this._fromEdit) { this.loadList(); this._fromEdit = false; }
  },

  /* ===== 数据加载 ===== */
  loadList() {
    // 先从本地存储读取（后续对接后端API）
    let list = wx.getStorageSync('address_list') || [];
    // 确保至少有一个默认地址
    if (list.length > 0 && !list.some((a) => a.is_default)) {
      list[0].is_default = true;
      wx.setStorageSync('address_list', list);
    }
    this.setData({ list });
  },
  _saveList(list) {
    wx.setStorageSync('address_list', list);
    this.setData({ list });
  },

  /* ===== 选择地址（确认订单场景）===== */
  selectAddr(e) {
    const idx = e.currentTarget.dataset.index;
    const addr = this.data.list[idx];
    if (!this.data.fromPage) return; // 非选择模式不处理

    // 通过 eventChannel 返回给来源页
    const pages = getCurrentPages();
    const prev = pages[pages.length - 2];
    if (prev && prev.getOpenerEventChannel) {
      try {
        prev.getOpenerEventChannel().emit('acceptAddr', {
          name: addr.name,
          phone: addr.phone,
          region: '',
          address: addr.address,
          isDefault: !!addr.is_default,
        });
      } catch (e) { /* ignore */ }
    }
    wx.navigateBack();
  },

  stopTap() {}, // 阻止冒泡

  /* ===== 设为默认 ===== */
  setDefault(e) {
    const id = e.currentTarget.dataset.id;
    const list = this.data.list.map((a) => ({ ...a, is_default: a.id === id }));
    this._saveList(list);
    wx.showToast({ title: '已设为默认', icon: 'none' });
  },

  /* ===== 编辑 ===== */
  editAddr(e) {
    const idx = e.currentTarget.dataset.index;
    app.globalData.editingAddress = this.data.list[idx];
    this._fromEdit = true;
    wx.navigateTo({ url: '/pages/address-form/address-form?mode=edit&from=' + this.data.fromPage });
  },

  /* ===== 删除 ===== */
  deleteAddr(e) {
    const idx = e.currentTarget.dataset.index;
    const addr = this.data.list[idx];
    wx.showModal({
      title: '确认删除',
      content: '确定删除该收货地址吗？',
      success: (res) => {
        if (!res.confirm) return;
        const list = this.data.list.filter((_, i) => i !== idx);
        // 如果删的是默认，自动选第一个为默认
        if (addr.is_default && list.length > 0) list[0].is_default = true;
        this._saveList(list);
        wx.showToast({ title: '已删除', icon: 'none' });
      },
    });
  },

  /* ===== 微信收货地址 ===== */
  onWechatAddr(e) {
    const detail = e.detail;
    if (!detail || !detail.userName) return;
    const addr = {
      id: Date.now(),
      name: detail.userName,
      phone: detail.telNumber,
      address: (detail.provinceName || '') + (detail.cityName || '') + (detail.countyName || '') + (detail.detailInfo || ''),
      is_default: this.data.list.length === 0,
    };
    const list = [...this.data.list, addr];
    this._saveList(list);
    wx.showToast({ title: '已添加', icon: 'none' });
  },

  /* ===== 新建 ===== */
  newAddr() {
    app.globalData.editingAddress = null;
    this._fromEdit = true;
    wx.navigateTo({ url: '/pages/address-form/address-form?mode=new&from=' + this.data.fromPage });
  },
});
