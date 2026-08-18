<?php
require __DIR__.'/vendor/autoload.php';
$app = new \think\App();
$app->initialize();
$svc = new \app\service\PageService();
$def = $svc->defaultHome(); // {page, components}

function post($url,$fields,$token=''){
    $ch=curl_init($url);
    curl_setopt_array($ch,[CURLOPT_POST=>true,CURLOPT_HTTPHEADER=>['X-Admin-Token: '.$token,'Content-Type: application/json'],CURLOPT_POSTFIELDS=>json_encode($fields),CURLOPT_RETURNTRANSFER=>true]);
    $r=curl_exec($ch);return json_decode($r,true);
}
$base='http://127.0.0.1:8787/admin';
$d=post($base.'/login',['username'=>'admin','password'=>'admin123']);
$token=$d['data']['token']??'';
$r=post($base.'/design/home/save',['config'=>$def,'remark'=>'reset-default'],$token);
echo "save: ".($r['msg']??'?')."\n";
$r=post($base.'/design/home/publish',[],$token);
echo "publish: ".($r['msg']??'?')."\n";
echo "RESET DONE\n";
