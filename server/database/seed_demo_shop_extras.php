<?php
/**
 * 演示数据填充：为「商品设置」五个开关补充真实展示数据。
 * - goods 增加 promotion（商品促销语）列并填充
 * - goods_attrs + goods_attr_rel（商品属性）
 * - goods_reviews（商品评论）
 * 幂等：已存在的数据不会重复写入，可多次运行。
 *
 * 用法：php server/database/seed_demo_shop_extras.php
 */
$dbFile = __DIR__ . '/wxappb2c.sqlite';
if (!file_exists($dbFile)) {
    fwrite(STDERR, "数据库不存在: $dbFile\n");
    exit(1);
}
$pdo = new PDO('sqlite:' . $dbFile);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->exec('PRAGMA foreign_keys = OFF;');

// 1) goods 增加 promotion 列
$cols = array_column($pdo->query("PRAGMA table_info(goods)")->fetchAll(PDO::FETCH_ASSOC), 'name');
if (!in_array('promotion', $cols, true)) {
    $pdo->exec("ALTER TABLE goods ADD COLUMN promotion VARCHAR(255) NOT NULL DEFAULT ''");
    echo "✓ 已为 goods 表添加 promotion 列\n";
} else {
    echo "• goods.promotion 列已存在，跳过\n";
}

// 演示数据定义
$demo = [
    1 => [
        'promotion' => '限时直降 ¥10｜下单立减，再送运费险',
        'attrs' => [
            ['name' => '产地', 'values' => ['云南高原直采']],
            ['name' => '规格', 'values' => ['5斤装', '10斤装']],
            ['name' => '保质期', 'values' => ['常温 15 天']],
            ['name' => '储存方式', 'values' => ['阴凉通风处，避免暴晒']],
            ['name' => '发货时效', 'values' => ['48 小时内发货']],
        ],
        'reviews' => [
            ['user_name' => '橙粉小姐姐', 'rating' => 5, 'content' => '橘子很甜，皮薄好剥，孩子一口气吃了三个！', 'reply' => '感谢支持，产地直发更新鲜~'],
            ['user_name' => '李**', 'rating' => 4, 'content' => '整体不错，有一两个稍微青了点，放两天就甜了。', 'reply' => ''],
            ['user_name' => '果果妈', 'rating' => 5, 'content' => '包装很扎实，没有磕碰，回购了！', 'reply' => ''],
        ],
    ],
    2 => [
        'promotion' => '树熟现摘｜坏果包赔，顺丰冷链直达',
        'attrs' => [
            ['name' => '产地', 'values' => ['泰国进口']],
            ['name' => '品种', 'values' => ['金枕榴莲']],
            ['name' => '净重', 'values' => ['3斤±0.2']],
            ['name' => '储存方式', 'values' => ['冷藏保鲜']],
            ['name' => '食用方式', 'values' => ['开壳即食']],
        ],
        'reviews' => [
            ['user_name' => '榴莲控', 'rating' => 5, 'content' => '肉厚核小，软糯香甜，比超市新鲜！', 'reply' => ''],
            ['user_name' => '王**', 'rating' => 4, 'content' => '有一个开口的，客服很快补发了，服务不错。', 'reply' => '已为您安排补发，抱歉体验不佳。'],
        ],
    ],
    3 => [
        'promotion' => '买 2 件送 1 件｜独立小包，随身健康',
        'attrs' => [
            ['name' => '品牌', 'values' => ['优选']],
            ['name' => '净含量', 'values' => ['30包/盒']],
            ['name' => '保质期', 'values' => ['180 天']],
            ['name' => '产地', 'values' => ['安徽']],
            ['name' => '配料', 'values' => ['巴旦木/腰果/蔓越莓等混合果仁']],
        ],
        'reviews' => [
            ['user_name' => '养生达人', 'rating' => 5, 'content' => '每天一包，营养又方便，办公零食首选。', 'reply' => ''],
            ['user_name' => '张**', 'rating' => 5, 'content' => '日期新鲜，坚果很脆，没有哈喇味。', 'reply' => '感谢，品质把控严格~'],
            ['user_name' => '宝妈', 'rating' => 4, 'content' => '孩子爱吃，就是蜂蜜黄油的稍微有点甜。', 'reply' => ''],
        ],
    ],
    4 => [
        'promotion' => '内蒙古草饲｜高蛋白低脂，第二件半价',
        'attrs' => [
            ['name' => '产地', 'values' => ['内蒙古']],
            ['name' => '净含量', 'values' => ['200g/袋']],
            ['name' => '保质期', 'values' => ['12 个月']],
            ['name' => '口味', 'values' => ['原味']],
            ['name' => '储存方式', 'values' => ['阴凉干燥处']],
        ],
        'reviews' => [
            ['user_name' => '健身党', 'rating' => 5, 'content' => '肉质紧实，很有嚼劲，健身加餐很合适。', 'reply' => ''],
            ['user_name' => '赵**', 'rating' => 4, 'content' => '味道不错，就是有点干，配点水更好。', 'reply' => ''],
        ],
    ],
];

