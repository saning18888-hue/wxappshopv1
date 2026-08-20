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
            'admin_copyright'    => '',          // 后台版权信息
            'domain_verify_file' => '',           // 域名校验文件名
            'service_type'       => 'online',    // online=在线客服 / phone=电话 / wechat=微信
            'service_phone'      => '',
            'service_wechat'     => '',
            'show_float_button'  => true,        // 首页悬浮按钮
            'map_lng'            => 116.404,
            'map_lat'            => 39.915,
            'map_address'        => '北京市朝阳区',
            'map_name'           => 'B2C 商城（总店）',
            // 商品设置
            'buy_permission'     => 'all',       // all=所有人 / login=登录用户 / member=有会员卡
            'show_sales'         => true,        // 商品详情显示销量
            'show_stock'         => true,        // 商品详情显示库存
            'show_original_price'=> true,        // 显示划线原价
            'show_comment'       => true,        // 显示评价
            'cart_button'        => true,        // 加入购物车按钮
            'buy_button'         => true,        // 立即购买按钮
            // 交易设置
            'auto_cancel_minutes'=> 30,          // 未支付订单自动取消（分钟）
            'require_mobile'     => true,        // 下单需绑定手机号
            'allow_comment'      => true,        // 允许评价订单
            'pay_methods'        => ['wechat'],  // 可用支付方式
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
            // 短信模板（阿里云/腾讯云内容变量格式不同）
            'sms_templates'      => [
                'aliyun'  => [
                    'verify_code'     => ['description' => '短信验证码', 'template_id' => '', 'enabled' => 1, 'content' => '您的验证码为：${code}，该验证码5分钟内有效，请勿泄漏于他人！'],
                    'order_new'       => ['description' => '商家订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您有新的订单待处理，当前状态：${status}，订单摘要：${remark}，请及时处理。'],
                    'order_refund'    => ['description' => '商家订单退款提醒', 'template_id' => '', 'enabled' => 0, 'content' => '您有新的订单待处理，当前状态：${status}，订单摘要：${remark}，请及时处理。'],
                    'withdraw'        => ['description' => '商家提现申请提醒', 'template_id' => '', 'enabled' => 0, 'content' => '有新的提现申请待处理，申请人：${name}，金额：${amount}，请及时处理。'],
                    'group_success'   => ['description' => '商家拼团订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您参与的拼团（${goods_name}）已成团，订单号：${order_sn}。'],
                    'seckill_success' => ['description' => '商家秒杀订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您参与的秒杀活动（${goods_name}）已成功下单，订单号：${order_sn}。'],
                    'bargain_success' => ['description' => '商家砍价订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您的砍价商品（${goods_name}）已砍至底价，订单号：${order_sn}。'],
                ],
                'tencent' => [
                    'verify_code'     => ['description' => '短信验证码', 'template_id' => '', 'enabled' => 1, 'content' => '您的验证码{1}，该验证码5分钟内有效，请勿泄漏于他人！！'],
                    'order_new'       => ['description' => '商家订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您有新的订单待处理，当前状态：{1}，订单摘要：{2}，请及时处理。'],
                    'order_refund'    => ['description' => '商家订单退款提醒', 'template_id' => '', 'enabled' => 0, 'content' => '您有新的订单待处理，当前状态：{1}，订单摘要：{2}，请及时处理。'],
                    'withdraw'        => ['description' => '商家提现申请提醒', 'template_id' => '', 'enabled' => 0, 'content' => '有新的提现申请待处理，申请人：{1}，金额：{2}，请及时处理。'],
                    'group_success'   => ['description' => '商家拼团订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您参与的拼团（{1}）已成团，订单号：{2}。'],
                    'seckill_success' => ['description' => '商家秒杀订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您参与的秒杀活动（{1}）已成功下单，订单号：{2}。'],
                    'bargain_success' => ['description' => '商家砍价订单提醒', 'template_id' => '', 'enabled' => 1, 'content' => '您的砍价商品（{1}）已砍至底价，订单号：{2}。'],
                ],
            ],
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
