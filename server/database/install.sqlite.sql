-- =====================================================================
-- B2C 微信小程序商城 - SQLite 初始化脚本（本地开发用，免装 MySQL）
-- 与 install.sql 表结构一致；金额统一以「分」(INTEGER) 存储；JSON 以 TEXT 存储
-- 用法：php database/init_sqlite.php
-- =====================================================================

-- 会员
CREATE TABLE IF NOT EXISTS users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  openid     TEXT NOT NULL DEFAULT '',
  unionid    TEXT NOT NULL DEFAULT '',
  nickname   TEXT NOT NULL DEFAULT '',
  avatar     TEXT NOT NULL DEFAULT '',
  status     INTEGER NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (openid)
);

-- 登录令牌
CREATE TABLE IF NOT EXISTS user_tokens (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL,
  token      TEXT NOT NULL,
  expire_at  TEXT DEFAULT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (token)
);
CREATE INDEX idx_user_tokens_user ON user_tokens(user_id);

-- 收货地址
CREATE TABLE IF NOT EXISTS user_addresses (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL,
  name       TEXT NOT NULL DEFAULT '',
  phone      TEXT NOT NULL DEFAULT '',
  province   TEXT NOT NULL DEFAULT '',
  city       TEXT NOT NULL DEFAULT '',
  district   TEXT NOT NULL DEFAULT '',
  detail     TEXT NOT NULL DEFAULT '',
  is_default INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_addresses_user ON user_addresses(user_id);

-- 分类
CREATE TABLE IF NOT EXISTS categories (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  parent_id INTEGER NOT NULL DEFAULT 0,
  name      TEXT NOT NULL,
  icon      TEXT NOT NULL DEFAULT '',
  keywords  TEXT NOT NULL DEFAULT '',
  sort      INTEGER NOT NULL DEFAULT 0,
  is_show   INTEGER NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- 商品(SPU)
CREATE TABLE IF NOT EXISTS goods (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id  INTEGER NOT NULL DEFAULT 0,
  title        TEXT NOT NULL,
  subtitle     TEXT NOT NULL DEFAULT '',
  price        INTEGER NOT NULL DEFAULT 0,
  market_price INTEGER NOT NULL DEFAULT 0,
  stock        INTEGER NOT NULL DEFAULT 0,
  sales        INTEGER NOT NULL DEFAULT 0,
  cover        TEXT NOT NULL DEFAULT '',
  images       TEXT,
  video        TEXT NOT NULL DEFAULT '',
  detail       TEXT,
  ext_json     TEXT NOT NULL DEFAULT '{}',
  status       INTEGER NOT NULL DEFAULT 1,
  created_at   TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_goods_cat ON goods(category_id);
CREATE INDEX idx_goods_status ON goods(status);

-- 规格
CREATE TABLE IF NOT EXISTS goods_specs (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  goods_id   INTEGER NOT NULL,
  name       TEXT NOT NULL,
  sort       INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_specs_goods ON goods_specs(goods_id);

-- 规格值
CREATE TABLE IF NOT EXISTS goods_spec_values (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  spec_id    INTEGER NOT NULL,
  goods_id   INTEGER NOT NULL,
  value      TEXT NOT NULL,
  sort       INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_spec_values_spec ON goods_spec_values(spec_id);

-- SKU
CREATE TABLE IF NOT EXISTS goods_skus (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  goods_id       INTEGER NOT NULL,
  spec_value_ids TEXT NOT NULL DEFAULT '',
  price          INTEGER NOT NULL DEFAULT 0,
  market_price   INTEGER NOT NULL DEFAULT 0,
  stock          INTEGER NOT NULL DEFAULT 0,
  image          TEXT NOT NULL DEFAULT '',
  created_at     TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_skus_goods ON goods_skus(goods_id);

-- 商品属性
CREATE TABLE IF NOT EXISTS goods_attrs (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  goods_id   INTEGER NOT NULL,
  name       TEXT NOT NULL DEFAULT '',
  values     TEXT NOT NULL DEFAULT '[]',
  used       INTEGER NOT NULL DEFAULT 0,
  sort       INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_attrs_goods ON goods_attrs(goods_id);

-- 购物车
CREATE TABLE IF NOT EXISTS carts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL,
  goods_id   INTEGER NOT NULL,
  sku_id     INTEGER NOT NULL,
  quantity   INTEGER NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, sku_id)
);

-- 订单
CREATE TABLE IF NOT EXISTS orders (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  order_no       TEXT NOT NULL,
  user_id        INTEGER NOT NULL,
  receiver_name  TEXT NOT NULL DEFAULT '',
  receiver_phone TEXT NOT NULL DEFAULT '',
  address        TEXT NOT NULL DEFAULT '',
  goods_amount  INTEGER NOT NULL DEFAULT 0,
  shipping_fee   INTEGER NOT NULL DEFAULT 0,
  discount       INTEGER NOT NULL DEFAULT 0,
  pay_amount     INTEGER NOT NULL DEFAULT 0,
  status         INTEGER NOT NULL DEFAULT 0,
  pay_type       TEXT NOT NULL DEFAULT '',
  pay_time       TEXT DEFAULT NULL,
  created_at     TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at     TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (order_no)
);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- 订单明细
CREATE TABLE IF NOT EXISTS order_items (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id     INTEGER NOT NULL,
  goods_id     INTEGER NOT NULL,
  sku_id       INTEGER NOT NULL,
  goods_title  TEXT NOT NULL DEFAULT '',
  spec_desc    TEXT NOT NULL DEFAULT '',
  image        TEXT NOT NULL DEFAULT '',
  price        INTEGER NOT NULL DEFAULT 0,
  quantity     INTEGER NOT NULL DEFAULT 1,
  subtotal     INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- 支付记录
CREATE TABLE IF NOT EXISTS order_payments (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id   INTEGER NOT NULL,
  pay_no     TEXT NOT NULL DEFAULT '',
  channel    TEXT NOT NULL DEFAULT 'wechat',
  amount     INTEGER NOT NULL DEFAULT 0,
  status     INTEGER NOT NULL DEFAULT 0,
  paid_at    TEXT DEFAULT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_payments_order ON order_payments(order_id);

-- =====================================================================
-- 演示种子数据
-- =====================================================================
INSERT INTO users (id, openid, nickname, avatar, status)
VALUES (1, 'mock_demo', '演示会员', '', 1);

INSERT INTO categories (id, parent_id, name, icon, sort) VALUES
(1, 0, '生鲜果蔬', 'https://placehold.co/96x96/FF6B35/fff?text=果', 1),
(2, 0, '休闲零食', 'https://placehold.co/96x96/00B86B/fff?text=零', 2),
(3, 0, '家用电器', 'https://placehold.co/96x96/4A90E2/fff?text=电', 3),
(11, 1, '新鲜水果', '', 1),
(12, 1, '时令蔬菜', '', 2),
(21, 2, '坚果炒货', '', 1),
(22, 2, '肉脯肉干', '', 2);

INSERT INTO goods (id, category_id, title, subtitle, price, market_price, stock, sales, images, detail, status)
VALUES
(1, 11, '云南蜜橘 5斤装', '皮薄多汁 产地直发', 1990, 2990, 100, 320,
 '["https://placehold.co/400x400/FF6B35/fff?text=Orange","https://placehold.co/400x400/FFB035/fff?text=Orange2"]',
 '<p>产自云南高原，皮薄多汁，5斤装约8-12个。</p>', 1),
(2, 11, '泰国金枕榴莲 3斤', '树熟发货 软糯香甜', 5990, 7990, 50, 88,
 '["https://placehold.co/400x400/00B86B/fff?text=Durian"]',
 '<p>泰国进口金枕榴莲，自然树熟，肉厚核小。</p>', 1),
(3, 21, '每日坚果 30包', '混合果仁 独立小包', 9900, 12900, 200, 1500,
 '["https://placehold.co/400x400/4A90E2/fff?text=Nut"]',
 '<p>巴旦木/腰果/蔓越莓等混合，每日一包健康好吃。</p>', 1),
(4, 22, '手撕风干牛肉干 200g', '内蒙古草饲 高蛋白', 3990, 4990, 80, 460,
 '["https://placehold.co/400x400/9B59B6/fff?text=Beef"]',
 '<p>精选牛后腿肉，低温风干，嚼劲十足。</p>', 1);

INSERT INTO goods_specs (id, goods_id, name) VALUES
(1, 1, '规格'), (2, 3, '口味'), (3, 3, '包装');

INSERT INTO goods_spec_values (id, spec_id, goods_id, value) VALUES
(1, 1, 1, '5斤装'), (2, 1, 1, '10斤装'),
(3, 2, 3, '原味'), (4, 2, 3, '蜂蜜黄油炸'),
(5, 3, 3, '盒装'), (6, 3, 3, '袋装');

INSERT INTO goods_skus (id, goods_id, spec_value_ids, price, market_price, stock, image) VALUES
(1, 1, '1', 1990, 2990, 60, 'https://placehold.co/400x400/FF6B35/fff?text=5斤'),
(2, 1, '2', 3690, 4990, 40, 'https://placehold.co/400x400/FFB035/fff?text=10斤'),
(3, 3, '3,5', 9900, 12900, 120, 'https://placehold.co/400x400/4A90E2/fff?text=原味盒'),
(4, 3, '4,6', 9900, 12900, 80, 'https://placehold.co/400x400/4A90E2/fff?text=黄油袋');

-- =====================================================================
-- 首页装修（DIY 系统）：pages / page_versions
-- 配置以 JSON 存于 page_versions.config，支持草稿/发布/回滚
-- =====================================================================
CREATE TABLE IF NOT EXISTS pages (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  page            TEXT NOT NULL,
  title           TEXT NOT NULL DEFAULT '',
  status          INTEGER NOT NULL DEFAULT 1,
  current_version INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at      TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (page)
);

CREATE TABLE IF NOT EXISTS page_versions (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  page_id      INTEGER NOT NULL,
  version      INTEGER NOT NULL DEFAULT 1,
  status       INTEGER NOT NULL DEFAULT 0,
  config       TEXT NOT NULL DEFAULT '{}',
  remark       TEXT NOT NULL DEFAULT '',
  created_by   TEXT NOT NULL DEFAULT '',
  created_at   TEXT DEFAULT CURRENT_TIMESTAMP,
  published_at TEXT DEFAULT NULL
);
CREATE INDEX IF NOT EXISTS idx_pv_page ON page_versions(page_id);
