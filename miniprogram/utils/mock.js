// =====================================================================
// Mock 数据层：与后端 install.sql 种子一致，金额以「元」为单位
// 用于无后端时直接在小程序开发者工具跑通闭环演示
// =====================================================================

// ---- 商品列表（SPU） ----
const goodsList = [
  { id: 1, category_id: 11, title: '云南蜜橘 5斤装', subtitle: '皮薄多汁 产地直发', price: 19.9, market_price: 29.9, stock: 100, sales: 320, cover: 'https://placehold.co/400x400/FF6B35/fff?text=Orange', images: ['https://placehold.co/400x400/FF6B35/fff?text=Orange', 'https://placehold.co/400x400/FFB035/fff?text=Orange2'] },
  { id: 2, category_id: 11, title: '泰国金枕榴莲 3斤', subtitle: '树熟发货 软糯香甜', price: 59.9, market_price: 79.9, stock: 50, sales: 88, cover: 'https://placehold.co/400x400/00B86B/fff?text=Durian', images: ['https://placehold.co/400x400/00B86B/fff?text=Durian'] },
  { id: 3, category_id: 21, title: '每日坚果 30包', subtitle: '混合果仁 独立小包', price: 99, market_price: 129, stock: 200, sales: 1500, cover: 'https://placehold.co/400x400/4A90E2/fff?text=Nut', images: ['https://placehold.co/400x400/4A90E2/fff?text=Nut'] },
  { id: 4, category_id: 22, title: '手撕风干牛肉干 200g', subtitle: '内蒙古草饲 高蛋白', price: 39.9, market_price: 49.9, stock: 80, sales: 460, cover: 'https://placehold.co/400x400/9B59B6/fff?text=Beef', images: ['https://placehold.co/400x400/9B59B6/fff?text=Beef'] },
];

// ---- 商品详情（含规格/SKU） ----
const goodsDetail = {
  1: {
    id: 1, title: '云南蜜橘 5斤装', subtitle: '皮薄多汁 产地直发', price: 19.9, market_price: 29.9, stock: 100, sales: 320,
    images: ['https://placehold.co/400x400/FF6B35/fff?text=Orange', 'https://placehold.co/400x400/FFB035/fff?text=Orange2'], video: '',
    detail_html: '<p>产自云南高原，皮薄多汁，5斤装约8-12个。</p>',
    spec_groups: [{ id: 1, name: '规格', values: [{ id: 1, value: '5斤装' }, { id: 2, value: '10斤装' }] }],
    skus: [
      { id: 1, spec_value_ids: '1', price: 19.9, market_price: 29.9, stock: 60, image: 'https://placehold.co/400x400/FF6B35/fff?text=5斤' },
      { id: 2, spec_value_ids: '2', price: 36.9, market_price: 49.9, stock: 40, image: 'https://placehold.co/400x400/FFB035/fff?text=10斤' },
    ],
  },
  2: {
    id: 2, title: '泰国金枕榴莲 3斤', subtitle: '树熟发货 软糯香甜', price: 59.9, market_price: 79.9, stock: 50, sales: 88,
    images: ['https://placehold.co/400x400/00B86B/fff?text=Durian'], video: '',
    detail_html: '<p>泰国进口金枕榴莲，自然树熟，肉厚核小。</p>',
    spec_groups: [], skus: [{ id: 3, spec_value_ids: '', price: 59.9, market_price: 79.9, stock: 50, image: 'https://placehold.co/400x400/00B86B/fff?text=Durian' }],
  },
  3: {
    id: 3, title: '每日坚果 30包', subtitle: '混合果仁 独立小包', price: 99, market_price: 129, stock: 200, sales: 1500,
    images: ['https://placehold.co/400x400/4A90E2/fff?text=Nut'], video: '',
    detail_html: '<p>巴旦木/腰果/蔓越莓等混合，每日一包健康好吃。</p>',
    spec_groups: [
      { id: 2, name: '口味', values: [{ id: 3, value: '原味' }, { id: 4, value: '蜂蜜黄油炸' }] },
      { id: 3, name: '包装', values: [{ id: 5, value: '盒装' }, { id: 6, value: '袋装' }] },
    ],
    skus: [
      { id: 4, spec_value_ids: '3,5', price: 99, market_price: 129, stock: 120, image: 'https://placehold.co/400x400/4A90E2/fff?text=原味盒' },
      { id: 5, spec_value_ids: '4,6', price: 99, market_price: 129, stock: 80, image: 'https://placehold.co/400x400/4A90E2/fff?text=黄油袋' },
    ],
  },
  4: {
    id: 4, title: '手撕风干牛肉干 200g', subtitle: '内蒙古草饲 高蛋白', price: 39.9, market_price: 49.9, stock: 80, sales: 460,
    images: ['https://placehold.co/400x400/9B59B6/fff?text=Beef'], video: '',
    detail_html: '<p>精选牛后腿肉，低温风干，嚼劲十足。</p>',
    spec_groups: [], skus: [{ id: 6, spec_value_ids: '', price: 39.9, market_price: 49.9, stock: 80, image: 'https://placehold.co/400x400/9B59B6/fff?text=Beef' }],
  },
};

