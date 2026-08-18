<?php
$base = 'http://127.0.0.1:8787/admin';
function post($url, $fields, $token='', $isFile=false){
    $ch = curl_init($url);
    $headers = [];
    if($token) $headers[] = 'X-Admin-Token: '.$token;
    if(!$isFile){ $headers[]='Content-Type: application/json'; $body=json_encode($fields); }
    else { $body=$fields; }
    curl_setopt_array($ch, [
        CURLOPT_POST=>true, CURLOPT_HTTPHEADER=>$headers, CURLOPT_POSTFIELDS=>$body,
        CURLOPT_RETURNTRANSFER=>true, CURLOPT_TIMEOUT=>20,
    ]);
    $r = curl_exec($ch); $code=curl_getinfo($ch,CURLINFO_HTTP_CODE); curl_close($ch);
    return [$code, json_decode($r,true)];
}
function get($url,$token){
    $ch=curl_init($url); curl_setopt_array($ch,[CURLOPT_HTTPHEADER=>['X-Admin-Token: '.$token],CURLOPT_RETURNTRANSFER=>true]);
    $r=curl_exec($ch); curl_close($ch); return json_decode($r,true);
}

// 1. login
list($c,$d)=post($base.'/login',['username'=>'admin','password'=>'admin123']);
echo "login: code=$c ok=".($d['code']??'?')." msg=".($d['msg']??'')."\n";
$token=$d['data']['token'] ?? '';
if(!$token){ echo "NO TOKEN, abort\n"; exit; }

// 2. make a tiny png
$png = tempnam(sys_get_temp_dir(),'img').'.png';
file_put_contents($png, base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M8AAAMBAQDJ/pLvAAAAAElFTkSuQmCC'));
$mp4 = tempnam(sys_get_temp_dir(),'vid').'.mp4';
file_put_contents($mp4, 'dummy-video-content');

// 3. upload image
$cf = new CURLFile($png,'image/png','banner.png');
list($c,$d)=post($base.'/upload/banner_image',['file'=>$cf],$token,true);
echo "upload banner_image: code=$c code=".($d['code']??'?')." url=".($d['data']['url']??$d['msg']??'')."\n";
$imgUrl=$d['data']['url'] ?? '';

// 4. upload video
$cf2 = new CURLFile($mp4,'video/mp4','banner.mp4');
list($c,$d)=post($base.'/upload/video',['file'=>$cf2],$token,true);
echo "upload video: code=$c code=".($d['code']??'?')." url=".($d['data']['url']??$d['msg']??'')."\n";

// 5. save design with image-item (uploaded) + video-item (url)
$cfg = ['page'=>'home','components'=>[
  ['type'=>'banner','props'=>['interval'=>5,'items'=>[
    ['type'=>'image','image'=>$imgUrl,'video'=>'','link'=>['type'=>'goods','id'=>1]],
    ['type'=>'video','image'=>'','video'=>'https://example.com/s.mp4','link'=>['type'=>'category','id'=>2]],
  ]]],
]];
list($c,$d)=post($base.'/design/home/save',['config'=>$cfg,'remark'=>'e2e'],$token);
echo "design save: code=$c msg=".($d['msg']??'')."\n";
list($c,$d)=post($base.'/design/home/publish',[],$token);
echo "design publish: code=$c msg=".($d['msg']??'')."\n";

// 6. read back
$r=get('http://127.0.0.1:8787/admin/design/home',$token);
$banner = null;
foreach(($r['data']['published_config']['components']??[]) as $comp){
  if($comp['type']==='banner') $banner=$comp;
}
echo "read back items: ".json_encode($banner['props']['items']??'NONE',JSON_UNESCAPED_SLASHES)."\n";

unlink($png); unlink($mp4);
echo "E2E DONE\n";
