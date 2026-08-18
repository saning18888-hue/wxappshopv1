<?php

declare(strict_types=1);

namespace app\service;

use think\facade\Db;

class StatsService
{
    /**
     * 解析日期范围，返回 [start, end]（Y-m-d 字符串）
     */
    public function parseRange(string $range = 'today', string $start = '', string $end = ''): array
    {
        $end   = date('Y-m-d');
        $start = $end;
        switch ($range) {
            case 'yesterday':
                $start = date('Y-m-d', strtotime('-1 day'));
                $end   = $start;
                break;
            case 'last7':
                $start = date('Y-m-d', strtotime('-6 day'));
                break;
            case 'last30':
                $start = date('Y-m-d', strtotime('-29 day'));
                break;
            case 'custom':
                if ($start && $end) {
                    if (strtotime($start) > strtotime($end)) {
                        [$start, $end] = [$end, $start];
                    }
                    $startTs = strtotime($start);
                    $endTs   = strtotime($end);
                    $maxStart = strtotime('-29 day', strtotime($end));
                    if ($startTs < $maxStart) {
                        $start = date('Y-m-d', $maxStart);
                    }
                } else {
                    $start = date('Y-m-d', strtotime('-6 day'));
                }
                break;
            case 'today':
            default:
                break;
        }
        return [$start, $end];
    }