// ---- 分类树 ----
const categories = [
  { id: 1, parent_id: 0, name: '生鲜果蔬', icon: 'https://placehold.co/96x96/FF6B35/fff?text=果', children: [
    { id: 11, parent_id: 1, name: '新鲜水果' }, { id: 12, parent_id: 1, name: '时令蔬菜' } ] },
  { id: 2, parent_id: 0, name: '休闲零食', icon: 'https://placehold.co/96x96/00B86B/fff?text=零', children: [
    { id: 21, parent_id: 2, name: '坚果炒货' }, { id: 22, parent_id: 2, name: '肉脯肉干' } ] },
  { id: 3, parent_id: 0, name: '家用电器', icon: 'https://placehold.co/96x96/4A90E2/fff?text=电', children: [] },
];

// ---- 首页 DIY 默认装修 ----
const defaultHome = {
  page: 'home', version: 1,
  components: [
    { type: 'banner', sort: 1, props: { items: [
      { image: 'https://placehold.co/750x320/FF6B35/ffffff?text=Banner1', link: { type: 'goods', id: 1 } },
      { image: 'https://placehold.co/750x320/00B86B/ffffff?text=Banner2', link: { type: 'goods', id: 2 } },
    ], interval: 4 } },
    { type: 'nav_grid', sort: 2, props: { columns: 5, items: [
      { icon: 'https://placehold.co/96x96/FF6B35/fff?text=新', text: '新品', link: { type: 'category', id: 1 } },
      { icon: 'https://placehold.co/96x96/00B86B/fff?text=热', text: '热卖', link: { type: 'category', id: 2 } },
      { icon: 'https://placehold.co/96x96/FFB035/fff?text=券', text: '领券', link: { type: 'activity', id: 1 } },
      { icon: 'https://placehold.co/96x96/4A90E2/fff?text=秒', text: '秒杀', link: { type: 'activity', id: 2 } },
      { icon: 'https://placehold.co/96x96/9B59B6/fff?text=更', text: '更多', link: { type: 'category', id: 3 } },
    ] } },
    { type: 'goods_group', sort: 3, props: { title: '精选推荐', columns: 2, modules: Array.from({ length: 4 }, (_, i) => ({ id: i + 1, name: '推荐模块 ' + (i + 1), title: '推荐模块 ' + (i + 1), goods: [1, 2, 3, 4].map(g => ({ id: g, title: '商品 ' + g, cover: 'https://placehold.co/200x200/5e6ad2/fff?text=P' + g, price: 99 + g })) })) } },
    { type: 'category_nav', sort: 4, props: { title: '商品分类', columns: 4, source: 'all', category_ids: [] } },
  ],
};

