<?php
namespace app\service;

/**
 * 物流轨迹查询服务：对接「快递鸟 / 快递100」两家即时查询接口。
 *
 * - 配置来源：SettingsService 中的 logistics_type / 各平台凭据。
 * - 入参中的快递公司为中文名（如「顺丰速运」），内部映射到接口所需的快递代码。
 * - 结果统一归一化为：
 *   [
 *     'success' => bool,
 *     'message' => string,
 *     'data'    => [
 *        'company'     => 中文名,
 *        'no'          => 运单号,
 *        'state'       => int (0在途/1揽收/2疑难/3签收/4退签/5派件/6退回/7转投),
 *        'state_text'  => string,
 *        'traces'      => [ ['time'=>,'context'=>], ... ]  // 按时间倒序（最新在前）
 *     ]
 *   ]
 */
class LogisticsService
{
    /** 快递公司中文名 → 接口代码（覆盖后台发货下拉里的常见公司；两家接口的常用代码基本一致） */
    const COMPANY_MAP = [
        '顺丰速运' => 'SF',   '顺丰' => 'SF',
        '百世快递' => 'HTKY', '百世' => 'HTKY', '百世汇通' => 'HTKY',
        '中通快递' => 'ZTO',  '中通' => 'ZTO',
        '申通快递' => 'STO',  '申通' => 'STO',
        '圆通速递' => 'YTO',  '圆通' => 'YTO',
        '韵达速递' => 'YD',   '韵达' => 'YD',
        '京东物流' => 'JD',   '京东' => 'JD', '京东快递' => 'JD',
        'EMS' => 'EMS', '邮政' => 'EMS', '中国邮政' => 'EMS', '邮政快递包裹' => 'EMS',
        '德邦快递' => 'DBL',  '德邦' => 'DBL', '德邦物流' => 'DBL',
        '天天快递' => 'HHTT', '天天' => 'HHTT',
        '优速快递' => 'UC',   '优速' => 'UC',
        '极兔速递' => 'JTSD', '极兔' => 'JTSD',
        '跨越速运' => 'KYSY', '跨越' => 'KYSY',
        '顺丰同城' => 'SX',   '苏宁易购' => 'SNY', '小米快递' => 'XIAOMI',
    ];

    /** 物流状态枚举（与快递100 / 快递鸟通用语义对齐） */
    const STATE_TEXT = [
        0 => '运输中', 1 => '已揽收', 2 => '疑难', 3 => '已签收',
        4 => '已退签', 5 => '派送中', 6 => '已退回', 7 => '转寄',
    ];

    /** 将中文公司名（或已是代码）转为接口代码 */
    public static function companyToCode(string $name): string
    {
        $name = trim($name);
        if ($name === '') return '';
        if (isset(self::COMPANY_MAP[$name])) return self::COMPANY_MAP[$name];
        $upper = strtoupper($name);
        if (in_array($upper, array_values(self::COMPANY_MAP), true)) return $upper;
        return $name; // 兜底：原样（可能是自定义代码）
    }

    /**
     * 查询物流轨迹
     * @param string $company 中文公司名或代码
     * @param string $no       运单号
     * @param string $phone    收/寄件人手机号后四位（部分接口需要）
     * @param bool   $force    是否忽略缓存强制查询
     */
    public static function track(string $company, string $no, string $phone = '', bool $force = false): array
    {
        $no = trim($no);
        if ($no === '') {
            return ['success' => false, 'message' => '运单号不能为空', 'data' => null];
        }
        $cfg = SettingsService::get();
        $type = $cfg['logistics_type'] ?? 'kdniao';
        $code = self::companyToCode($company);
        $cacheKey = 'logi:' . $type . ':' . $code . ':' . $no;

        if (!$force) {
            $cached = self::cacheGet($cacheKey, (int) ($cfg['logistics_cache_minutes'] ?? 20));
            if ($cached !== null) {
                return ['success' => true, 'message' => 'ok', 'data' => $cached, 'cached' => true];
            }
        }

        try {
            if ($type === 'kuaidi100') {
                $result = self::queryKuaidi100($cfg, $code, $no, $phone);
            } else {
                $result = self::queryKdniao($cfg, $code, $no);
            }
        } catch (\Throwable $e) {
            return ['success' => false, 'message' => '查询异常：' . $e->getMessage(), 'data' => null];
        }

        if ($result['success']) {
            self::cacheSet($cacheKey, $result['data']);
        }
        return $result;
    }

