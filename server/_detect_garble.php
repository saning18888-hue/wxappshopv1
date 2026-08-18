<?php
function cjkRatio($s){
    $tot=mb_strlen($s,'UTF-8'); if(!$tot)return 0;
    $cjk=0;
    for($i=0;$i<$tot;$i++){ $cp=uniord(mb_substr($s,$i,1,'UTF-8')); if($cp>=0x4E00&&$cp<=0x9FFF)$cjk++; }
    return $cjk/$tot;
}
function uniord($c){return hexdec(bin2hex(mb_convert_encoding($c,'UTF-32BE','UTF-8')));}
function rawMsg($h){
    $p=popen("git show -s --format=%B ".escapeshellarg($h),"rb");
    $m=stream_get_contents($p); pclose($p);
    return rtrim($m,"\n");
}
$hashes=[]; exec('git rev-list --all',$hashes);
foreach($hashes as $h){
    $msg=rawMsg($h);
    $g1=@iconv('GBK','UTF-8//IGNORE',$msg);
    $g2='';
    if(mb_check_encoding($msg,'UTF-8')){ $mid=@iconv('UTF-8','GBK//IGNORE',$msg); if($mid!==false&&$mid!=='') $g2=@iconv('GBK','UTF-8//IGNORE',$mid); }
    $best=$msg; $tag='';
    if($g1!==$msg && cjkRatio($g1)>cjkRatio($msg)){ $best=$g1; $tag='GBK'; }
    if($g2!==$msg && $g2!=='' && cjkRatio($g2)>cjkRatio($best)){ $best=$g2; $tag='DBL'; }
    if($tag){ echo "GARBLE[$tag] $h | ".str_replace("\n"," / ",$best)."\n"; }
}
echo "DONE\n";
