<?php
require __DIR__.'/vendor/autoload.php';
$app=new \think\App();$app->initialize();
$svc=new \app\service\PageService();
function post($url,$fields,$token=''){
  $ch=curl_init($url);
  $h=['Content-Type: application/json'];
  if($token)$h[]='X-Admin-Token: '.$token;
  curl_setopt_array($ch,[CURLOPT_POST=>true,CURLOPT_HTTPHEADER=>$h,CURLOPT_POSTFIELDS=>json_encode($fields),CURLOPT_RETURNTRANSFER=>true]);
  $r=curl_exec($ch);return json_decode($r,true);
}
function get($url,$token){$ch=curl_init($url);curl_setopt_array($ch,[CURLOPT_HTTPHEADER=>['X-Admin-Token: '.$token],CURLOPT_RETURNTRANSFER=>true]);return json_decode(curl_exec($ch),true);}
$base='http://127.0.0.1:8787/admin';
$d=post($base.'/login',['username'=>'admin','password'=>'admin123']);
$token=$d['data']['token']??'';
echo "login: ".($d['msg']??'?')."\n";

$png=tempnam(sys_get_temp_dir(),'ic').'.png';
file_put_contents($png,base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M8AAAMBAQDJ/pLvAAAAAElFTkSuQmCC'));
$cf=new CURLFile($png,'image/png','ic.png');
$ch=curl_init($base.'/upload/banner_image');curl_setopt_array($ch,[CURLOPT_POST=>true,CURLOPT_HTTPHEADER=>['X-Admin-Token: '.$token],CURLOPT_POSTFIELDS=>['file'=>$cf],CURLOPT_RETURNTRANSFER=>true]);
$up=json_decode(curl_exec($ch),true);
echo "upload icon: ".($up['data']['url']??$up['msg'])."\n";
$iconUrl=$up['data']['url']??'';

$cfg=['page'=>'home','components'=>[
  ['type'=>'nav_grid','props'=>['columns'=>4,'items'=>[
    ['icon'=>$iconUrl,'text'=>'测试入口','link'=>['type'=>'category','id'=>1]],
    ['icon'=>'https://example.com/x.png','text'=>'填地址','link'=>['type'=>'goods','id'=>2]],
  ]]],
]];
$r=post($base.'/design/home/save',['config'=>$cfg,'remark'=>'nav-e2e'],$token);
echo "nav save: ".($r['msg']??'?')."\n";
$r=post($base.'/design/home/publish',[],$token);
echo "nav publish: ".($r['msg']??'?')."\n";
$nav=null;
$g=get($base.'/design/home',$token);
foreach(($g['data']['published_config']['components']??[]) as $c){if($c['type']==='nav_grid')$nav=$c;}
echo "nav readback: ".json_encode($nav['props']['items']??'NONE',JSON_UNESCAPED_SLASHES)."\n";

// reset to default
$def=$svc->defaultHome();
post($base.'/design/home/save',['config'=>$def,'remark'=>'reset'],$token);
post($base.'/design/home/publish',[],$token);
echo "RESET DONE\n";
unlink($png);
