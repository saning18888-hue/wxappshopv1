-- =====================================================================
-- B2C 微信小程序商城 - SQLite 初始化脚本（本地开发用，免装 MySQL）
-- 与 install.sql 表结构一致；金额统一以「分」(INTEGER) 存储；JSON 以 TEXT 存储
-- 用法：php database/init_sqlite.php
-- =====================================================================

-- 会员
CREATE TABLE IF NOT EXISTS users (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  openid           TEXT NOT NULL DEFAULT '',
  unionid          TEXT NOT NULL DEFAULT '',
  nickname         TEXT NOT NULL DEFAULT '',
  avatar           TEXT NOT NULL DEFAULT '',
  phone            TEXT NOT NULL DEFAULT '',
  gender           INTEGER NOT NULL DEFAULT 0,
  level            INTEGER NOT NULL DEFAULT 0,
  growth           INTEGER NOT NULL DEFAULT 0,
  points           INTEGER NOT NULL DEFAULT 0,
  balance          INTEGER NOT NULL DEFAULT 0,
  group_id         INTEGER NOT NULL DEFAULT 0,
  source           TEXT NOT NULL DEFAULT '',
  auth_status      INTEGER NOT NULL DEFAULT 1,
  staff_id         INTEGER NOT NULL DEFAULT 0,
  distributor_id   INTEGER NOT NULL DEFAULT 0,
  delete_status    INTEGER NOT NULL DEFAULT 0,
  delete_reason    TEXT NOT NULL DEFAULT '',
  delete_apply_time TEXT DEFAULT '',
  tags             TEXT NOT NULL DEFAULT '',
  status           INTEGER NOT NULL DEFAULT 1,
  created_at       TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at       TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (openid)
);

