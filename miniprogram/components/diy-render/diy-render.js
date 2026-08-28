const { goLink } = require('../../utils/mock');
const settings = require('../../utils/settings');
const api = require('../../utils/request');
const config = require('../../config');
const app = getApp();

// 资源域名：从 config.baseUrl 派生（http://host:port），用于补全后端返回的 /uploads/... 相对路径
const ASSET_BASE = (config.baseUrl || '').replace(/\/api\/v1$/, '');

// 图片地址补全：已是完整 http(s)  URL 的原样返回；以 / 开头的相对路径拼上当前资源域名
function ix(p) {
  if (!p || typeof p !== 'string') return p;
  if (p.indexOf('http://') === 0 || p.indexOf('https://') === 0) return p;
  if (p.indexOf('/') === 0) return ASSET_BASE + p;
  return p;
}

// 重新拉取购物车数量并广播到悬浮角标
function refreshCartCount() {
  api.get('/cart').then((res) => {
    const list = (res && res.list) || [];
    const count = list.reduce((sum, i) => sum + (i.quantity || 0), 0);
    app.emitCartCount(count);
  }).catch(() => {});
}

// 各加购图标 SVG 模板，使用 currentColor 占位，运行时替换为后台配置的颜色
const CART_ICON_SVGS = {
  cart1: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2 3h2.2l2.1 2h12.7a1 1 0 0 1 .99 1.14l-1.1 6.5A2 2 0 0 1 16.9 14.5H8.2a2 2 0 0 1-1.97-1.6L4.5 6H2.5a1 1 0 0 1-.5-3z"/><circle cx="9.5" cy="19" r="1.6"/><circle cx="16.5" cy="19" r="1.6"/></svg>',
  cart2: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h2l2.68 13.39a2 2 0 0 0 1.97 1.61h9.7a2 2 0 0 0 1.97-1.61L23 6H6.5z"/><circle cx="10.5" cy="20.5" r="1.6"/><circle cx="19" cy="20.5" r="1.6"/></svg>',
  cart3: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h2.2l2.1 2.4h11.7a1 1 0 0 1 .99 1.2l-1.2 6.6a2 2 0 0 1-1.97 1.6H8.6a2 2 0 0 1-1.96-1.56L5 5.6H2.9a.9.9 0 0 1-.9-.9A.9.9 0 0 1 2.9 4H3z"/><circle cx="9.4" cy="19.4" r="1.6"/><circle cx="16.6" cy="19.4" r="1.6"/></svg>',
  cart4: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>',
  cart7: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M5 5h2l2 3h10a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H8.5a2 2 0 0 1-2-1.5L4.5 7H2V5h3zm4 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>',
  plus: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>',
  plus2: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
};