// ---- 运行时状态（购物车 / 订单，内存态） ----
const state = {
  token: null,
  user: null,
  cartSeq: 1,
  cart: [],
  orderSeq: 1,
  orders: [],
};

// 在 SKU 中按 id 查找商品信息
function findSku(skuId) {
  for (const gid in goodsDetail) {
    const sku = goodsDetail[gid].skus.find((s) => s.id === skuId);
    if (sku) {
      return { goods: goodsDetail[gid], sku };
    }
  }
  return null;
}

function specDesc(sku) {
  if (!sku.spec_value_ids) return '';
  const ids = sku.spec_value_ids.split(',').map(Number);
  const out = [];
  for (const gid in goodsDetail) {
    goodsDetail[gid].spec_groups.forEach((g) => {
      g.values.forEach((v) => {
        if (ids.includes(v.id)) out.push(v.value);
      });
    });
  }
  return out.join(' / ');
}

// 统一路由跳转（根据 link.type）
function goLink(link) {
  if (!link) return;
  if (link.type === 'goods') {
    wx.navigateTo({ url: '/pages/goods/detail/detail?id=' + link.id });
  } else if (link.type === 'category') {
    wx.navigateTo({ url: '/pages/goods/list/list?category_id=' + link.id });
  } else {
    wx.showToast({ title: '活动即将上线', icon: 'none' });
  }
}

// 主分发器
function dispatch(method, path, data = {}) {
  path = (path || '').split('?')[0];

  // 登录
  if (method === 'POST' && path === '/auth/dev_login') {
    state.token = 'mock_token_' + Date.now();
    state.user = { id: 1, nickname: '演示会员', avatar: '' };
    return { code: 0, msg: 'success', data: { token: state.token, user: state.user } };
  }
  if (path === '/user/info') {
    return { code: 0, data: { user: state.user || { id: 1, nickname: '演示会员' } } };
  }
  if (path === '/home') {
    return { code: 0, data: defaultHome };
  }
  if (path === '/categories') {
    return { code: 0, data: { list: categories } };
  }
  if (path === '/goods' && method === 'GET') {
    let list = goodsList.slice();
    if (data.category_id) {
      const cid = Number(data.category_id);
      const cat = categories.find((c) => c.id === cid);
      const ids = cat && cat.children && cat.children.length ? cat.children.map((c) => c.id) : [cid];
      list = list.filter((g) => ids.indexOf(g.category_id) >= 0);
    }
    if (data.keyword) list = list.filter((g) => g.title.indexOf(data.keyword) >= 0);
    return { code: 0, data: { list, total: list.length, page: data.page || 1, page_size: 10 } };
  }
  const gm = path.match(/^\/goods\/(\d+)$/);
  if (gm && method === 'GET') {
    const d = goodsDetail[gm[1]];
    return d ? { code: 0, data: d } : { code: 404, msg: '商品不存在或已下架' };
  }

  // 购物车
  if (path === '/cart' && method === 'GET') {
    return { code: 0, data: { list: state.cart.slice(), total_count: state.cart.length, selected_amount: 0 } };
  }
  if (path === '/cart' && method === 'POST') {
    const found = findSku(Number(data.sku_id));
    if (!found) return { code: 400, msg: '商品或 SKU 不存在' };
    if (found.sku.stock < Number(data.quantity)) return { code: 400, msg: '库存不足' };
    const exist = state.cart.find((c) => c.sku_id === Number(data.sku_id));
    if (exist) {
      exist.quantity += Number(data.quantity);
    } else {
      state.cart.push({
        id: state.cartSeq++, goods_id: found.goods.id, sku_id: found.sku.id,
        title: found.goods.title, cover: found.sku.image || found.goods.cover,
        price: found.sku.price, stock: found.sku.stock,
        quantity: Number(data.quantity), spec_desc: specDesc(found.sku),
      });
    }
    return { code: 0, msg: '已加入购物车' };
  }
  const cm = path.match(/^\/cart\/(\d+)$/);
  if (cm && method === 'PUT') {
    const item = state.cart.find((c) => c.id === Number(cm[1]));
    if (!item) return { code: 404, msg: '购物车项不存在' };
    if (Number(data.quantity) <= 0) {
      state.cart = state.cart.filter((c) => c.id !== item.id);
    } else {
      item.quantity = Number(data.quantity);
    }
    return { code: 0, msg: 'ok' };
  }
  if (cm && method === 'DELETE') {
    state.cart = state.cart.filter((c) => c.id !== Number(cm[1]));
    return { code: 0, msg: '已移除' };
  }

  // 订单预览 / 创建
  if (path === '/order/preview' && method === 'POST') {
    return { code: 0, data: buildOrder(data.items, data.address, false) };
  }
  if (path === '/order' && method === 'POST') {
    const order = buildOrder(data.items, data.address, true);
    state.orders.unshift(order._order);
    return { code: 0, msg: '下单成功', data: { order_id: order._order.id, order_no: order._order.order_no, pay_amount: order.pay_amount, pay: { mock: true } } };
  }
  if (path === '/order' && method === 'GET') {
    return { code: 0, data: { list: state.orders.slice(), total: state.orders.length, page: data.page || 1, page_size: 10 } };
  }
  const om = path.match(/^\/order\/(\d+)$/);
  if (om && method === 'GET') {
    const o = state.orders.find((x) => x.id === Number(om[1]));
    return o ? { code: 0, data: o } : { code: 404, msg: '订单不存在' };
  }

  // 模拟支付回调
  if (path === '/payment/mock_notify' && method === 'POST') {
    const o = state.orders.find((x) => x.order_no === data.order_no);
    if (!o) return { code: 404, msg: '订单不存在' };
    if (o.status !== 0) return { code: 0, data: { paid: true } };
    o.status = 1; o.status_text = '已付款/待履约'; o.pay_time = now();
    return { code: 0, data: { paid: true } };
  }

  return { code: 404, msg: '接口不存在: ' + method + ' ' + path };
}

