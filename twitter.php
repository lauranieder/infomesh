<html>
<head>
  <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
  <style>
  div.tweet {
    transform: translate(-50%, -50%);
    position: absolute;
    top: 50%;
    left: 50%;
            }
  </style>
</head>
<body>
<div class="tweet">
  <?php
    header("Access-Control-Allow-Origin: *");
    $url = "https://publish.twitter.com/oembed?url=".$_GET["url"];
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
    $data = json_decode(curl_exec($ch));
    curl_close($ch);
    echo $data->html;
    //  curl 'https%3A%2F%2Ftwitter.com%2FInterior%2Fstatus%2F507185938620219395'
  ?>
</div>
</body>
</html>