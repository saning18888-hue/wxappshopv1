<?php
function dump($h){
    $p=popen("git show -s --format=%B ".escapeshellarg($h),"rb");
    $m=stream_get_contents($p); pclose($p);
    $m=rtrim($m,"\n");
    $firstLine=strtok($m,"\n");
    $hex=bin2hex(substr($m,0,12));
    echo "$h\n  hex=".$hex."\n  line=".$firstLine."\n";
}
foreach(['88193f482d577ff483de168cbb9bdf7ccff821aa','7e6b184127b61ec4f49437febc819e0d1a0c2824','70eacd50354a29f0a54d649dd02b185dc8e39bfa','5b8416b692081330c394955a91f6398a80d5333c'] as $h) dump($h);
