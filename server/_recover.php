<?php
$p=popen("git show -s --format=%B 7e6b184127b61ec4f49437febc819e0d1a0c2824","rb");
$msg=rtrim(stream_get_contents($p),"\n"); pclose($p);
$tmp=@mb_convert_encoding($msg,'GBK','UTF-8'); // mojibake(UTF-8) -> GBK bytes
$fixed=@mb_convert_encoding($tmp,'UTF-8','GBK'); // GBK bytes -> 原中文
echo "RECOVERED:\n".$fixed."\n";