    /** 后台「测试连接」：用示例单号验证凭据是否可用 */
    public static function test(): array
    {
        $cfg = SettingsService::get();
        $type = $cfg['logistics_type'] ?? 'kdniao';
        if ($type === 'kuaidi100') {
            if (empty($cfg['kuaidi100_customer']) || empty($cfg['kuaidi100_api_key'])) {
                return ['success' => false, 'message' => '请先填写快递100的「授权码」与「APIKey」'];
            }
        } else {
            if (empty($cfg['kdniao_user_id']) || empty($cfg['kdniao_api_key'])) {
                return ['success' => false, 'message' => '请先填写快递鸟的「用户ID」与「APIKey」'];
            }
        }
        // 用顺丰示例单号做真实请求，判断凭据与网络是否可用
        $sample = self::track('顺丰速运', 'SF1234567890', '', true);
        if (!$sample['success']) {
            return ['success' => false, 'message' => '接口调用失败：' . $sample['message']];
        }
        return ['success' => true, 'message' => '接口调用成功，配置可用'];
    }

    // ---------------- 快递鸟（即时查询 1002） ----------------
    private static function queryKdniao(array $cfg, string $code, string $no): array
    {
        $userId = trim($cfg['kdniao_user_id'] ?? '');
        $apiKey = trim($cfg['kdniao_api_key'] ?? '');
        if ($userId === '' || $apiKey === '') {
            return ['success' => false, 'message' => '快递鸟未配置用户ID或APIKey'];
        }
        $sandbox = !empty($cfg['kdniao_sandbox']);
        $url = $sandbox
            ? 'http://sandbox.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json'
            : (trim($cfg['kdniao_api_url'] ?? '') ?: 'https://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx');

        $requestData = json_encode([
            'OrderCode'   => '',
            'ShipperCode' => $code,
            'LogisticCode' => $no,
        ], JSON_UNESCAPED_UNICODE);

        // 签名：base64(md5(RequestData + APIKey)) 再 urlencode（MD5 使用原始二进制）
        $dataSign = urlencode(base64_encode(md5($requestData . $apiKey, true)));

        $post = [
            'RequestData' => urlencode($requestData),
            'EBusinessID' => $userId,
            'RequestType' => '1002',
            'DataSign'    => $dataSign,
            'DataType'    => '2',
        ];

        $resp = self::httpPost($url, $post, 8);
        if ($resp === false) {
            return ['success' => false, 'message' => '请求快递鸟接口失败（网络/超时）'];
        }
        $json = json_decode($resp, true);
        if (!is_array($json)) {
            return ['success' => false, 'message' => '快递鸟返回数据解析失败'];
        }
        if (empty($json['Success'])) {
            return ['success' => false, 'message' => $json['Reason'] ?? '快递鸟查询失败'];
        }
        $traces = [];
        foreach (array_reverse($json['Traces'] ?? []) as $t) {
            $traces[] = [
                'time'    => $t['AcceptTime'] ?? '',
                'context' => $t['AcceptStation'] ?? '',
            ];
        }
        return [
            'success' => true,
            'message' => 'ok',
            'data'    => [
                'company'    => $json['ShipperCode'] ?? $code,
                'no'         => $json['LogisticCode'] ?? $no,
                'state'      => (int) ($json['State'] ?? 0),
                'state_text' => self::STATE_TEXT[(int) ($json['State'] ?? 0)] ?? '未知',
                'traces'     => $traces,
            ],
        ];
    }

