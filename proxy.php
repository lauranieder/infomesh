<?php
    header("Access-Control-Allow-Origin: *");
    echo "<code>";
    echo get_page($_GET['url']);
    echo "</code>";
    //echo get_page("http://www.google.com");
    function get_page($url){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$url);
        /*
        $proxy = 'http://proxy.company.com:8080';
        $proxyauth = 'domain\proxy_username:proxy_password';
        curl_setopt($ch, CURLOPT_PROXY, $proxy);
        curl_setopt($ch, CURLOPT_PROXYUSERPWD, $proxyauth);
        */
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        $data = curl_exec($ch);
        curl_close($ch);
        $base = preg_replace('#\/[^/]*$#', '', $url);
        $data = preg_replace('~(?:src|action|href)=[\'"]\K/(?!/)[^\'"]*~',"$base$0",$data);

        return $data;
        //return preg_replace("href\\s*=\\s*(?:[\"'](?<1>[^\"']*)[\"']|(?<1>\\S+))", "&lt;", $data);
    }
?>