    /**
     * 商城概况：核心指标 + 趋势
     */
    public function overview(string $range = 'today', string $start = '', string $end = ''): array
    {
        [$start, $end] = $this->parseRange($range, $start, $end);
        $startDt = $start . ' 00:00:00';
        $endDt   = $end . ' 23:59:59';

        $paidWhere = "status IN (1,2,3,4,5) AND is_deleted = 0 AND pay_time IS NOT NULL";
        $paidSummary = Db::table('orders')
            ->whereRaw("{$paidWhere} AND pay_time BETWEEN '{$startDt}' AND '{$endDt}'")
            ->field([
                'COUNT(*) as paid_orders',
                'SUM(pay_amount) as paid_amount',
                'COUNT(DISTINCT user_id) as paid_buyers',
            ])
            ->find();

        $paidItems = Db::table('order_items oi')
            ->join('orders o', 'oi.order_id = o.id')
            ->whereRaw("o.{$paidWhere} AND o.pay_time BETWEEN '{$startDt}' AND '{$endDt}'")
            ->field('SUM(oi.quantity) as paid_qty')
            ->find();

        $metrics = [
            'paid_amount'   => round((float) ($paidSummary['paid_amount'] ?? 0) / 100, 2),
            'paid_orders'   => (int) ($paidSummary['paid_orders'] ?? 0),
            'paid_buyers'   => (int) ($paidSummary['paid_buyers'] ?? 0),
            'paid_items'    => (int) ($paidItems['paid_qty'] ?? 0),
            'order_profit'  => round((float) ($paidSummary['paid_amount'] ?? 0) / 100, 2),
        ];

        // 趋势：按天
        $dates = [];
        $cur   = strtotime($start);
        $endTs = strtotime($end);
        while ($cur <= $endTs) {
            $dates[] = date('Y-m-d', $cur);
            $cur += 86400;
        }

        $trendRaw = Db::query("SELECT DATE(pay_time) as date,
            COUNT(*) as paid_orders,
            SUM(pay_amount) as paid_amount,
            COUNT(DISTINCT user_id) as paid_buyers
            FROM orders
            WHERE {$paidWhere} AND pay_time BETWEEN '{$startDt}' AND '{$endDt}'
            GROUP BY date");
        $trendRaw = array_column($trendRaw, null, 'date');

        $trendItems = Db::query("SELECT DATE(o.pay_time) as date,
            SUM(oi.quantity) as paid_qty
            FROM order_items oi
            JOIN orders o ON o.id = oi.order_id
            WHERE o.{$paidWhere} AND o.pay_time BETWEEN '{$startDt}' AND '{$endDt}'
            GROUP BY date");
        $trendItems = array_column($trendItems, null, 'date');

        $trend = [];
        foreach ($dates as $d) {
            $row  = $trendRaw[$d] ?? [];
            $item = $trendItems[$d] ?? [];
            $amt  = round((float) ($row['paid_amount'] ?? 0) / 100, 2);
            $trend[] = [
                'date'          => $d,
                'paid_amount'   => $amt,
                'paid_orders'   => (int) ($row['paid_orders'] ?? 0),
                'paid_buyers'   => (int) ($row['paid_buyers'] ?? 0),
                'paid_items'    => (int) ($item['paid_qty'] ?? 0),
                'order_profit'  => $amt,
            ];
        }

        return compact('start', 'end', 'metrics', 'trend');
    }

    /**
     * 交易分析：漏斗
     */
    public function tradeFunnel(string $range = 'today', string $start = '', string $end = ''): array
    {
        [$start, $end] = $this->parseRange($range, $start, $end);
        $startDt = $start . ' 00:00:00';
        $endDt   = $end . ' 23:59:59';

        // 访客数：用独立 session
        $visitors = Db::table('visitor_sessions')
            ->whereRaw("created_at BETWEEN '{$startDt}' AND '{$endDt}'")
            ->count('DISTINCT session_id');

        // 下单：创建订单即算
        $orders = Db::table('orders')
            ->whereRaw("created_at BETWEEN '{$startDt}' AND '{$endDt}' AND status NOT IN (10,20)")
            ->field([
                'COUNT(*) as order_count',
                'COUNT(DISTINCT user_id) as buyer_count',
                'SUM(pay_amount) as order_amount',
            ])
            ->find();

        // 付款
        $paid = Db::table('orders')
            ->whereRaw("status IN (1,2,3,4,5) AND is_deleted = 0 AND pay_time IS NOT NULL AND pay_time BETWEEN '{$startDt}' AND '{$endDt}'")
            ->field([
                'COUNT(*) as paid_count',
                'COUNT(DISTINCT user_id) as paid_buyers',
                'SUM(pay_amount) as paid_amount',
            ])
            ->find();

        $visitorCnt = (int) $visitors;
        $orderCnt   = (int) ($orders['order_count'] ?? 0);
        $paidCnt    = (int) ($paid['paid_count'] ?? 0);

        return [
            'start'               => $start,
            'end'                 => $end,
            'visitor_count'       => $visitorCnt,
            'order_buyer_count'   => (int) ($orders['buyer_count'] ?? 0),
            'order_count'         => $orderCnt,
            'order_amount'        => round((float) ($orders['order_amount'] ?? 0) / 100, 2),
            'paid_buyer_count'    => (int) ($paid['paid_buyers'] ?? 0),
            'paid_count'          => $paidCnt,
            'paid_amount'         => round((float) ($paid['paid_amount'] ?? 0) / 100, 2),
            'visitor_to_order'    => $visitorCnt > 0 ? round($orderCnt / $visitorCnt * 100, 2) : 0,
            'visitor_to_paid'     => $visitorCnt > 0 ? round($paidCnt / $visitorCnt * 100, 2) : 0,
            'order_to_paid'       => $orderCnt > 0 ? round($paidCnt / $orderCnt * 100, 2) : 0,
        ];
    }

    /**
     * 商品分析：指标 + 商品排行
     */
    public function goodsAnalysis(string $range = 'today', string $start = '', string $end = '', string $keyword = ''): array
    {
        [$start, $end] = $this->parseRange($range, $start, $end);
        $startDt = $start . ' 00:00:00';
        $endDt   = $end . ' 23:59:59';

        $newGoods = Db::table('goods')
            ->whereRaw("created_at BETWEEN '{$startDt}' AND '{$endDt}'")
            ->count();

        // 商品访客/浏览：按 page_views 中 page='商品详情' 统计
        $pvVisitors = Db::table('page_views')
            ->whereRaw("page LIKE '商品详情%' AND created_at BETWEEN '{$startDt}' AND '{$endDt}'")
            ->count('DISTINCT session_id');
        $pvCount = Db::table('page_views')
            ->whereRaw("page LIKE '商品详情%' AND created_at BETWEEN '{$startDt}' AND '{$endDt}'")
            ->count();
        $viewedGoods = Db::table('page_views')
            ->whereRaw("page LIKE '商品详情%' AND created_at BETWEEN '{$startDt}' AND '{$endDt}'")
            ->count('DISTINCT user_id');

        $metrics = [
            'new_goods'      => (int) $newGoods,
            'goods_visitors' => (int) $pvVisitors,
            'goods_pv'       => (int) $pvCount,
            'viewed_goods'   => (int) $viewedGoods,
        ];

        // 商品排行
        $sql = "SELECT
            g.id,
            g.title,
            g.images,
            COALESCE(SUM(oi.quantity),0) AS paid_qty,
            COALESCE(SUM(oi.subtotal),0) AS paid_amount,
            COUNT(DISTINCT o.user_id) AS paid_buyers,
            COUNT(DISTINCT o.id) AS paid_orders
        FROM goods g
        LEFT JOIN order_items oi ON oi.goods_id = g.id
        LEFT JOIN orders o ON o.id = oi.order_id AND o.status IN (1,2,3,4,5) AND o.is_deleted = 0 AND o.pay_time IS NOT NULL AND o.pay_time BETWEEN '{$startDt}' AND '{$endDt}'
        WHERE 1=1";
        if ($keyword) {
            $k = addslashes($keyword);
            $sql .= " AND g.title LIKE '%{$k}%'";
        }
        $sql .= " GROUP BY g.id ORDER BY paid_amount DESC, paid_qty DESC LIMIT 50";

        $rows = Db::query($sql);
        $list = [];
        foreach ($rows as $r) {
            $images = json_decode($r['images'] ?? '[]', true);
            $paidQty = (int) $r['paid_qty'];
            $pv = Db::table('page_views')
                ->whereRaw("page LIKE '商品详情%' AND created_at BETWEEN '{$startDt}' AND '{$endDt}'")
                ->count();
            // 这里简化：单个商品没有独立 page 字段，用全局商品详情 PV 作为分母估算
            $rate = $pv > 0 ? round($paidQty / $pv * 100, 2) : 0;
            $list[] = [
                'id'           => $r['id'],
                'title'        => $r['title'],
                'image'        => $images[0] ?? '',
                'pv'           => $pv,
                'visitors'     => (int) Db::table('page_views')->whereRaw("page LIKE '商品详情%' AND created_at BETWEEN '{$startDt}' AND '{$endDt}'")->count('DISTINCT session_id'),
                'paid_buyers'  => (int) $r['paid_buyers'],
                'paid_amount'  => round((float) $r['paid_amount'] / 100, 2),
                'paid_qty'     => $paidQty,
                'paid_rate'    => $rate,
            ];
        }

        return compact('start', 'end', 'metrics', 'list');
    }

    /**
     * 网站分析：流量指标 + 趋势
     */
    public function webOverview(string $range = 'today', string $start = '', string $end = ''): array
    {
        [$start, $end] = $this->parseRange($range, $start, $end);
        $startDt = $start . ' 00:00:00';
        $endDt   = $end . ' 23:59:59';

        $pv      = Db::table('page_views')->whereRaw("created_at BETWEEN '{$startDt}' AND '{$endDt}'")->count();
        $uv      = Db::table('page_views')->whereRaw("created_at BETWEEN '{$startDt}' AND '{$endDt}'")->count('DISTINCT session_id');
        $ipCount = Db::table('page_views')->whereRaw("created_at BETWEEN '{$startDt}' AND '{$endDt}'")->count('DISTINCT ip');
        $vv      = Db::table('visitor_sessions')->whereRaw("created_at BETWEEN '{$startDt}' AND '{$endDt}'")->count();
        $avgDepth = Db::table('visitor_sessions')->whereRaw("created_at BETWEEN '{$startDt}' AND '{$endDt}'")->avg('page_count') ?: 0;
        $avgPages = Db::table('page_views')->whereRaw("created_at BETWEEN '{$startDt}' AND '{$endDt}'")->count() / max(1, $vv);
        $stayTime = Db::table('page_views')->whereRaw("created_at BETWEEN '{$startDt}' AND '{$endDt}'")->sum('stay_time') ?: 0;
        $avgStay  = $pv > 0 ? round($stayTime / $pv, 0) : 0;
        $bounceCount = Db::table('visitor_sessions')->whereRaw("created_at BETWEEN '{$startDt}' AND '{$endDt}' AND page_count = 1")->count();
        $bounceRate = $vv > 0 ? round($bounceCount / $vv * 100, 2) : 0;

        $metrics = [
            'pv'          => (int) $pv,
            'uv'          => (int) $uv,
            'ip'          => (int) $ipCount,
            'vv'          => (int) $vv,
            'avg_depth'   => round((float) $avgDepth, 2),
            'avg_pages'   => round((float) $avgPages, 2),
            'avg_stay'    => gmdate('i:s', (int) $avgStay),
            'bounce_rate' => $bounceRate,
        ];

        $dates = [];
        $cur   = strtotime($start);
        $endTs = strtotime($end);
        while ($cur <= $endTs) {
            $dates[] = date('Y-m-d', $cur);
            $cur += 86400;
        }

        $trend = [];
        foreach ($dates as $d) {
            $ds = $d . ' 00:00:00';
            $de = $d . ' 23:59:59';
            $dayPv = (int) Db::table('page_views')->whereRaw("created_at BETWEEN '{$ds}' AND '{$de}'")->count();
            $dayVv = (int) Db::table('visitor_sessions')->whereRaw("created_at BETWEEN '{$ds}' AND '{$de}'")->count();
            $dayStay = (int) Db::table('page_views')->whereRaw("created_at BETWEEN '{$ds}' AND '{$de}'")->sum('stay_time') ?: 0;
            $dayBounce = (int) Db::table('visitor_sessions')->whereRaw("created_at BETWEEN '{$ds}' AND '{$de}' AND page_count = 1")->count();
            $trend[] = [
                'date'        => $d,
                'pv'          => $dayPv,
                'uv'          => (int) Db::table('page_views')->whereRaw("created_at BETWEEN '{$ds}' AND '{$de}'")->count('DISTINCT session_id'),
                'ip'          => (int) Db::table('page_views')->whereRaw("created_at BETWEEN '{$ds}' AND '{$de}'")->count('DISTINCT ip'),
                'vv'          => $dayVv,
                'avg_depth'   => round((float) Db::table('visitor_sessions')->whereRaw("created_at BETWEEN '{$ds}' AND '{$de}'")->avg('page_count') ?: 0, 2),
                'avg_pages'   => $dayVv > 0 ? round($dayPv / $dayVv, 2) : 0,
                'avg_stay'    => $dayPv > 0 ? round($dayStay / $dayPv, 0) : 0,
                'bounce_rate' => $dayVv > 0 ? round($dayBounce / $dayVv * 100, 2) : 0,
            ];
        }

        return compact('start', 'end', 'metrics', 'trend');
    }

    /**
     * 新老访客统计
     */
    public function webVisitors(string $range = 'today', string $start = '', string $end = ''): array
    {
        [$start, $end] = $this->parseRange($range, $start, $end);
        $startDt = $start . ' 00:00:00';
        $endDt   = $end . ' 23:59:59';

        $new = Db::table('visitor_sessions')
            ->whereRaw("created_at BETWEEN '{$startDt}' AND '{$endDt}' AND is_new = 1")
            ->count();
        $old = Db::table('visitor_sessions')
            ->whereRaw("created_at BETWEEN '{$startDt}' AND '{$endDt}' AND is_new = 0")
            ->count();
        return compact('start', 'end', 'new', 'old');
    }

    /**
     * 着陆页面 TOP10
     */
    public function webTopPages(string $range = 'today', string $start = '', string $end = ''): array
    {
        [$start, $end] = $this->parseRange($range, $start, $end);
        $startDt = $start . ' 00:00:00';
        $endDt   = $end . ' 23:59:59';

        $rows = Db::table('page_views')
            ->whereRaw("created_at BETWEEN '{$startDt}' AND '{$endDt}'")
            ->field(['page', 'COUNT(*) as count'])
            ->group('page')
            ->order('count', 'DESC')
            ->limit(10)
            ->select();
        return [
            'start' => $start,
            'end'   => $end,
            'list'  => $rows->toArray(),
        ];
    }

    /**
     * 汇总分析：多维度汇总表
     */
    public function summary(string $range = 'today', string $start = '', string $end = ''): array
    {
        [$start, $end] = $this->parseRange($range, $start, $end);
        $startDt = $start . ' 00:00:00';
        $endDt   = $end . ' 23:59:59';

        $totalUsers = Db::table('users')->where('status', 1)->count();
        $sales      = Db::table('orders')
            ->whereRaw("status IN (1,2,3,4,5) AND is_deleted = 0 AND pay_time IS NOT NULL AND pay_time BETWEEN '{$startDt}' AND '{$endDt}'")
            ->sum('pay_amount') ?: 0;
        $points     = Db::table('users')->sum('points') ?: 0;
        $balance    = Db::table('users')->sum('balance') ?: 0;

        $rows = [
            ['name' => '会员数', 'total' => $totalUsers, 'authorized' => 0, 'unauthorized' => $totalUsers, 'distributor' => 0, 'captain' => 0, 'shareholder' => 0, 'province_agent' => 0, 'city_agent' => 0, 'district_agent' => 0],
            ['name' => '销售额', 'total' => round((float)$sales / 100, 2), 'authorized' => 0, 'unauthorized' => round((float)$sales / 100, 2), 'distributor' => 0, 'captain' => 0, 'shareholder' => 0, 'province_agent' => 0, 'city_agent' => 0, 'district_agent' => 0],
            ['name' => '已提现金额', 'total' => 0, 'authorized' => 0, 'unauthorized' => 0, 'distributor' => 0, 'captain' => 0, 'shareholder' => 0, 'province_agent' => 0, 'city_agent' => 0, 'district_agent' => 0],
            ['name' => '待提现金额', 'total' => 0, 'authorized' => 0, 'unauthorized' => 0, 'distributor' => 0, 'captain' => 0, 'shareholder' => 0, 'province_agent' => 0, 'city_agent' => 0, 'district_agent' => 0],
            ['name' => '未结算金额', 'total' => 0, 'authorized' => 0, 'unauthorized' => 0, 'distributor' => 0, 'captain' => 0, 'shareholder' => 0, 'province_agent' => 0, 'city_agent' => 0, 'district_agent' => 0],
            ['name' => '积分总额', 'total' => (int) $points, 'authorized' => 0, 'unauthorized' => (int) $points, 'distributor' => 0, 'captain' => 0, 'shareholder' => 0, 'province_agent' => 0, 'city_agent' => 0, 'district_agent' => 0],
            ['name' => '储值余额', 'total' => round((float)$balance / 100, 2), 'authorized' => 0, 'unauthorized' => round((float)$balance / 100, 2), 'distributor' => 0, 'captain' => 0, 'shareholder' => 0, 'province_agent' => 0, 'city_agent' => 0, 'district_agent' => 0],
            ['name' => '分销商佣金', 'total' => 0, 'authorized' => 0, 'unauthorized' => 0, 'distributor' => 0, 'captain' => 0, 'shareholder' => 0, 'province_agent' => 0, 'city_agent' => 0, 'district_agent' => 0],
            ['name' => '队长分红金额', 'total' => 0, 'authorized' => 0, 'unauthorized' => 0, 'distributor' => 0, 'captain' => 0, 'shareholder' => 0, 'province_agent' => 0, 'city_agent' => 0, 'district_agent' => 0],
            ['name' => '股东分红金额', 'total' => 0, 'authorized' => 0, 'unauthorized' => 0, 'distributor' => 0, 'captain' => 0, 'shareholder' => 0, 'province_agent' => 0, 'city_agent' => 0, 'district_agent' => 0],
            ['name' => '代理分红金额', 'total' => 0, 'authorized' => 0, 'unauthorized' => 0, 'distributor' => 0, 'captain' => 0, 'shareholder' => 0, 'province_agent' => 0, 'city_agent' => 0, 'district_agent' => 0],
            ['name' => '批发金额', 'total' => 0, 'authorized' => 0, 'unauthorized' => 0, 'distributor' => 0, 'captain' => 0, 'shareholder' => 0, 'province_agent' => 0, 'city_agent' => 0, 'district_agent' => 0],
        ];

        return compact('start', 'end', 'rows');
    }
}
