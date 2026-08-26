<?php
namespace app\service;

use think\facade\Db;

/**
 * 基础设置服务：以 JSON 形式把「基础/商品/交易/安全」四类设置整份存入 store_settings 表。
 * 表结构仅在首次访问时自动创建（兼容 MySQL 与 SQLite）。
 */
class SettingsService
{
    const TABLE = 'store_settings';
    const ROW_ID = 1;

    /** 默认设置（任何缺省项都会被合并进来，保证前端拿到完整结构） */
    public static function defaults(): array
    {
        return [
            // 基础设置
            'site_status'        => 'open',      // open=营业 / close=打烊
            'close_reason'       => '店铺暂时休息中，请稍后再来~',
            'store_name'         => 'B2C 商城',
            'store_logo'         => '',
            'theme_color'        => '#FF6B35',   // 小程序主题色（基础设置 → 主题色设计）
            // —— 新增：小程序名称 / 页面标题对齐 / 客服按钮 / 搜索框配色 ——
            'mini_program_name'  => '优选商城',   // 小程序首页顶部标题名称（可在后台修改，默认「优选商城」）
            'page_title_align'   => 'left',       // 页面标题对齐：left=靠左 / center=居中
            'customer_service_button' => 'open', // 前端客服按钮开关 open=开启 / close=关闭
            'customer_service_type'   => 'business_phone', // weapp=微信小程序客服 / business_phone=商家电话 / third_party=第三方客服 / wechat=微信客服(企业微信)
            'service_phone'      => '',           // 商家电话（customer_service_type=business_phone）
            'wechat_corpid'      => '',           // 微信客服企业ID（customer_service_type=wechat，企业微信 corpID）
            'wechat_url'         => '',           // 微信客服链接（customer_service_type=wechat，格式 https://work.weixin.qq.com/kfid/xxxx）
            'third_party_url'    => '',           // 第三方客服 H5 地址（customer_service_type=third_party，通过 web-view 打开）
            'search_box_color'   => '#FFFFFF',    // 首页搜索框背景色
            'search_box_icon'    => '',            // 首页搜索框图标（可上传图片，空则使用默认放大镜）
            'search_placeholder' => '搜索你想要的好物', // 首页搜索框占位文字
            'mini_program_name_color' => '#333333', // 小程序首页顶部标题名称颜色
            'admin_copyright'    => '',          // 后台版权信息
            'domain_verify_file' => '',           // 域名校验文件名
            'collect_tip'        => 'open',      // 收藏提示：open=开启 / close=关闭
            'home_subtitle'      => '',          // 首页副标题
            'scroll_order'       => 'close',     // 首页滚动订单提示：open=开启 / close=关闭
            'scroll_order_list'  => [            // 滚动订单默认文案
              ['name' => '张**', 'text' => '刚刚下了一笔订单'],
              ['name' => '李**', 'text' => '刚刚下了一笔订单'],
              ['name' => '王**', 'text' => '刚刚下了一笔订单'],
              ['name' => '赵**', 'text' => '刚刚下了一笔订单'],
              ['name' => '刘**', 'text' => '刚刚下了一笔订单'],
            ],
            'service_type'       => 'online',    // online=在线客服 / phone=电话 / wechat=微信
            'service_wechat'     => '',
            'float_cart_icon'    => '',          // 悬浮购物车按钮图标（留空用默认 SVG）
            'float_home_icon'    => '',          // 悬浮首页按钮图标（留空用默认 SVG）
            'float_service_icon' => '',          // 悬浮客服按钮图标（留空用默认 SVG）
            'show_float_button'  => true,        // 首页悬浮按钮
            'cart_icon'          => 'cart3',     // 商品卡片加购图标：none/cart1/cart2/cart3/cart4/cart7/plus/plus2
            'cart_icon_bg'       => '#ffeded',   // 商品卡片加购按钮底色
            'cart_icon_color'    => '#ff4d4f',   // 商品卡片加购图标颜色
            'map_lng'            => 116.404,
            'map_lat'            => 39.915,
            'map_address'        => '北京市朝阳区',
            'map_name'           => 'B2C 商城（总店）',
            // 商品设置
            'buy_permission'     => 'all',       // all=所有人 / login=登录用户 / member=有会员卡
            'show_goods_sales'   => true,        // 商品详情显示销量
            'show_goods_promotion' => false,     // 商品详情显示促销语
            'show_goods_detail'  => true,        // 商品详情显示图文详情
            'show_goods_attr'    => false,       // 商品详情显示商品属性
            'show_goods_comment' => false,       // 商品详情显示评价
            'show_stock'         => true,        // 商品详情显示库存
            'show_original_price'=> true,        // 显示划线原价
            'text_goods_detail'  => '商品详情',   // 图文详情区块标题
            'text_goods_attr'    => '商品属性',   // 商品属性区块标题
            'text_goods_comment' => '商品评价',   // 商品评价区块标题
            'cart_button'        => true,        // 加入购物车按钮
            'buy_button'         => true,        // 立即购买按钮
            // 交易设置
            'auto_cancel_minutes'=> 30,          // 未支付订单自动取消（分钟）
            'auto_receive_days'  => 7,           // 自动确认收货（天），0=关闭
            'require_mobile'     => true,        // 下单需绑定手机号
            'allow_comment'      => true,        // 允许评价订单
            'pay_methods'        => ['wechat'],  // 可用支付方式 wechat=微信 balance=储值余额
            'ios_pay_limit'      => [            // iOS 端支付限制：true=在 iOS 上禁用该支付方式
                'card'      => false,            // 电子卡券
                'balance'   => false,            // 会员储值
                'knowledge' => false,            // 知识付费
            ],
            'pay_after_action'   => 'none',      // 支付后动作 none / coupon / points
            // 安全设置
            'captcha_login'      => false,       // 登录图形验证码
            'captcha_order'      => false,       // 下单图形验证码
            'slider_verify'      => true,        // 滑块验证
            'risk_control'       => 'low',       // 风控等级 low / middle / high
            'member_service_agreement'  => '',   // 会员服务协议（富文本）
            'member_privacy_agreement'  => '',   // 会员隐私政策（富文本）
            // 附件设置
            'attachment'         => [            // 远程附件配置
                'mode'   => 'local',             // local/ftp/aliyun/qiniu/tencent
                'ftp'    => ['ssl'=>0,'host'=>'','port'=>21,'user'=>'','password'=>'','pasv'=>1,'remote_dir'=>'','remote_url'=>'','timeout'=>0],
                'aliyun' => ['access_key_id'=>'','access_key_secret'=>'','internal'=>0,'bucket'=>'','custom_url'=>''],
                'qiniu'  => ['access_key'=>'','secret_key'=>'','bucket'=>'','url'=>''],
                'tencent'=> ['app_id'=>'','secret_id'=>'','secret_key'=>'','bucket'=>'','region'=>'','url'=>''],
            ],
            // 短信设置
            // 短信服务商配置（按平台独立开关）
            'sms'                => [
                'aliyun'  => [
                    'enabled'           => 0,
                    'access_key_id'     => '',
                    'access_key_secret' => '',
                    'sign_name'         => '',
                ],
                'tencent' => [
                    'enabled' => 0,
                    'app_id'  => '',
                    'app_key' => '',
                    'sign_name' => '',
                ],
            ],
            // 短信模板（阿里云/腾讯云内容变量格式不同）。共24条，按用户提供模板文件录入。
            'sms_templates'      => [
                'aliyun'  => [
                    'verify_code'            => ['description' => '短信验证码', 'template_id' => '', 'enabled' => 1, 'content' => '您的验证码为：${code}，该验证码5分钟内有效，请勿泄漏于他人！'],
                    'order_new'              => ['description' => '商家订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您有新的订单待处理，当前状态：${status}，订单摘要:${remark}，请及时处理。'],
                    'order_refund'           => ['description' => '商家订单退款提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您有新的订单待处理，当前状态：${status}，订单摘要:${remark}，请及时处理。'],
                    'order_seckill'          => ['description' => '商家秒杀订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您有新的订单待处理，当前状态：${status}，订单摘要:${remark}，请及时处理。'],
                    'order_group'            => ['description' => '商家拼团订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您有新的订单待处理，当前状态：${status}，订单摘要:${remark}，请及时处理。'],
                    'order_bargain'          => ['description' => '商家砍价订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您有新的订单待处理，当前状态：${status}，订单摘要:${remark}，请及时处理。'],
                    'order_points'           => ['description' => '商家积分订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您有新的订单待处理，当前状态：${status}，订单摘要:${remark}，请及时处理。'],
                    'order_reserve'          => ['description' => '商家预约订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您有新的预约订单，订单摘要:${remark}，请及时处理。'],
                    'withdraw_apply'         => ['description' => '商家提现申请提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您有新的提现申请，内容摘要:${remark}，请及时处理。'],
                    'form_submit'            => ['description' => '表单提交成功通知', 'template_id' => '', 'enabled' => 1, 'content' => '您有新的表单提交成功，摘要:${remark}，请及时处理。'],
                    'member_order'           => ['description' => '会员订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '亲爱的会员，您在${name}的订单提交成功。我们会尽快发货，感谢您的支持！'],
                    'member_seckill'         => ['description' => '会员秒杀订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '亲爱的会员，您在${name}的订单提交成功。我们会尽快发货，感谢您的支持！'],
                    'member_group'           => ['description' => '会员拼团订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '亲爱的会员，您在${name}的订单提交成功。我们会尽快发货，感谢您的支持！'],
                    'member_bargain'         => ['description' => '会员砍价订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '亲爱的会员，您在${name}的订单提交成功。我们会尽快发货，感谢您的支持！'],
                    'member_points'          => ['description' => '会员积分订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '亲爱的会员，您在${name}的订单提交成功。我们会尽快发货，感谢您的支持！'],
                    'member_reserve'         => ['description' => '会员预约订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '亲爱的会员，您在${name}的预约提交成功。感谢您的支持！'],
                    'stock_warning'          => ['description' => '商品库存预警提醒', 'template_id' => '', 'enabled' => 1, 'content' => '${goods_name}库存预警，剩余库存：${stock}，请及时补充库存。'],
                    'commission_withdraw'    => ['description' => '佣金提现到账提醒', 'template_id' => '', 'enabled' => 1, 'content' => '亲爱的会员，您在商家：${name}提交的佣金提现申请已通过，佣金会在一个工作日内到账，请关注账户余额变动，感谢您的支持。'],
                    'member_shipped'         => ['description' => '会员订单发货提醒', 'template_id' => '', 'enabled' => 1, 'content' => '亲爱的会员，您的订单${order_no}已发货，请注意查收，感谢您的支持！'],
                    'dispatch'               => ['description' => '派单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您有新的维修工单，工单摘要:${order_no}，请及时处理。'],
                    'pay_success'            => ['description' => '支付成功通知', 'template_id' => '', 'enabled' => 1, 'content' => '亲爱的会员，您在${name}的订单支付成功。我们会尽快发货，感谢您的支持！'],
                    'lottery'                => ['description' => '全渠道抽奖', 'template_id' => '', 'enabled' => 1, 'content' => '【${name}】恭喜您！在本次抽奖活动中获得${levelname}(${award})！请到小程序中兑换领取。'],
                ],
                'tencent' => [
                    'verify_code'            => ['description' => '短信验证码', 'template_id' => '', 'enabled' => 1, 'content' => '您的验证码{1}，该验证码5分钟内有效，请勿泄漏于他人！！'],
                    'order_new'              => ['description' => '商家订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您有新的订单待处理，当前状态：{1}，订单摘要:{2}，请及时处理。'],
                    'order_refund'           => ['description' => '商家订单退款提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您有新的订单待处理，当前状态：{1}，订单摘要:{2}，请及时处理。'],
                    'order_seckill'          => ['description' => '商家秒杀订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您有新的订单待处理，当前状态：{1}，订单摘要:{2}，请及时处理。'],
                    'order_group'            => ['description' => '商家拼团订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您有新的订单待处理，当前状态：{1}，订单摘要:{2}，请及时处理。'],
                    'order_bargain'          => ['description' => '商家砍价订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您有新的订单待处理，当前状态：{1}，订单摘要:{2}，请及时处理。'],
                    'order_points'           => ['description' => '商家积分订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您有新的订单待处理，当前状态：{1}，订单摘要:{2}，请及时处理。'],
                    'order_reserve'          => ['description' => '商家预约订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您有新的预约订单，订单摘要:{1}，请及时处理。'],
                    'withdraw_apply'         => ['description' => '商家提现申请提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您有新的提现申请，内容摘要:{1}，请及时处理。'],
                    'form_submit'            => ['description' => '表单提交成功通知', 'template_id' => '', 'enabled' => 1, 'content' => '您有新的表单提交成功，摘要:{1}，请及时处理。'],
                    'member_order'           => ['description' => '会员订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '亲爱的会员，您在{1}的订单提交成功。我们会尽快发货，感谢您的支持！'],
                    'member_seckill'         => ['description' => '会员秒杀订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '亲爱的会员，您在{1}的订单提交成功。我们会尽快发货，感谢您的支持！'],
                    'member_group'           => ['description' => '会员拼团订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '亲爱的会员，您在{1}的订单提交成功。我们会尽快发货，感谢您的支持！'],
                    'member_bargain'         => ['description' => '会员砍价订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '亲爱的会员，您在{1}的订单提交成功。我们会尽快发货，感谢您的支持！'],
                    'member_points'          => ['description' => '会员积分订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '亲爱的会员，您在{1}的订单提交成功。我们会尽快发货，感谢您的支持！'],
                    'member_reserve'         => ['description' => '会员预约订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '亲爱的会员，您在{1}的预约提交成功。感谢您的支持！'],
                    'stock_warning'          => ['description' => '商品库存预警提醒', 'template_id' => '', 'enabled' => 1, 'content' => '{1}库存预警，剩余库存：{2}，请及时补充库存。'],
                    'commission_withdraw'    => ['description' => '佣金提现到账提醒', 'template_id' => '', 'enabled' => 1, 'content' => '亲爱的会员，您在商家：{1}提交的佣金提现申请已通过，佣金会在一个工作日内到账，请关注账户余额变动，感谢您的支持。'],
                    'member_shipped'         => ['description' => '会员订单发货提醒', 'template_id' => '', 'enabled' => 1, 'content' => '亲爱的会员，您的订单{1}已发货，请注意查收，感谢您的支持！'],
                    'dispatch'               => ['description' => '派单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您有新的维修工单，工单摘要:{1}，请及时处理。'],
                    'pay_success'            => ['description' => '支付成功通知', 'template_id' => '', 'enabled' => 1, 'content' => '亲爱的会员，您在{1}的订单支付成功。我们会尽快发货，感谢您的支持！'],
                    'lottery'                => ['description' => '全渠道抽奖', 'template_id' => '', 'enabled' => 1, 'content' => '【{1}】恭喜您！在本次抽奖活动中获得{2}({3})！请到小程序中兑换领取。'],
                ],
            ],
            // 物流查询配置（快递鸟 / 快递100）
            'logistics_type'          => 'kdniao',    // kdniao=快递鸟 / kuaidi100=快递100
            'logistics_cache_minutes' => 20,          // 轨迹缓存时间（分钟）
            'kdniao_user_id'          => '',          // 快递鸟 用户ID（EBusinessID）
            'kdniao_api_key'          => '',          // 快递鸟 APIKey
            'kdniao_api_url'          => 'https://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx',
            'kdniao_sandbox'          => 0,           // 1=沙箱环境
            'kuaidi100_customer'      => '',          // 快递100 授权码（customer）
            'kuaidi100_api_key'       => '',          // 快递100 APIKey
            'kuaidi100_api_url'       => 'https://poll.kuaidi100.com/poll/query.do',
        ];
    }

    private static function ensureTable(): void
    {
        try {
            Db::query('SELECT 1 FROM ' . self::TABLE . ' LIMIT 1');
        } catch (\Throwable $e) {
            Db::execute("CREATE TABLE IF NOT EXISTS " . self::TABLE . " (
                id INTEGER PRIMARY KEY,
                config TEXT NOT NULL,
                updated_at INTEGER NOT NULL DEFAULT 0
            )");
        }
    }

    /** 读取并合并默认配置 */
    public static function get(): array
    {
        self::ensureTable();
        $row = Db::table(self::TABLE)->where('id', self::ROW_ID)->find();
        $cfg = $row && !empty($row['config']) ? json_decode($row['config'], true) : [];
        if (!is_array($cfg)) $cfg = [];
        return array_merge(self::defaults(), $cfg);
    }

    /** 覆盖保存（仅写入传入键，与默认值/已有值合并） */
    public static function save(array $data): array
    {
        self::ensureTable();
        $cfg = array_merge(self::get(), $data);
        $now = time();
        $exists = Db::table(self::TABLE)->where('id', self::ROW_ID)->find();
        if ($exists) {
            Db::table(self::TABLE)->where('id', self::ROW_ID)
                ->update(['config' => json_encode($cfg, JSON_UNESCAPED_UNICODE), 'updated_at' => $now]);
        } else {
            Db::table(self::TABLE)->insert([
                'id' => self::ROW_ID,
                'config' => json_encode($cfg, JSON_UNESCAPED_UNICODE),
                'updated_at' => $now,
            ]);
        }
        return $cfg;
    }
}
