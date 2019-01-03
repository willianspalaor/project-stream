<?php
require __DIR__ . '/vendor/autoload.php';

function getClient()
{
    $client = new Google_Client();
    $client->setApplicationName('Google Drive API PHP Quickstart');
    $client->setScopes([Google_Service_Drive::DRIVE_METADATA_READONLY, Google_Service_Drive::DRIVE_FILE, Google_Service_Drive::DRIVE, Google_Service_Drive::DRIVE_APPDATA]);
    $client->setAuthConfig('credentials.json');
    $client->setAccessType('offline');
    $client->setPrompt('select_account consent');

    // Load previously authorized token from a file, if it exists.
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first
    // time.
    $tokenPath = 'token.json';
    if (file_exists($tokenPath)) {
        $accessToken = json_decode(file_get_contents($tokenPath), true);
        $client->setAccessToken($accessToken);
    }

    // If there is no previous token or it's expired.
    if ($client->isAccessTokenExpired()) {
        // Refresh the token if possible, else fetch a new one.
        if ($client->getRefreshToken()) {
            $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
        } else {
            // Request authorization from the user.
            $authUrl = $client->createAuthUrl();
            printf("Open the following link in your browser:\n%s\n", $authUrl);
            print 'Enter verification code: ';
            $authCode = trim(fgets(STDIN));

            // Exchange authorization code for an access token.
            $accessToken = $client->fetchAccessTokenWithAuthCode($authCode);
            $client->setAccessToken($accessToken);

            // Check to see if there was an error.
            if (array_key_exists('error', $accessToken)) {
                throw new Exception(join(', ', $accessToken));
            }
        }
        // Save the token to a file.
        if (!file_exists(dirname($tokenPath))) {
            mkdir(dirname($tokenPath), 0700, true);
        }
        file_put_contents($tokenPath, json_encode($client->getAccessToken()));
    }
    return $client;
}

function getService(){
    $client = getClient();
    $service = new Google_Service_Drive($client);
    return $service;
}

function getFile2(){
    $service = getService();
    $fileId = '17YhGjInSMqeYuNc34S5tdGZ3EVUfW0g2';
    $file = $service->files->get($fileId);
    $content = $service->files->get($fileId, array("alt" => "media"));
    return $content;
}

function getFile3(){

    $service = getService();

    $optParams = [
        'q' => "mimeType='video/mp4'",
        'pageSize' => 10,
        'fields' => 'nextPageToken, files(id, name, webViewLink)'
    ];

    $files = $service->files->listFiles($optParams);

    foreach($files->files as $file){
        // Now I need to make a little detail about the next lines of code so look at [Info]
        $src = str_replace('/view', '/preview', $file->webViewLink);
        echo '<iframe width="500" height="200" target="_parent" src="'. $src .'"></iframe>';
    }

}


function getFile5(){
    $fileId = '1cOdl-eacCaKBwSaQOKRQquRGOJahmsrN';
    $service = getService();
    $file = $service->files->get($fileId, array('fields' => 'webViewLink'));
    $src = str_replace('/view', '/preview', $file->webViewLink);
    echo '<iframe width="500" height="200" target="_parent" src="'. $src .'"></iframe>';
}

function teste(){
    $fileId = '1cOdl-eacCaKBwSaQOKRQquRGOJahmsrN';
    $service = getService();
    $file = $service->files->get($fileId, array('fields' => 'webViewLink'));


    var_dump($service->files->generateIds());
 //   var_dump($file);

}

function getFile4($noReturn = false){


    /*$fileId = '1cOdl-eacCaKBwSaQOKRQquRGOJahmsrN';
    $service = getService();
    $file = $service->files->get($fileId, array('fields' => 'webViewLink'));
    $src = str_replace('/view', '/preview', $file->webViewLink);
    echo '<iframe id="video-iframe" width="500" height="200" target="_parent" src="'. $src .'"></iframe>';*/

    $data = file_get_contents('http://127.0.0.1/anime/getVideoAnime?view=true');

    $dom = new DOMDocument();
    $dom->loadHTML($data);
    $dom->preserveWhiteSpace = false;

    //var_dump($dom);
    var_dump($dom->getElementById('teste'));


    //$dom->validateOnParse = true;
   // $dom->load($data);

    //$html_encoded = htmlentities($data);
    //echo $html_encoded;


  //  $teste = file_get_contents('http://127.0.0.1/anime/getVideoAnime');
    die();
   /* $dom = new DOMDocument();

    $dom->validateOnParse = true;
    $dom->load(file_get_contents('http://127.0.0.1/anime/getVideoAnime'));

    var_dump($dom);
    var_dump($dom->getElementById('video-iframe') ); die();
   /* $dom->loadHTMLFile('index.phtml');
    $data = $dom->getElementById("video-iframe");
    echo $data->nodeValue;
    echo $dom->saveHTML();*/


    /* $dom = new DOMDocument();
     $dom->load("http://project-stream.localhost/anime/getVideoAnime");


     var_dump($dom);

    // $page = file_get_contents($_SERVER['REQUEST_URI']);
     //var_dump($page);
     //return $file->getWebViewLink();

    // return $file;



   /*  $src = str_replace('/view', '/preview', $file->webViewLink);
     echo '<iframe width="500" height="200" target="_parent" src="'. $src .'"></iframe>';*/

   // return 'teste';
    //$file = $service->files->get($fileId, array('fields' => 'webViewLink'));
   // $src = str_replace('/view', '/preview', $file->webViewLink);
    //return $file;
    //return '<iframe width="500" height="200" target="_parent" src="'. $src .'"></iframe>';
   // echo '<iframe width="500" height="200" target="_parent" src="'. $src .'"></iframe>';
}


function getFile(){

    $service = getService();

    //$fileId = '1h5_EMOrJUGaoZA743YNHo4vL8Q9mtxUx';
    //$fileId = '1fNGGs-LNjn4togEkrtjT00V94ynBamBe';
   // $fileId = '1OVN78tSyrGy09_rnw-ogNGG3O3o4Dro8';
    $fileId = '1XbEQJOC9fovrwYgOO90-lcQMsa1Alpr8';
    //return $service->files->get($fileId,array("fields"=>"shared"));

    $optParams = [
        'fields' => 'files(id, name, webViewLink)'
    ];


    $file = $service->files->get($fileId, $optParams);
    return $file;

    //var_dump($file->getWebContentLink());


    //$content = $service->files->get($fileId, array('alt' => 'media' ));
   // return $service->files->get($fileId,array("fields"=>"writersCanShare"));

    /*$content = $service->files->get($fileId, array("alt" => "media"));


    $outHandle = fopen("teste.mp4", "w+");

    while (!$content->getBody()->eof()) {
        fwrite($outHandle, $content->getBody()->read(1024));
    }
    fclose($outHandle);*/


}


function listFiles(){
    // Get the API client and construct the service object.
    $client = getClient();
    $service = new Google_Service_Drive($client);

// Print the names and IDs for up to 10 files.
    $optParams = array(
        'pageSize' => 10,
        'fields' => 'nextPageToken, files(id, name)'
    );
    $results = $service->files->listFiles($optParams);


    var_dump($results);
    die();


   /* if (count($results->getFiles()) == 0) {
        print "No files found.\n";
    } else {
        print "Files:\n";
        foreach ($results->getFiles() as $file) {
            printf("%s (%s)\n", $file->getName(), $file->getId());
        }
    }*/



}

