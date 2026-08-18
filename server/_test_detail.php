<?php
require __DIR__ . '/vendor/autoload.php';
$app = new think\App();
$app->initialize();
use app\service\GoodsService;
$svc = new GoodsService();
$d = $svc->adminDetail(1);
echo json_encode($d, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
