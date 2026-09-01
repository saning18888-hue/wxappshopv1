// 商品分类页：竖版（左分类右商品网格）/ 横版（顶部分类横滑 + 商品横卡片）
// 渲染分支由后台装修配置 settings.view_style 决定（vertical / horizontal）
const api = require('../../utils/request');
const settings = require('../../utils/settings');
const { asset } = require('../../utils/img');

Page({
  data: {
    cats: [],           // 全部分类（来自 /categories）
    activeId: 0,        // 当前选中分类 id
    list: [],           // 当前分类下的商品
    loading: false,
    keyword: '',
    themeColor: '#FF6B35',
    viewStyle: 'vertical',  // vertical / horizontal，由后台装修下发
    showPromo: true,        // 商品卡片是否展示促销语（后台 show_promo 开关）
    pageSize: 50,
    sort: 'new',
    order: 'desc',
  },

  onLoad() {
    // 拉主题色 + 装修配置（viewStyle / pageSize / sort / order / categoryIds）
    Promise.all([
      settings.fetchSettings(true).catch(() => ({})),
      api.get('/category_page').catch(() => null),
      api.get('/categories').catch(() => ({ list: [] })),
    ]).then(([s, design, catRes]) => {
      const themeColor = (s && s.theme_color) || '#FF6B35';
      const settingsCfg = (design && design.settings) || {};
      const viewStyle = settingsCfg.view_style || 'vertical';
      const pageSize  = settingsCfg.page_size || 50;
      const sort      = settingsCfg.sort || 'new';
      const order     = settingsCfg.order || 'desc';
      const showPromo = settingsCfg.show_promo !== false;
      const cats = (catRes && catRes.list) || [];
      // 后台指定了 categoryIds 则优先；否则取第一个分类
      const configuredIds = Array.isArray(settingsCfg.category_ids) ? settingsCfg.category_ids : [];
      const firstId = cats[0] ? cats[0].id : 0;
      const activeId = configuredIds.length
        ? (cats.find(c => Number(c.id) === Number(configuredIds[0])) ? Number(configuredIds[0]) : firstId)
        : firstId;
      this.setData({ themeColor, viewStyle, pageSize, sort, order, cats, activeId, showPromo });
      if (activeId) this.loadGoods(activeId);
      this._loaded = true;
    });
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
    // 每次回到分类页都重新拉取，确保后台改动的促销语/排序等实时生效
    if (this._loaded && this.data.activeId) {
      this.loadGoods(this.data.activeId);
    }
  },

  // 竖版：左分类列点击切换
  switchCat(e) {
    const id = e.currentTarget.dataset.id;
    if (Number(id) === Number(this.data.activeId)) return;
    this.setData({ activeId: Number(id), list: [] });
    this.loadGoods(Number(id));
  },

  // 横版：顶部 chip 横滑，点击切换
  switchCatChip(e) {
    const id = e.currentTarget.dataset.id;
    if (Number(id) === Number(this.data.activeId)) return;
    this.setData({ activeId: Number(id), list: [] });
    this.loadGoods(Number(id));
  },

  onSearchInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  onSearchConfirm() {
    const { keyword } = this.data;
    if (!keyword.trim()) return;
    wx.navigateTo({ url: '/pages/goods/list/list?keyword=' + encodeURIComponent(keyword.trim()) });
  },

  clearSearch() {
    this.setData({ keyword: '' });
  },

  

  // 商品数据：按装修后台 settings.sort/order/page_size 传给 /goods
  loadGoods(categoryId) {
    if (!categoryId) return;
    this.setData({ loading: true });
    const { pageSize, sort, order } = this.data;
    api.get('/goods', {
      category_id: categoryId,
      page: 1,
      page_size: pageSize,
      sort,
      order,
    }).then((res) => {
      const list = (res.list || []).map((g) => ({
        ...g,
        cover_url: asset(g.cover || g.cover_url || ''),
      }));
      this.setData({ list, loading: false });
    }).catch(() => {
      this.setData({ loading: false });
    });
  },

  addCart(e) {
    const id = e.currentTarget.dataset.id;
    api.get('/goods/' + id)
      .then((detail) => {
        const skus = detail.skus || [];
        if (!skus.length) {
          wx.showToast({ title: '该商品暂无规格', icon: 'none' });
          return Promise.reject(new Error('no sku'));
        }
        const sku = skus[0];
        return api.post('/cart', { sku_id: sku.id, quantity: 1 });
      })
      .then(() => wx.showToast({ title: '已加入购物车', icon: 'success' }))
      .catch((err) => {
        if (err && err.message === 'no sku') return;
        wx.showToast({ title: err.message || '添加失败', icon: 'none' });
      });
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/goods/detail/detail?id=' + e.currentTarget.dataset.id });
  },
});