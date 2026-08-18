<?php
/**
 * v0.1.27+ 网站分析：补 page_views / visitor_sessions 表并填充演示数据
 * 幂等：可重复执行
 * 用法：cd server && php database/apply_stats_page_views.php
 */
require __DIR__ . '/../vendor/autoload.php';

$app = new \think\App(__DIR__ . '/../');
$app->initialize();

use think\facade\Db;

$driver = env('DB_DRIVER', 'sqlite');
if ($driver !== 'sqlite') {
    echo "Current driver is not sqlite, skip.\n";
    exit(0);
}

try {
    Db::execute("CREATE TABLE IF NOT EXISTS page_views (
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id   TEXT NOT NULL DEFAULT '',
        user_id      INTEGER NOT NULL DEFAULT 0,
        page         TEXT NOT NULL DEFAULT '',
        ip           TEXT NOT NULL DEFAULT '',
        stay_time    INTEGER NOT NULL DEFAULT 0,
        is_bounce    INTEGER NOT NULL DEFAULT 0,
        created_at   TEXT DEFAULT CURRENT_TIMESTAMP
    )");
    Db::execute("CREATE INDEX IF NOT EXISTS idx_pv_session ON page_views(session_id)");
    Db::execute("CREATE INDEX IF NOT EXISTS idx_pv_page ON page_views(page)");
    Db::execute("CREATE INDEX IF NOT EXISTS idx_pv_created ON page_views(created_at)");

    Db::execute("CREATE TABLE IF NOT EXISTS visitor_sessions (
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id   TEXT NOT NULL DEFAULT '',
        user_id      INTEGER NOT NULL DEFAULT 0,
        ip           TEXT NOT NULL DEFAULT '',
        is_new       INTEGER NOT NULL DEFAULT 1,
        page_count   INTEGER NOT NULL DEFAULT 0,
        created_at   TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (session_id)
    )");
    Db::execute("CREATE INDEX IF NOT EXISTS idx_vs_session ON visitor_sessions(session_id)");
    Db::execute("CREATE INDEX IF NOT EXISTS idx_vs_created ON visitor_sessions(created_at)");

    // 演示数据：仅在没有数据时填充最近 7 天
    $cnt = Db::table('page_views')->count();
    if ($cnt == 0) {
        $pages = ['首页','商品分类','商品详情','购物车','确认订单','收货地址','我的订单','物流信息','搜索','酒速达啤酒配送'];
        $ips = ['192.168.1.'.rand(2,254), '10.0.0.'.rand(2,254), '172.16.0.'.rand(2,254)];
        $rowsPv = [];
        $rowsVs = [];
        for ($d = 6; $d >= 0; $d--) {
            $dayStart = strtotime("-$d day", strtotime(date('Y-m-d 00:00:00')));
            $count = rand(30, 80);
            for ($i = 0; $i < $count; $i++) {
                $sid = 'sess_' . md5(uniqid() . $d . $i);
                $isNew = rand(0, 100) < 40 ? 1 : 0;
                $pageCount = rand(1, 6);
                $ip = $ips[array_rand($ips)];
                $ts = $dayStart + rand(0, 86399);
                $rowsVs[] = [
                    'session_id' => $sid,
                    'user_id'    => rand(1, 20),
                    'ip'         => $ip,
                    'is_new'     => $isNew,
                    'page_count' => $pageCount,
                    'created_at' => date('Y-m-d H:i:s', $ts),
                ];
                for ($p = 0; $p < $pageCount; $p++) {
                    $rowsPv[] = [
                        'session_id' => $sid,
                        'user_id'    => rand(1, 20),
                        'page'       => $pages[array_rand($pages)],
                        'ip'         => $ip,
                        'stay_time'  => rand(3, 180),
                        'is_bounce'  => $pageCount == 1 ? 1 : 0,
                        'created_at' => date('Y-m-d H:i:s', $ts + $p * rand(10, 60)),
                    ];
                }
            }
        }
        foreach (array_chunk($rowsVs, 200) as $chunk) {
            Db::table('visitor_sessions')->insertAll($chunk);
        }
        foreach (array_chunk($rowsPv, 200) as $chunk) {
            Db::table('page_views')->insertAll($chunk);
        }
        echo "初始化演示流量数据完成：page_views=" . count($rowsPv) . ", visitor_sessions=" . count($rowsVs) . "\n";
    }

    echo "stats_page_views migration done.\n";
} catch (\Throwable $e) {
    echo "ERR: " . $e->getMessage() . "\n";
    exit(1);
}