// 根据图标类型与颜色生成 data-uri，解决 <image> 加载外部 svg 时 currentColor 失效（始终黑色）的问题
function buildCartIcon(type, color) {
  const tpl = CART_ICON_SVGS[type];
  if (!tpl) return '';
  const svg = tpl.replace(/currentColor/g, color);
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

Component({
  properties: {
    components: { type: Array, value: [] },
    goodsList: { type: Array, value: [] },
    cats: { type: Array, value: [] },
  },
  data: {
    viewList: [],
    cartIcon: '', // 商品卡片加购图标 data-uri，对应后台 cart_icon + cart_icon_color
    cartIconBg: '#ffeded', // 商品卡片加购按钮底色
  },
  observers: {
    'components, goodsList, cats'(comps, goods, cats) {
      const list = (comps || [])
        .filter((c) => !(c.props && c.props.hidden))
        .map((c) => {
        if (c.type === 'banner') {
          const props = c.props || {};
          const items = (props.items || []).map((b) => {
            const nb = Object.assign({}, b);
            if (nb.image) nb.image = ix(nb.image);
            if (nb.video) nb.video = ix(nb.video);
            return nb;
          });
          return Object.assign({}, c, { props: Object.assign({}, props, { items }) });
        }
        if (c.type === 'nav_grid') {
          const cols = (c.props && c.props.columns) || 5;
          const items = (c.props && c.props.items || []).map((n) => Object.assign({}, n, { icon: ix(n.icon) }));
          return Object.assign({}, c, { colWidth: 100 / cols + '%', props: Object.assign({}, c.props, { items }) });
        }
        if (c.type === 'goods_group') {
          const props = c.props || {};
          const columns = props.columns || 2;
          // 新数据结构：modules 为推荐模块，每个模块含商品列表
          if (Array.isArray(props.modules)) {
            const modules = props.modules
              .filter((m) => !m.hidden)
              .map((m) => {
                const moduleGoods = (m.goods || [])
                  .map((slot) => {
                    const live = (goods || []).find((g) => g.id === slot.id);
                    const merged = Object.assign({}, slot, live || {});
                    if (merged.cover) merged.cover = ix(merged.cover);
                    if (merged.thumb) merged.thumb = ix(merged.thumb);
                    return merged;
                  })
                  .filter((x) => x && x.id);
                return Object.assign({}, m, { goods: moduleGoods });
              })
              .filter((m) => (m.goods || []).length);
            return Object.assign({}, c, { modules, colWidth: 100 / columns + '%' });
          }
          // 兼容旧数据
          const show = props.show_count || 4;
          let items = (goods || []).slice(0, show).map((g) => {
            const ng = Object.assign({}, g);
            if (ng.cover) ng.cover = ix(ng.cover);
            if (ng.thumb) ng.thumb = ix(ng.thumb);
            return ng;
          });
          if (props.source === 'category' && props.category_id) {
            items = (goods || []).filter((g) => g.category_id === Number(props.category_id)).slice(0, show)
              .map((g) => {
                const ng = Object.assign({}, g);
                if (ng.cover) ng.cover = ix(ng.cover);
                if (ng.thumb) ng.thumb = ix(ng.thumb);
                return ng;
              });
          }
          return Object.assign({}, c, { items, colWidth: 100 / columns + '%' });
        }
        if (c.type === 'category_nav') {
          let catList = (cats || []).map((cat) => {
            const nc = Object.assign({}, cat);
            if (nc.icon) nc.icon = ix(nc.icon);
            return nc;
          });
          if (c.props && c.props.source === 'ids' && Array.isArray(c.props.category_ids) && c.props.category_ids.length) {
            const ids = c.props.category_ids.map(Number);
            // 按选择的顺序展示，避免与装修后台指定的顺序不一致
            catList = ids.map((id) => (cats || []).find((cat) => cat.id === id)).filter(Boolean)
              .map((cat) => {
                const nc = Object.assign({}, cat);
                if (nc.icon) nc.icon = ix(nc.icon);
                return nc;
              });
          }
          const cols = (c.props && c.props.columns) || 4;
          return Object.assign({}, c, { catList, colWidth: 100 / cols + '%' });
        }
        if (c.type === 'notice') {
          const props = c.props || {};
          const items = props.items || [];
          let icon = props.icon || '📢';
          if (typeof icon === 'string' && (icon.indexOf('http') === 0 || icon.indexOf('/') === 0)) icon = ix(icon);
          return Object.assign({}, c, {
            noticeStyle: props.style || 'fixed',
            bg: props.bg || '#F4F5FF',
            color: props.color || '#5e6ad2',
            icon,
            iconIsImg: typeof icon === 'string' && (icon.indexOf('http') === 0 || icon.indexOf('/') === 0),
            items,
            marqueeText: items.map((i) => i.text || '').join('     ◆     '),
            vItems: items.concat(items),
          });
        }
        if (c.type === 'banner_ad') {
          const props = c.props || {};
          const module = (props.modules && props.modules[0]) || {};
          const banners = (props.banners || module.banners || []).map((b) => {
            const nb = Object.assign({}, b);
            if (nb.image) nb.image = ix(nb.image);
            if (nb.video) nb.video = ix(nb.video);
            return nb;
          });
          return Object.assign({}, c, {
            props: Object.assign({}, props, { banners, columns: props.columns || 1 }),
          });
        }
        return c;
      });
      this.setData({ viewList: list });
    },
  },
  methods: {
    loadSettings() {
      settings.fetchSettings(false).then((s) => {
        if (!s) return;
        const type = s.cart_icon;
        const color = s.cart_icon_color || '#ff4d4f';
        this.setData({
          cartIcon: type && type !== 'none' ? buildCartIcon(type, color) : '',
          cartIconBg: s.cart_icon_bg || '#ffeded',
        });
      });
    },
    onTapLink(e) {
      goLink(e.currentTarget.dataset.link);
    },
    onTapGoods(e) {
      wx.navigateTo({ url: '/pages/goods/detail/detail?id=' + e.currentTarget.dataset.id });
    },
    onTapCategory(e) {
      wx.navigateTo({ url: '/pages/goods/list/list?category_id=' + e.currentTarget.dataset.id });
    },
    onTapCart(e) {
      e.stopPropagation && e.stopPropagation();
      const id = e.currentTarget.dataset.id;
      api.post('/cart', { goods_id: id, sku_id: id, quantity: 1 })
        .then((res) => {
          if (res && res.code && res.code !== 0) {
            wx.showToast({ title: res.msg || '加购失败', icon: 'none' });
            return;
          }
          wx.showToast({ title: '已加入购物车', icon: 'success' });
          refreshCartCount();
        })
        .catch(() => wx.showToast({ title: '加购失败', icon: 'none' }));
    },
  },
  lifetimes: {
    attached() {
      this.loadSettings();
    },
  },
  pageLifetimes: {
    show() {
      this.loadSettings();
    },
  },
});