// 计算订单（预览/创建共用）
function buildOrder(items, address, withOrder) {
  const detail = items.map((it) => {
    const found = findSku(Number(it.sku_id));
    if (!found) throw new Error('商品不存在');
    if (found.sku.stock < Number(it.quantity)) throw new Error('库存不足：' + found.goods.title);
    return {
      sku_id: found.sku.id, goods_id: found.goods.id, title: found.goods.title,
      image: found.sku.image || found.goods.cover, price: found.sku.price,
      quantity: Number(it.quantity), subtotal: found.sku.price * Number(it.quantity),
      spec_desc: specDesc(found.sku),
    };
  });
  const goodsAmount = detail.reduce((s, x) => s + x.subtotal, 0);
  const shippingFee = goodsAmount >= 99 ? 0 : 10;
  const discount = 0;
  const payAmount = goodsAmount + shippingFee - discount;
  const result = {
    items: detail,
    goods_amount: round2(goodsAmount),
    shipping_fee: round2(shippingFee),
    discount: round2(discount),
    pay_amount: round2(payAmount),
    address: address || {},
  };
  if (withOrder) {
    result._order = {
      id: state.orderSeq++, order_no: genOrderNo(),
      status: 0, status_text: '待付款',
      goods_amount: round2(goodsAmount), shipping_fee: round2(shippingFee),
      discount: round2(discount), pay_amount: round2(payAmount),
      receiver_name: (address && address.name) || '', receiver_phone: (address && address.phone) || '',
      address: (address && address.address) || '', items: detail, created_at: now(), pay_time: '',
    };
  }
  return result;
}

function genOrderNo() {
  const d = new Date();
  const p = (n) => ('' + n).padStart(2, '0');
  return '' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds()) + Math.floor(Math.random() * 9000 + 1000);
}
function now() {
  const d = new Date();
  const p = (n) => ('' + n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
}
function round2(n) {
  return Math.round(n * 100) / 100;
}

module.exports = { dispatch, goLink };
