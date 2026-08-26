const app = getApp();

Page({
  data: {
    mode: 'new',           // new / edit
    form: { name: '', phone: '', region: '', detail: '' },
    isDefault: true,
    editId: null,
    fromPage: '',
  },

  onLoad(opts) {
    const mode = opts.mode || 'new';
    this.setData({ mode, fromPage: opts.from || '' });

    if (mode === 'edit' && app.globalData.editingAddress) {
      const a = app.globalData.editingAddress;
      // 拆分地址为区域+详细
      const fullAddr = a.address || '';
      this.setData({
        form: { name: a.name || '', phone: a.phone || '', region: '', detail: fullAddr },
        isDefault: !!a.is_default,
        editId: a.id || null,
      });
    }
  },

  /* ===== 输入 ===== */
  onInput(e) {
    const field = e.currentTarget.dataset.field;
    const form = Object.assign({}, this.data.form);
    form[field] = e.detail.value;
    this.setData({ form });
  },

  /* ===== 区域选择 ===== */
  pickRegion() {
    wx.chooseLocation({
      success: (res) => {
        const form = Object.assign({}, this.data.form);
        form.region = (res.address || '').replace(/.*?(省|市|自治区|特别行政区)/, '$&');
        if (!form.detail) form.detail = res.name || '';
        this.setData({ form });
      },
      fail: () => wx.showToast({ title: '请手动输入地址', icon: 'none' }),
    });
  },

  toggleDefault(e) {
    this.setData({ isDefault: !!e.detail.value });
  },

  /* ===== 校验 ===== */
  validate() {
    const f = this.data.form;
    if (!f.name.trim()) { wx.showToast({ title: '请输入收件人', icon: 'none' }); return false; }
    if (!/^1\d{10}$/.test(f.phone)) { wx.showToast({ title: '请输入正确手机号', icon: 'none' }); return false; }
    if (!f.detail.trim()) { wx.showToast({ title: '请输入详细地址', icon: 'none' }); return false; }
    return true;
  },

  /* ===== 保存 ===== */
  doSave() {
    if (!this.validate()) return;
    const f = this.data.form;
    const addrData = {
      name: f.name.trim(),
      phone: f.phone.trim(),
      address: (f.region ? f.region + ' ' : '') + f.detail.trim(),
      is_default: this.data.isDefault,
    };

    let list = wx.getStorageSync('address_list') || [];

    if (this.data.mode === 'edit' && this.data.editId != null) {
      // 编辑模式：更新原记录
      const idx = list.findIndex((a) => a.id === this.data.editId);
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...addrData };
      }
    } else {
      // 新建模式
      addrData.id = Date.now();
      // 如果设为默认，取消其他默认
      if (addrData.is_default) {
        list = list.map((a) => ({ ...a, is_default: false }));
      } else if (list.length === 0) {
        addrData.is_default = true;
      }
      list.push(addrData);
    }

    // 确保至少一个默认
    if (list.length > 0 && !list.some((a) => a.is_default)) {
      list[0].is_default = true;
    }

    wx.setStorageSync('address_list', list);

    // 如果是从确认订单来的，直接返回选中的地址
    if (this.data.fromPage === 'confirm') {
      const pages = getCurrentPages();
      const prev = pages[pages.length - 2];
      if (prev && prev.getOpenerEventChannel) {
        try {
          prev.getOpenerEventChannel().emit('acceptAddr', {
            name: addrData.name,
            phone: addrData.phone,
            region: '',
            address: addrData.address,
            isDefault: !!addrData.is_default,
          });
        } catch (e) { /* ignore */ }
      }
    }

    wx.navigateBack();
  },

  doCancel() {
    wx.navigateBack();
  },
});
