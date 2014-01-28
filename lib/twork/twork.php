<?php
  // we're going to output JSON
  header('Content-type: application/json');
  session_start();

  // *** INIT ***

    // path to Twitter oauth library
    // IMPORTANT: this is a dependency required for twork t'work
    require_once("../twitteroauth/twitteroauth.php");

    // path to local cache file
    // IMPORTANT: this cache file should be writable by web server

    $twcache_path = ('cache/cache.json');
    // Twitter search query URL
    // NOTE: replace this with your own twitter url or search query
    //       (https://dev.twitter.com/docs/api/1.1)
    $twitter_query = "https://api.twitter.com/1.1/search/tweets.json?q=cforee";

    $twauth = array(
      'user'                    => 'twitteruser',
      'numtweets'               => 15,
      'consumerkey'             => 'TWITTERCONSUMERKYHERE',
      'consumersecret'          => 'CONSUMERSECRETFORYOURAPPSHOULDGOHERE000000',
      'accesstoken'             => 'ACCESSTOKENFORYOURTWITTERAPP0000000000000000000000',
      'accesstokensecret'       => 'ACCESSTOKENSECRETFORYOURTWITTERAPP00000000000'
    );

  // *** DEFINE FUNCTIONS ***

    function renderFeed($twcache_path) {
      $twitterfeed = file_get_contents($twcache_path);
      echo($twitterfeed);
    }

    function refreshCache($twauth, $twcache_path, $twurl) {
      $connection = getConnectionWithAccessToken($twauth['consumerkey'], $twauth['consumersecret'], $twauth['accesstoken'], $twauth['accesstokensecret']);
      $twitterfeed = $connection->get($twurl);
      $twitterfeed = json_encode($twitterfeed);
      file_put_contents($twcache_path, $twitterfeed);
    }

    function cacheExpired($twcache_path) {
      $filemtime = filemtime($twcache_path);
      $systime = time();
      $expirytime = $filemtime + 3600;
      if ($systime > $expirytime) {
        return true;
      } else {
        return false;
      }
    }

    function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
      $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
      return $connection;
    }

  // *** DO WORK ***

    if (cacheExpired($twcache_path)) {
      refreshCache($twauth, $twcache_path, $twitter_query);
    }
    renderFeed($twcache_path);

?>