$countPromo = 0;
$countAttr = 0;
$countReview = 0;

foreach ($demo as $gid => $d) {
    // 商品需存在
    $g = $pdo->query("SELECT id,promotion FROM goods WHERE id=$gid")->fetch(PDO::FETCH_ASSOC);
    if (!$g) {
        echo "• 跳过商品 #$gid（不存在）\n";
        continue;
    }

    // 促销语
    if (empty($g['promotion'])) {
        $pdo->prepare("UPDATE goods SET promotion=? WHERE id=?")
            ->execute([$d['promotion'], $gid]);
        $countPromo++;
        echo "✓ 商品 #$gid 已写入促销语\n";
    } else {
        echo "• 商品 #$gid 已有促销语，跳过\n";
    }

    // 商品属性（直接写入 goods_attrs，按 goods_id 关联）
    $attrExists = $pdo->query("SELECT COUNT(*) FROM goods_attrs WHERE goods_id=$gid")->fetchColumn();
    if (!$attrExists) {
        $sort = 0;
        foreach ($d['attrs'] as $a) {
            $pdo->prepare("INSERT INTO goods_attrs (goods_id, name, attr_values, used, sort, created_at) VALUES (?,?,?,0,?,?)")
                ->execute([
                    $gid, $a['name'], json_encode($a['values'], JSON_UNESCAPED_UNICODE),
                    $sort, date('Y-m-d H:i:s'),
                ]);
            $sort++;
            $countAttr++;
        }
        echo "✓ 商品 #$gid 已写入 " . count($d['attrs']) . " 条属性\n";
    } else {
        echo "• 商品 #$gid 已有属性，跳过\n";
    }

    // 商品评论
    $revExists = $pdo->query("SELECT COUNT(*) FROM goods_reviews WHERE goods_id=$gid")->fetchColumn();
    if (!$revExists) {
        foreach ($d['reviews'] as $r) {
            $pdo->prepare("INSERT INTO goods_reviews (goods_id, user_id, user_name, avatar, rating, content, images, reply, is_hidden, created_at) VALUES (?,0,?,?,?,?,?,?,0,?)")
                ->execute([
                    $gid, $r['user_name'], '', $r['rating'], $r['content'],
                    json_encode([], JSON_UNESCAPED_UNICODE), $r['reply'],
                    date('Y-m-d H:i:s', time() - rand(0, 20) * 86400),
                ]);
            $countReview++;
        }
        echo "✓ 商品 #$gid 已写入 " . count($d['reviews']) . " 条评论\n";
    } else {
        echo "• 商品 #$gid 已有评论，跳过\n";
    }
}

echo "\n完成：促销语 $countPromo 条 / 属性 $countAttr 条 / 评论 $countReview 条\n";