    // ---------------- 快递100（实时查询） ----------------
    private static function queryKuaidi100(array $cfg, string $code, string $no, string $phone): array
    {
        $customer = trim($cfg['kuaidi100_customer'] ?? '');
        $apiKey = trim($cfg['kuaidi100_api_key'] ?? '');
        if ($customer === '' || $apiKey === '') {
            return ['success' => false, 'message' => '快递100未配置授权码或APIKey'];
        }
        $url = trim($cfg['kuaidi100_api_url'] ?? '') ?: 'https://poll.kuaidi100.com/poll/query.do';

        // 参数：com 快递代码、num 单号、phone 手机号后四位、from/to 出发/目的地
        $param = json_encode([
            'com'    => $code,
            'num'    => $no,
            'phone'  => $phone,
            'from'   => '',
            'to'     => '',
            'resultv2' => '1',
        ], JSON_UNESCAPED_UNICODE);

        // 签名：md5(param + customer + key) 转大写
        $sign = strtoupper(md5($param . $customer . $apiKey));

        $post = [
            'customer' => $customer,
            'sign'     => $sign,
            'param'    => $param,
        ];

        $resp = self::httpPost($url, $post, 8);
        if ($resp === false) {
            return ['success' => false, 'message' => '请求快递100接口失败（网络/超时）'];
        }
        $json = json_decode($resp, true);
        if (!is_array($json)) {
            return ['success' => false, 'message' => '快递100返回数据解析失败'];
        }
        if (($json['message'] ?? '') !== 'ok') {
            return ['success' => false, 'message' => $json['message'] ?? '快递100查询失败'];
        }
        $traces = [];
        foreach (array_reverse($json['data'] ?? []) as $t) {
            $traces[] = [
                'time'    => $t['ftime'] ?? ($t['time'] ?? ''),
                'context' => $t['context'] ?? '',
            ];
        }
        $state = (int) ($json['state'] ?? 0);
        return [
            'success' => true,
            'message' => 'ok',
            'data'    => [
                'company'    => $json['com'] ?? $code,
                'no'         => $json['nu'] ?? $no,
                'state'      => $state,
                'state_text' => self::STATE_TEXT[$state] ?? '未知',
                'traces'     => $traces,
            ],
        ];
    }

    // ---------------- HTTP / 缓存 ----------------
    private static function httpPost(string $url, array $params, int $timeout = 8)
    {
        $body = http_build_query($params);
        if (function_exists('curl_init')) {
            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => $body,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT        => $timeout,
                CURLOPT_CONNECTTIMEOUT => $timeout,
                CURLOPT_HTTPHEADER     => ['Content-Type: application/x-www-form-urlencoded'],
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => 0,
            ]);
            $resp = curl_exec($ch);
            $err = curl_errno($ch);
            curl_close($ch);
            return $err ? false : $resp;
        }
        // 兜底：file_get_contents
        $opts = [
            'http' => [
                'method'  => 'POST',
                'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
                'content' => $body,
                'timeout' => $timeout,
            ],
        ];
        $ctx = stream_context_create($opts);
        $resp = @file_get_contents($url, false, $ctx);
        return $resp === false ? false : $resp;
    }

    private static function cacheDir(): string
    {
        $dir = sys_get_temp_dir() . '/b2c_logistics_cache';
        if (!is_dir($dir)) @mkdir($dir, 0777, true);
        return $dir;
    }

    private static function cacheGet(string $key, int $minutes): ?array
    {
        $file = self::cacheDir() . '/' . md5($key) . '.json';
        if (!is_file($file)) return null;
        $content = @file_get_contents($file);
        if (!$content) return null;
        $arr = json_decode($content, true);
        if (!is_array($arr) || !isset($arr['expire']) || !isset($arr['data'])) return null;
        if (time() > $arr['expire']) {
            @unlink($file);
            return null;
        }
        return $arr['data'];
    }

    private static function cacheSet(string $key, array $data, int $minutes = 20): void
    {
        $file = self::cacheDir() . '/' . md5($key) . '.json';
        $arr = ['expire' => time() + max(1, $minutes) * 60, 'data' => $data];
        @file_put_contents($file, json_encode($arr, JSON_UNESCAPED_UNICODE));
    }
}
