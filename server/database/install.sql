-- =====================================================================
-- B2C 微信小程序商城 - MySQL 5.7 初始化脚本（垂直切片版本）
-- 字符集 utf8mb4 / 引擎 InnoDB
-- 金额统一以「分」(INT) 存储；JSON 配置以 TEXT 存储（兼容 5.7）
-- =====================================================================
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS `wxappb2c` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `wxappb2c`;

-- 会员
CREATE TABLE IF NOT EXISTS `users` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `openid`     VARCHAR(64)  NOT NULL DEFAULT '',
  `unionid`    VARCHAR(64)  NOT NULL DEFAULT '',
  `nickname`   VARCHAR(64)  NOT NULL DEFAULT '',
  `avatar`     VARCHAR(255) NOT NULL DEFAULT '',
  `status`     TINYINT      NOT NULL DEFAULT 1 COMMENT '1正常 0禁用',
  `created_at` DATETIME     DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_openid` (`openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 登录令牌
CREATE TABLE IF NOT EXISTS `user_tokens` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`    INT UNSIGNED NOT NULL,
  `token`      VARCHAR(64)  NOT NULL,
  `expire_at`  DATETIME     DEFAULT NULL,
  `created_at` DATETIME     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_token` (`token`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 收货地址
CREATE TABLE IF NOT EXISTS `user_addresses` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`    INT UNSIGNED NOT NULL,
  `name`       VARCHAR(32)  NOT NULL DEFAULT '',
  `phone`      VARCHAR(32)  NOT NULL DEFAULT '',
  `province`   VARCHAR(32)  NOT NULL DEFAULT '',
  `city`       VARCHAR(32)  NOT NULL DEFAULT '',
  `district`   VARCHAR(32)  NOT NULL DEFAULT '',
  `detail`     VARCHAR(255) NOT NULL DEFAULT '',
  `is_default` TINYINT      NOT NULL DEFAULT 0,
  `created_at` DATETIME     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 分类
CREATE TABLE IF NOT EXISTS `categories` (
  `id`       INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `parent_id` INT UNSIGNED NOT NULL DEFAULT 0,
  `name`     VARCHAR(64)  NOT NULL,
  `icon`     VARCHAR(255) NOT NULL DEFAULT '',
  `keywords` VARCHAR(255) NOT NULL DEFAULT '',
  `sort`     INT          NOT NULL DEFAULT 0,
  `is_show`  TINYINT      NOT NULL DEFAULT 1,
  `created_at` DATETIME   DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_parent` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 商品(SPU)
CREATE TABLE IF NOT EXISTS `goods` (
  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id`  INT UNSIGNED NOT NULL DEFAULT 0,
  `title`        VARCHAR(128) NOT NULL,
  `subtitle`     VARCHAR(255) NOT NULL DEFAULT '',
  `price`        INT          NOT NULL DEFAULT 0 COMMENT '销售价(分)',
  `market_price` INT          NOT NULL DEFAULT 0 COMMENT '划线价(分)',
  `stock`        INT          NOT NULL DEFAULT 0 COMMENT '可售库存',
  `sales`        INT          NOT NULL DEFAULT 0 COMMENT '销量',
  `cover`        VARCHAR(255) NOT NULL DEFAULT '',
  `images`       TEXT         COMMENT '图片 JSON 数组',
  `video`        VARCHAR(255) NOT NULL DEFAULT '',
  `detail`       TEXT         COMMENT '图文详情 HTML',
  `promotion`    VARCHAR(255) NOT NULL DEFAULT '' COMMENT '商品促销语',
  `status`       TINYINT      NOT NULL DEFAULT 1 COMMENT '1上架 0下架',
  `created_at`   DATETIME     DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cat` (`category_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 规格
CREATE TABLE IF NOT EXISTS `goods_specs` (
  `id`       INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `goods_id` INT UNSIGNED NOT NULL,
  `name`     VARCHAR(32)  NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_goods` (`goods_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 规格值
CREATE TABLE IF NOT EXISTS `goods_spec_values` (
  `id`       INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `spec_id`  INT UNSIGNED NOT NULL,
  `goods_id` INT UNSIGNED NOT NULL,
  `value`    VARCHAR(32)  NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_spec` (`spec_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SKU
CREATE TABLE IF NOT EXISTS `goods_skus` (
  `id`             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `goods_id`       INT UNSIGNED NOT NULL,
  `spec_value_ids` VARCHAR(64)  NOT NULL DEFAULT '' COMMENT '规格值 id 逗号分隔',
  `price`          INT          NOT NULL DEFAULT 0 COMMENT '价格(分)',
  `market_price`   INT          NOT NULL DEFAULT 0,
  `stock`          INT          NOT NULL DEFAULT 0,
  `image`          VARCHAR(255) NOT NULL DEFAULT '',
  `created_at`     DATETIME     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_goods` (`goods_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 购物车
CREATE TABLE IF NOT EXISTS `carts` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`    INT UNSIGNED NOT NULL,
  `goods_id`   INT UNSIGNED NOT NULL,
  `sku_id`     INT UNSIGNED NOT NULL,
  `quantity`   INT          NOT NULL DEFAULT 1,
  `created_at` DATETIME     DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_sku` (`user_id`, `sku_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 订单
CREATE TABLE IF NOT EXISTS `orders` (
  `id`             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_no`       VARCHAR(32)  NOT NULL,
  `user_id`        INT UNSIGNED NOT NULL,
  `receiver_name`  VARCHAR(32)  NOT NULL DEFAULT '',
  `receiver_phone` VARCHAR(32)  NOT NULL DEFAULT '',
  `address`        VARCHAR(255) NOT NULL DEFAULT '',
  `goods_amount`  INT          NOT NULL DEFAULT 0 COMMENT '商品金额(分)',
  `shipping_fee`   INT          NOT NULL DEFAULT 0 COMMENT '运费(分)',
  `discount`       INT          NOT NULL DEFAULT 0 COMMENT '优惠(分)',
  `pay_amount`     INT          NOT NULL DEFAULT 0 COMMENT '实付(分)',
  `status`         TINYINT      NOT NULL DEFAULT 0 COMMENT '0待付款 1已付款 2配货中 3已发货 4待自提 5已完成 10已取消 11退款中 12已退款',
  `pay_type`       VARCHAR(16)  NOT NULL DEFAULT '',
  `pay_time`       DATETIME     DEFAULT NULL,
  `created_at`     DATETIME     DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 订单明细
CREATE TABLE IF NOT EXISTS `order_items` (
  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id`     INT UNSIGNED NOT NULL,
  `goods_id`     INT UNSIGNED NOT NULL,
  `sku_id`       INT UNSIGNED NOT NULL,
  `goods_title`  VARCHAR(128) NOT NULL DEFAULT '',
  `spec_desc`    VARCHAR(64)  NOT NULL DEFAULT '',
  `image`        VARCHAR(255) NOT NULL DEFAULT '',
  `price`        INT          NOT NULL DEFAULT 0 COMMENT '单价(分)',
  `quantity`     INT          NOT NULL DEFAULT 1,
  `subtotal`     INT          NOT NULL DEFAULT 0 COMMENT '小计(分)',
  PRIMARY KEY (`id`),
  KEY `idx_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 支付记录
CREATE TABLE IF NOT EXISTS `order_payments` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id`   INT UNSIGNED NOT NULL,
  `pay_no`     VARCHAR(64)  NOT NULL DEFAULT '' COMMENT '支付流水号',
  `channel`    VARCHAR(16)  NOT NULL DEFAULT 'wechat',
  `amount`     INT          NOT NULL DEFAULT 0 COMMENT '金额(分)',
  `status`     TINYINT      NOT NULL DEFAULT 0 COMMENT '0未付 1已付',
  `paid_at`    DATETIME     DEFAULT NULL,
  `created_at` DATETIME     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- 演示种子数据
-- =====================================================================
INSERT INTO `users` (`id`, `openid`, `nickname`, `avatar`, `status`)
VALUES (1, 'mock_demo', '演示会员', '', 1);

INSERT INTO `categories` (`id`, `parent_id`, `name`, `icon`, `sort`) VALUES
(1, 0, '生鲜果蔬', 'https://placehold.co/96x96/FF6B35/fff?text=果', 1),
(2, 0, '休闲零食', 'https://placehold.co/96x96/00B86B/fff?text=零', 2),
(3, 0, '家用电器', 'https://placehold.co/96x96/4A90E2/fff?text=电', 3),
(11, 1, '新鲜水果', '', 1),
(12, 1, '时令蔬菜', '', 2),
(21, 2, '坚果炒货', '', 1),
(22, 2, '肉脯肉干', '', 2);

INSERT INTO `goods` (`id`, `category_id`, `title`, `subtitle`, `price`, `market_price`, `stock`, `sales`, `images`, `detail`, `status`)
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

INSERT INTO `goods_specs` (`id`, `goods_id`, `name`) VALUES
(1, 1, '规格'), (2, 3, '口味'), (3, 3, '包装');

INSERT INTO `goods_spec_values` (`id`, `spec_id`, `goods_id`, `value`) VALUES
(1, 1, 1, '5斤装'), (2, 1, 1, '10斤装'),
(3, 2, 3, '原味'), (4, 2, 3, '蜂蜜黄油炸'),
(5, 3, 3, '盒装'), (6, 3, 3, '袋装');

INSERT INTO `goods_skus` (`id`, `goods_id`, `spec_value_ids`, `price`, `market_price`, `stock`, `image`) VALUES
(1, 1, '1', 1990, 2990, 60, 'https://placehold.co/400x400/FF6B35/fff?text=5斤'),
(2, 1, '2', 3690, 4990, 40, 'https://placehold.co/400x400/FFB035/fff?text=10斤'),
(3, 3, '3,5', 9900, 12900, 120, 'https://placehold.co/400x400/4A90E2/fff?text=原味盒'),
(4, 3, '4,6', 9900, 12900, 80, 'https://placehold.co/400x400/4A90E2/fff?text=黄油袋');

-- =====================================================================
-- 首页装修（DIY 系统）：pages / page_versions
-- =====================================================================
CREATE TABLE IF NOT EXISTS `pages` (
  `id`              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `page`            VARCHAR(32)  NOT NULL,
  `title`           VARCHAR(64)  NOT NULL DEFAULT '',
  `status`          TINYINT      NOT NULL DEFAULT 1,
  `current_version` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at`      DATETIME     DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_page` (`page`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `page_versions` (
  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `page_id`      INT UNSIGNED NOT NULL,
  `version`      INT UNSIGNED NOT NULL DEFAULT 1,
  `status`       TINYINT      NOT NULL DEFAULT 0 COMMENT '0草稿 1已发布 -1历史',
  `config`       TEXT         NOT NULL,
  `remark`       VARCHAR(255) NOT NULL DEFAULT '',
  `created_by`   VARCHAR(64)  NOT NULL DEFAULT '',
  `created_at`   DATETIME     DEFAULT CURRENT_TIMESTAMP,
  `published_at` DATETIME     DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_page` (`page_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 基础设置（站点/商品/交易/安全）：整份配置以 JSON 存于 config
CREATE TABLE IF NOT EXISTS `store_settings` (
  `id`         INT UNSIGNED NOT NULL DEFAULT 1,
  `config`     TEXT         NOT NULL,
  `updated_at` INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- 扩展模块表：文章 / 相册 / 跳转小程序 / 操作日志 / 短信
-- 与 database/apply_*.php（SQLite 幂等迁移）对应的 MySQL 建表，
-- 保证生产 MySQL 首装即可用。
-- =====================================================================

-- 文章模块
CREATE TABLE IF NOT EXISTS `article_categories` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(64)  NOT NULL DEFAULT '',
  `parent_id`   INT UNSIGNED NOT NULL DEFAULT 0,
  `sort`        INT          NOT NULL DEFAULT 0,
  `cover_image` VARCHAR(255) NOT NULL DEFAULT '',
  `status`      TINYINT      NOT NULL DEFAULT 1,
  `created_at`  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `articles` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title`         VARCHAR(255) NOT NULL DEFAULT '',
  `category_id`   INT UNSIGNED NOT NULL DEFAULT 0,
  `author`        VARCHAR(64)  NOT NULL DEFAULT '',
  `source`        VARCHAR(64)  NOT NULL DEFAULT '',
  `cover_image`   VARCHAR(255) NOT NULL DEFAULT '',
  `intro`         VARCHAR(500) NOT NULL DEFAULT '',
  `keywords`      VARCHAR(255) NOT NULL DEFAULT '',
  `content`       TEXT,
  `external_link` VARCHAR(255) NOT NULL DEFAULT '',
  `display_mode`  VARCHAR(16)  NOT NULL DEFAULT 'native',
  `is_recommend`  TINYINT      NOT NULL DEFAULT 0,
  `is_show`       TINYINT      NOT NULL DEFAULT 1,
  `views`         INT UNSIGNED NOT NULL DEFAULT 0,
  `video_type`    VARCHAR(16)  NOT NULL DEFAULT 'none',
  `video_url`     VARCHAR(255) NOT NULL DEFAULT '',
  `publish_time`  DATETIME     DEFAULT NULL,
  `created_at`    DATETIME     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_article_cat` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 相册模块
CREATE TABLE IF NOT EXISTS `album_categories` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(64)  NOT NULL DEFAULT '',
  `icon`        VARCHAR(255) NOT NULL DEFAULT '',
  `sort`        INT          NOT NULL DEFAULT 0,
  `status`      TINYINT      NOT NULL DEFAULT 1,
  `created_at`  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `albums` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(128) NOT NULL DEFAULT '',
  `category_id` INT UNSIGNED NOT NULL DEFAULT 0,
  `cover_image` VARCHAR(255) NOT NULL DEFAULT '',
  `sort`        INT          NOT NULL DEFAULT 0,
  `status`      TINYINT      NOT NULL DEFAULT 1,
  `image_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at`  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_album_cat` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `album_images` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `album_id`    INT UNSIGNED NOT NULL DEFAULT 0,
  `image_url`   VARCHAR(500) NOT NULL DEFAULT '',
  `name`        VARCHAR(128) NOT NULL DEFAULT '',
  `is_cover`    TINYINT      NOT NULL DEFAULT 0,
  `sort`        INT          NOT NULL DEFAULT 0,
  `created_at`  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_album_img_album` (`album_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 跳转小程序模块
CREATE TABLE IF NOT EXISTS `mini_apps` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `platform`    VARCHAR(16)  NOT NULL DEFAULT 'wechat',
  `name`        VARCHAR(64)  NOT NULL DEFAULT '',
  `appid`       VARCHAR(64)  NOT NULL DEFAULT '',
  `path`        VARCHAR(255) NOT NULL DEFAULT '',
  `sort`        INT          NOT NULL DEFAULT 0,
  `status`      TINYINT      NOT NULL DEFAULT 1,
  `created_at`  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 操作日志
CREATE TABLE IF NOT EXISTS `operation_logs` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `admin_user`  VARCHAR(64)  NOT NULL DEFAULT '',
  `admin_name`  VARCHAR(64)  NOT NULL DEFAULT '',
  `role`        VARCHAR(64)  NOT NULL DEFAULT '',
  `action`      VARCHAR(128) NOT NULL DEFAULT '',
  `method`      VARCHAR(16)  NOT NULL DEFAULT '',
  `url`         VARCHAR(255) NOT NULL DEFAULT '',
  `ip`          VARCHAR(64)  NOT NULL DEFAULT '',
  `param`       TEXT,
  `create_time` INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_oplog_time` (`create_time`),
  KEY `idx_oplog_user` (`admin_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 短信模块
CREATE TABLE IF NOT EXISTS `sms_contacts` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(64)  NOT NULL DEFAULT '',
  `phone`       VARCHAR(32)  NOT NULL DEFAULT '',
  `enabled`     TINYINT      NOT NULL DEFAULT 1,
  `subscribe`   TEXT,
  `create_time` INT UNSIGNED NOT NULL DEFAULT 0,
  `update_time` INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_sms_contact_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `sms_send_logs` (
  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `phone`        VARCHAR(32)  NOT NULL DEFAULT '',
  `template_key` VARCHAR(64)  NOT NULL DEFAULT '',
  `content`      TEXT,
  `result`       TEXT,
  `config_key`   VARCHAR(64)  NOT NULL DEFAULT '',
  `create_time`  INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_sms_log_time` (`create_time`),
  KEY `idx_sms_log_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
