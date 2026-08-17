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
      const list = (comps || []).map((c) => {
        if (c.type === 'nav_grid') {
          const cols = (c.props && c.props.columns) || 5;
          return Object.assign({}, c, { colWidth: 100 / cols + '%' });
        }
        if (c.type === 'goods_group') {
          const props = c.props || {};
          const columns = props.columns || 2;
          // 新数据结构：modules 为 9 个推荐模块，每个模块含商品列表
          if (Array.isArray(props.modules)) {
            const modules = props.modules
              .map((m) => {
                const moduleGoods = (m.goods || [])
                  .map((slot) => {
                    const live = (goods || []).find((g) => g.id === slot.id);
                    return Object.assign({}, slot, live || {});
                  })
                  .filter((g) => g && g.id);
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
