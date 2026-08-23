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
  created_at   TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at   TEXT DEFAULT NULL
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
-- 优惠券与核销记录
-- =====================================================================
CREATE TABLE IF NOT EXISTS user_coupons (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL DEFAULT 0,
  coupon_id    INTEGER NOT NULL DEFAULT 0,
  code         TEXT NOT NULL DEFAULT '',
  title        TEXT NOT NULL DEFAULT '',
  status       INTEGER NOT NULL DEFAULT 0,  -- 0 未使用，1 已使用
  used_at      TEXT DEFAULT NULL,
  created_at   TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at   TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (code)
);
CREATE INDEX idx_user_coupons_user ON user_coupons(user_id);
CREATE INDEX idx_user_coupons_code ON user_coupons(code);

CREATE TABLE IF NOT EXISTS verify_records (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  verify_type  TEXT NOT NULL DEFAULT '',      -- pickup / card / coupon
  code         TEXT NOT NULL DEFAULT '',
  order_id     INTEGER NOT NULL DEFAULT 0,
  order_no     TEXT NOT NULL DEFAULT '',
  user_id      INTEGER NOT NULL DEFAULT 0,
  user_name    TEXT NOT NULL DEFAULT '',
  phone        TEXT NOT NULL DEFAULT '',
  verifier_id  INTEGER NOT NULL DEFAULT 0,
  verifier_name TEXT NOT NULL DEFAULT '',
  verified_at  TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_verify_type ON verify_records(verify_type);
CREATE INDEX idx_verify_code ON verify_records(code);

-- =====================================================================
-- 网站分析：页面访问与访客会话
-- =====================================================================
CREATE TABLE IF NOT EXISTS page_views (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id   TEXT NOT NULL DEFAULT '',
  user_id      INTEGER NOT NULL DEFAULT 0,
  page         TEXT NOT NULL DEFAULT '',
  ip           TEXT NOT NULL DEFAULT '',
  stay_time    INTEGER NOT NULL DEFAULT 0,   -- 停留时长（秒）
  is_bounce    INTEGER NOT NULL DEFAULT 0,   -- 是否跳出（1是，0否）
  created_at   TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_pv_session  ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_pv_page     ON page_views(page);
CREATE INDEX IF NOT EXISTS idx_pv_created  ON page_views(created_at);

CREATE TABLE IF NOT EXISTS visitor_sessions (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id   TEXT NOT NULL DEFAULT '',
  user_id      INTEGER NOT NULL DEFAULT 0,
  ip           TEXT NOT NULL DEFAULT '',
  is_new       INTEGER NOT NULL DEFAULT 1,   -- 1 新访客，0 老访客
  page_count   INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (session_id)
);
CREATE INDEX IF NOT EXISTS idx_vs_session ON visitor_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_vs_created ON visitor_sessions(created_at);

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

-- =====================================================================
-- 扩展模块表：文章 / 相册 / 跳转小程序 / 操作日志 / 短信
-- 早期 install.sqlite.sql 未包含以下表，现并入，保证首次建表完整；
-- database/apply_*.php 仍保留作为存量库的幂等增量迁移。
-- =====================================================================

-- 文章模块：article_categories / articles
CREATE TABLE IF NOT EXISTS article_categories (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL DEFAULT '',
  parent_id   INTEGER NOT NULL DEFAULT 0,
  sort        INTEGER NOT NULL DEFAULT 0,
  cover_image TEXT NOT NULL DEFAULT '',
  status      INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS articles (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  title         TEXT NOT NULL DEFAULT '',
  category_id   INTEGER NOT NULL DEFAULT 0,
  author        TEXT NOT NULL DEFAULT '',
  source        TEXT NOT NULL DEFAULT '',
  cover_image   TEXT NOT NULL DEFAULT '',
  intro         TEXT NOT NULL DEFAULT '',
  keywords      TEXT NOT NULL DEFAULT '',
  content       TEXT NOT NULL DEFAULT '',
  external_link TEXT NOT NULL DEFAULT '',
  display_mode  TEXT NOT NULL DEFAULT 'native',
  is_recommend  INTEGER NOT NULL DEFAULT 0,
  is_show       INTEGER NOT NULL DEFAULT 1,
  views         INTEGER NOT NULL DEFAULT 0,
  video_type    TEXT NOT NULL DEFAULT 'none',
  video_url     TEXT NOT NULL DEFAULT '',
  publish_time  TEXT DEFAULT '',
  created_at    TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 相册模块：album_categories / albums / album_images
CREATE TABLE IF NOT EXISTS album_categories (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL DEFAULT '',
  icon        TEXT NOT NULL DEFAULT '',
  sort        INTEGER NOT NULL DEFAULT 0,
  status      INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS albums (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL DEFAULT '',
  category_id   INTEGER NOT NULL DEFAULT 0,
  cover_image   TEXT NOT NULL DEFAULT '',
  sort          INTEGER NOT NULL DEFAULT 0,
  status        INTEGER NOT NULL DEFAULT 1,
  image_count   INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS album_images (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  album_id    INTEGER NOT NULL DEFAULT 0,
  image_url   TEXT NOT NULL DEFAULT '',
  name        TEXT NOT NULL DEFAULT '',
  is_cover    INTEGER NOT NULL DEFAULT 0,
  sort        INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 跳转小程序模块：mini_apps
CREATE TABLE IF NOT EXISTS mini_apps (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  platform    TEXT NOT NULL DEFAULT 'wechat',
  name        TEXT NOT NULL DEFAULT '',
  appid       TEXT NOT NULL DEFAULT '',
  path        TEXT NOT NULL DEFAULT '',
  sort        INTEGER NOT NULL DEFAULT 0,
  status      INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 操作日志：operation_logs
CREATE TABLE IF NOT EXISTS operation_logs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_user  TEXT NOT NULL DEFAULT '',
  admin_name  TEXT NOT NULL DEFAULT '',
  role        TEXT NOT NULL DEFAULT '',
  action      TEXT NOT NULL DEFAULT '',
  method      TEXT NOT NULL DEFAULT '',
  url         TEXT NOT NULL DEFAULT '',
  ip          TEXT NOT NULL DEFAULT '',
  param       TEXT,
  create_time INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_operation_logs_create_time ON operation_logs (create_time);
CREATE INDEX IF NOT EXISTS idx_operation_logs_admin_user ON operation_logs (admin_user);

-- 短信模块：sms_contacts / sms_send_logs
CREATE TABLE IF NOT EXISTS sms_contacts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL DEFAULT '',
  phone       TEXT NOT NULL DEFAULT '',
  enabled     INTEGER NOT NULL DEFAULT 1,
  subscribe   TEXT NOT NULL DEFAULT '[]',
  create_time INTEGER NOT NULL DEFAULT 0,
  update_time INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_sms_contacts_phone ON sms_contacts (phone);

CREATE TABLE IF NOT EXISTS sms_send_logs (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  phone         TEXT NOT NULL DEFAULT '',
  template_key  TEXT NOT NULL DEFAULT '',
  content       TEXT NOT NULL DEFAULT '',
  result        TEXT,
  config_key    TEXT NOT NULL DEFAULT '',
  create_time   INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_sms_send_logs_create_time ON sms_send_logs (create_time);
CREATE INDEX IF NOT EXISTS idx_sms_send_logs_phone ON sms_send_logs (phone);

-- 演示种子：文章分类 / 文章
INSERT INTO article_categories (id, name, parent_id, sort, cover_image, status) VALUES
(1, '公司新闻', 0, 1, '', 1),
(2, '行业动态', 0, 2, '', 1),
(3, '使用帮助', 0, 3, '', 1),
(4, '新手指南', 3, 1, '', 1);

INSERT INTO articles (id, title, category_id, author, source, cover_image, intro, keywords, content, display_mode, is_recommend, is_show, views, video_type, publish_time) VALUES
(1, '欢迎使用我们的小程序商城', 1, '管理员', '官方', '', '商城上线公告与功能简介', '公告,商城', '<p>感谢您使用我们的小程序商城，在这里您可以体验到丰富的商品与便捷的下单流程。</p>', 'native', 1, 1, 328, 'none', '2026-08-10 09:30:00'),
(2, '2026 行业趋势报告解读', 2, '编辑部', '行业周刊', '', '一文读懂今年电商新趋势', '趋势,电商', '<p>今年私域与内容电商继续走高，品牌自建小程序成为标配。</p>', 'native', 0, 1, 156, 'none', '2026-08-12 14:00:00'),
(3, '如何快速完成首单', 3, '客服小美', '帮助中心', '', '三步完成下单与支付', '帮助,下单', '<p>1. 浏览商品；2. 加入购物车；3. 提交订单并支付。</p>', 'native', 1, 1, 542, 'none', '2026-08-14 10:20:00');

-- 演示种子：相册分类 / 相册
INSERT INTO album_categories (id, name, icon, sort, status) VALUES
(1, '商品图库', '', 99, 1),
(2, '首页图库', '', 0, 1);

INSERT INTO albums (id, name, category_id, cover_image, sort, status, image_count) VALUES
(1, '新图片传这', 1, '', 9, 1, 0),
(2, '已压缩01（勿上传）', 1, '', 1, 1, 0),
(3, '已压缩02（勿上传）', 1, '', 2, 1, 0);

-- 演示种子：默认短信商家联系人（店长）
INSERT INTO sms_contacts (id, name, phone, enabled, subscribe, create_time, update_time) VALUES
(1, '店长', '13963671858', 1, '["order_new","order_refund","group_success","seckill_success","bargain_success"]', 0, 0);