-- 会员分组
CREATE TABLE IF NOT EXISTS member_groups (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  level      INTEGER NOT NULL DEFAULT 0,
  discount   INTEGER NOT NULL DEFAULT 100,
  remark     TEXT NOT NULL DEFAULT '',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_member_groups_level ON member_groups(level);

-- 员工
CREATE TABLE IF NOT EXISTS staff (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  account    TEXT NOT NULL DEFAULT '',
  position   TEXT NOT NULL DEFAULT '',
  phone      TEXT NOT NULL DEFAULT '',
  wechat     TEXT NOT NULL DEFAULT '',
  qq         TEXT NOT NULL DEFAULT '',
  remark     TEXT NOT NULL DEFAULT '',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 分销商
CREATE TABLE IF NOT EXISTS distributors (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  nickname   TEXT NOT NULL DEFAULT '',
  name       TEXT NOT NULL DEFAULT '',
  phone      TEXT NOT NULL DEFAULT '',
  remark     TEXT NOT NULL DEFAULT '',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
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
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  goods_id      INTEGER NOT NULL,
  name          TEXT NOT NULL,
  default_spec  INTEGER NOT NULL DEFAULT 1,
  sort          INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at    TEXT DEFAULT NULL
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
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  goods_id      INTEGER NOT NULL DEFAULT 0,
  name          TEXT NOT NULL DEFAULT '',
  attr_values   TEXT NOT NULL DEFAULT '[]',
  default_attr  INTEGER NOT NULL DEFAULT 0,
  used          INTEGER NOT NULL DEFAULT 0,
  sort          INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at    TEXT DEFAULT NULL
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
  trade_no       TEXT NOT NULL DEFAULT '',
  user_id        INTEGER NOT NULL,
  receiver_name  TEXT NOT NULL DEFAULT '',
  receiver_phone TEXT NOT NULL DEFAULT '',
  address        TEXT NOT NULL DEFAULT '',
  goods_amount   INTEGER NOT NULL DEFAULT 0,
  shipping_fee   INTEGER NOT NULL DEFAULT 0,
  discount       INTEGER NOT NULL DEFAULT 0,
  member_discount INTEGER NOT NULL DEFAULT 0,
  balance_used   INTEGER NOT NULL DEFAULT 0,
  coupon_amount  INTEGER NOT NULL DEFAULT 0,
  pay_amount     INTEGER NOT NULL DEFAULT 0,
  status         INTEGER NOT NULL DEFAULT 0,
  order_type     INTEGER NOT NULL DEFAULT 0,
  source         TEXT NOT NULL DEFAULT 'wechat',
  pay_type          TEXT NOT NULL DEFAULT '',
  pay_time          TEXT DEFAULT NULL,
  buyer_message     TEXT NOT NULL DEFAULT '',
  remark            TEXT NOT NULL DEFAULT '',
  shipping_company  TEXT NOT NULL DEFAULT '',
  shipping_no       TEXT NOT NULL DEFAULT '',
  is_deleted        INTEGER NOT NULL DEFAULT 0,
  refund_apply_at   TEXT,
  refund_finish_at  TEXT,
  refund_reason     TEXT NOT NULL DEFAULT '',
  refund_amount     INTEGER NOT NULL DEFAULT 0,
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
-- 电子卡券
-- =====================================================================
CREATE TABLE IF NOT EXISTS order_cards (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id       INTEGER NOT NULL DEFAULT 0,
  order_no       TEXT NOT NULL DEFAULT '',
  user_id        INTEGER NOT NULL DEFAULT 0,
  goods_id       INTEGER NOT NULL DEFAULT 0,
  goods_title    TEXT NOT NULL DEFAULT '',
  code           TEXT NOT NULL DEFAULT '',
  status         INTEGER NOT NULL DEFAULT 0,  -- 0 未使用，1 已使用，2 已转赠，3 已作废
  valid_start    TEXT DEFAULT NULL,
  valid_end      TEXT DEFAULT NULL,
  contact_name   TEXT NOT NULL DEFAULT '',
  contact_phone  TEXT NOT NULL DEFAULT '',
  used_at        TEXT DEFAULT NULL,
  verifier_id    INTEGER NOT NULL DEFAULT 0,
  created_at     TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at     TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (code)
);
CREATE INDEX idx_cards_order ON order_cards(order_id);
CREATE INDEX idx_cards_user  ON order_cards(user_id);
CREATE INDEX idx_cards_code  ON order_cards(code);

CREATE TABLE IF NOT EXISTS card_transfers (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id      INTEGER NOT NULL DEFAULT 0,
  from_user_id INTEGER NOT NULL DEFAULT 0,
  to_user_id   INTEGER NOT NULL DEFAULT 0,
  order_no     TEXT NOT NULL DEFAULT '',
  goods_title  TEXT NOT NULL DEFAULT '',
  status       INTEGER NOT NULL DEFAULT 0,  -- 0 待领取，1 已领取，2 已拒绝/过期
  received_at  TEXT DEFAULT NULL,
  created_at   TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at   TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_transfers_card ON card_transfers(card_id);
CREATE INDEX idx_transfers_from ON card_transfers(from_user_id);
CREATE INDEX idx_transfers_to   ON card_transfers(to_user_id);

-- =====================================================================
-- 商品评论
-- =====================================================================
CREATE TABLE IF NOT EXISTS goods_reviews (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id     INTEGER NOT NULL DEFAULT 0,
  order_no     TEXT NOT NULL DEFAULT '',
  user_id      INTEGER NOT NULL DEFAULT 0,
  user_name    TEXT NOT NULL DEFAULT '',
  avatar       TEXT NOT NULL DEFAULT '',
  goods_id     INTEGER NOT NULL DEFAULT 0,
  goods_title  TEXT NOT NULL DEFAULT '',
  goods_image  TEXT NOT NULL DEFAULT '',
  content      TEXT NOT NULL DEFAULT '',
  images       TEXT NOT NULL DEFAULT '[]',
  rating       INTEGER NOT NULL DEFAULT 5,
  is_hidden    INTEGER NOT NULL DEFAULT 0,
  reply        TEXT NOT NULL DEFAULT '',
  reply_at     TEXT DEFAULT NULL,
  created_at   TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at   TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_reviews_goods ON goods_reviews(goods_id);
CREATE INDEX idx_reviews_user  ON goods_reviews(user_id);
CREATE INDEX idx_reviews_order ON goods_reviews(order_id);

-- =====================================================================
-- 演示种子数据
-- =====================================================================
INSERT INTO users (id, openid, nickname, avatar, phone, level, growth, points, balance, group_id, status)
VALUES (1, 'mock_demo', '演示会员', '', '13800000000', 2, 520, 1280, 0, 2, 1);

INSERT INTO member_groups (id, name, level, discount, remark) VALUES
(1, '普通会员', 1, 100, '默认分组'),
(2, 'VIP会员', 2, 95, '消费满1000升级'),
(3, 'SVIP会员', 3, 90, '消费满5000升级');

INSERT INTO staff (id, name, phone, remark) VALUES
(1, '客服-小美', '13900000001', '售前售后'),
(2, '客服-小帅', '13900000002', '大客户');

INSERT INTO distributors (id, name, phone, remark) VALUES
(1, '分销商-A', '13700000001', '区域代理'),
(2, '分销商-B', '13700000002', '社群团长');

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

-- 基础设置（站点/商品/交易/安全）：整份配置以 JSON 存于 config
CREATE TABLE IF NOT EXISTS store_settings (
  id          INTEGER PRIMARY KEY,
  config      TEXT NOT NULL,
  updated_at  INTEGER NOT NULL DEFAULT 0
);
