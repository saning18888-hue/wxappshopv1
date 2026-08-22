const { goLink } = require('../../utils/mock');

Component({
  properties: {
    components: { type: Array, value: [] },
    goodsList: { type: Array, value: [] },
    cats: { type: Array, value: [] },
  },
  data: { viewList: [] },
  observers: {
    'components, goodsList, cats'(comps, goods, cats) {
      const list = (comps || [])
        .filter((c) => !(c.props && c.props.hidden))
        .map((c) => {
        if (c.type === 'nav_grid') {
          const cols = (c.props && c.props.columns) || 5;
          return Object.assign({}, c, { colWidth: 100 / cols + '%' });
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
                    return Object.assign({}, slot, live || {});
                  })
                  .filter((x) => x && x.id);
                return Object.assign({}, m, { goods: moduleGoods });
              })
              .filter((m) => (m.goods || []).length);
            return Object.assign({}, c, { modules, colWidth: 100 / columns + '%' });
          }
          // 兼容旧数据
          const show = props.show_count || 4;
          let items = (goods || []).slice(0, show);
          if (props.source === 'category' && props.category_id) {
            items = (goods || []).filter((g) => g.category_id === Number(props.category_id)).slice(0, show);
          }
          return Object.assign({}, c, { items, colWidth: 100 / columns + '%' });
        }
        if (c.type === 'category_nav') {
          let catList = cats || [];
          if (c.props && c.props.source === 'ids' && Array.isArray(c.props.category_ids) && c.props.category_ids.length) {
            const ids = c.props.category_ids.map(Number);
            catList = (cats || []).filter((cat) => ids.indexOf(cat.id) >= 0);
          }
          const cols = (c.props && c.props.columns) || 4;
          return Object.assign({}, c, { catList, colWidth: 100 / cols + '%' });
        }
        if (c.type === 'notice') {
          const props = c.props || {};
          const items = props.items || [];
          const icon = props.icon || '📢';
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
          return Object.assign({}, c, {
            props: Object.assign({}, props, { banners: props.banners || module.banners || [], columns: props.columns || 1 }),
          });
        }
        return c;
      });
      this.setData({ viewList: list });
    },
  },
  methods: {
    onTapLink(e) {
      goLink(e.currentTarget.dataset.link);
    },
    onTapGoods(e) {
      wx.navigateTo({ url: '/pages/goods/detail/detail?id=' + e.currentTarget.dataset.id });
    },
    onTapCategory(e) {
      wx.navigateTo({ url: '/pages/goods/list/list?category_id=' + e.currentTarget.dataset.id });
    },
  },
});
