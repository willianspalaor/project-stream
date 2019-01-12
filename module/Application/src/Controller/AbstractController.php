<?php
/**
 * Created by PhpStorm.
 * User: Willian
 * Date: 01/12/2018
 * Time: 12:50
 */

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Application\Model\AnimeTable;
use Application\Model\Anime;
use Application\Model\SeasonTable;
use Application\Model\Season;
use Application\Model\EpisodeTable;
use Application\Model\Episode;
use Application\Model\VideoTable;

use Application\Model\ClientTable;
use Application\Model\Client;
use Application\Model\ClientAnimeTable;
use Application\Model\ClientAnime;
use Application\Model\ClientEpisodeTable;
use Application\Model\ClientEpisode;
use Application\Model\ClientListTable;
use Application\Model\ClientList;
use Application\Model\CategoryTable;
use Application\Model\AuthorTable;
use Application\Model\GenreTable;
use Application\Model\Category;
use Application\Model\EpisodeReportTable;
use Application\Model\EpisodeReport;
use Application\Utils\RemoteAddress;
use Zend\Mail;
use MatthiasMullie\Minify;

class AbstractController extends AbstractActionController
{
    public $animeTable;
    public $seasonTable;
    public $episodeTable;
    public $videoTable;
    public $clientTable;
    public $serviceManager;
    public $remoteAddress;
    public $clientAnimeTable;
    public $clientEpisodeTable;
    public $clientListTable;
    public $categoryTable;
    public $genreTable;
    public $authorTable;
    public $episodeReportTable;

    private $_client;

    public function __construct(AnimeTable $animeTable, SeasonTable $seasonTable, EpisodeTable $episodeTable,
                                VideoTable $videoTable, ClientTable $clientTable, ClientAnimeTable $clientAnimeTable,
                                ClientEpisodeTable $clientEpisodeTable, CategoryTable $categoryTable, ClientListTable $clientListTable,
                                EpisodeReportTable $episodeReportTable, GenreTable $genreTable, AuthorTable $authorTable)
    {
        $this->animeTable = $animeTable;
        $this->seasonTable = $seasonTable;
        $this->episodeTable = $episodeTable;
        $this->videoTable = $videoTable;
        $this->clientTable = $clientTable;
        $this->clientAnimeTable = $clientAnimeTable;
        $this->clientEpisodeTable = $clientEpisodeTable;
        $this->clientListTable = $clientListTable;
        $this->categoryTable = $categoryTable;
        $this->episodeReportTable = $episodeReportTable;
        $this->genreTable = $genreTable;
        $this->authorTable = $authorTable;

        $this->startSession();

        if(isset($_SESSION['user_email'])){
            $this->setClient($_SESSION['user_email']);
        }else{
            if(isset($_COOKIE['user_email'])){
                $this->setClient($_COOKIE['user_email']);
            }else{
                $this->setClient();
            }
        }
    }

    public function startSession(){

        if(!isset($_SESSION)){
            session_start();
        }
    }

    public function setClient($email = false){

        if($email){
            $this->_client = $this->getClient($email, true);
        }else{
            $this->_client = $this->getClient();
        }
    }

    public function getCurrentClient(){
        return $this->_client;
    }

    public function getClient($email = false, $new = false){

        if($email) {
            $client = $this->clientTable->getClient(null, null, $email);
        }else{

            $client = null;
            $ip = $this->getIp();

            if(!$new){
                $client = $this->clientTable->getClient(null, $ip);
            }

            if(!$client){
                $newClient = new Client();
                $newClient->ip_address = $ip;
                $id = $this->clientTable->saveClient($newClient);
                $client = $this->clientTable->getClient($id);
            }
        }

        return $client;
    }

    public function getAnime($track){

        return $this->animeTable->getAnime($track);

    }

    public function saveClientAnime($data = null, $anime = null){

        $id_client = $this->_client->id;

        if($data){

            $clientAnime = new ClientAnime();
            $data['id_client_anime'] = $data['id'];
            $clientAnime->exchangeArray($data);

        }else{

            $id_anime = $anime->id;
            $clientAnime = $this->clientAnimeTable->getClientAnimeByAnime($id_client, $id_anime);

            if(!$clientAnime){
                $clientAnime = new ClientAnime();
                $clientAnime->id_anime = $id_anime;
                $clientAnime->id_client = $id_client;
                $clientAnime->current_season = 1;
                $clientAnime->current_episode = 1;

            }
        }

        $this->clientAnimeTable->saveClientAnime($clientAnime);
        return $clientAnime;
    }

    public function saveClientEpisode($episode){

        $id_client = $this->_client->id;
        $id_episode = $episode['id'];
        $id_anime = $episode['id_anime'];
        $progress = $episode['progress'];

        $clientAnime = $this->clientAnimeTable->getClientAnimeByAnime($id_client, $id_anime);
        $clientEpisode = $this->clientEpisodeTable->getClientEpisodeByEpisode($clientAnime->id, $id_episode);

        if(!$clientEpisode){
            $clientEpisode = new ClientEpisode();
        }

        $clientEpisode->id_client_anime = $clientAnime->id;
        $clientEpisode->id_episode = $id_episode;
        $clientEpisode->progress = $progress;

        $this->clientEpisodeTable->saveClientEpisode($clientEpisode);

        return $clientEpisode;
    }


    function saveAnime($data){

        $anime = new Anime();
        $anime->exchangeArray($data);
        $this->animeTable->saveAnime($anime);

        return $anime->getArrayCopy();
    }

    function saveClientList($id_anime){

        $data = [
            'id_anime' =>$id_anime,
            'id_client'=> $this->getClient()->id
        ];

        $clientList = new ClientList();
        $clientList->exchangeArray($data);
        $this->clientListTable->saveClientList($clientList);

        return $clientList->getArrayCopy();
    }

    function saveEpisodeReport($id_anime, $id_episode){

        $data = [
            'id_episode' =>$id_episode,
            'id_anime'=> $id_anime
        ];

        $episodeReport = new EpisodeReport();
        $episodeReport->exchangeArray($data);
        $result = $this->episodeReportTable->getEpisodeReportByAnime($id_anime, $id_episode);

        if(empty($result)){
            $this->episodeReportTable->saveEpisodeReport($episodeReport);
        }

        return $episodeReport->getArrayCopy();
    }

    public function storeCache($data){

       // if (filemtime('cache.txt') < time()-1*3600) {
            file_put_contents($this->getIp() . '.txt', base64_encode(serialize($data)), FILE_APPEND);
        //}
    }

    public function getCache(){

        $content = file_get_contents($this->getIp() . '.txt');
        $lines = explode("=", $content); // this is your array of words

        $data = array();

        foreach($lines as $word) {
            $data[] = unserialize(base64_decode($word));
        }

        return $data;
    }

    function getIp() {

        if(!$this->remoteAddress)
            $this->remoteAddress = new RemoteAddress();

        //return "191.242.50.78";
        return $this->remoteAddress->getIpAddress();
    }

    public function prepareAnimeData($anime, $seasons)
    {
        $id_anime = $anime->id;
        $id_client = $this->_client->id;

        $clientAnime = $this->clientAnimeTable->getClientAnimeByAnime($id_client, $id_anime);
        $anime->client_anime = $clientAnime;

        $anime->seasons = (object) [];
        $aSeasons = $anime->seasons;

        foreach($seasons as $key => $season){

            $episodes = $this->episodeTable->getEpisodesBySeason($season->id);

            $name = 'season ' . ($key+1);
            $aSeasons->$name = $season;

            $season->episodes = (object) [];
            $sEpisodes = $season->episodes;

            foreach($episodes as $k => $episode){

                $clientEpisode = $this->clientEpisodeTable->getClientEpisodeByEpisode($clientAnime->id, $episode->id);

                if($clientEpisode){
                    $episode->progress = (int)$clientEpisode->progress;
                }else{
                    $episode->progress = 0;
                }

                $videos = $this->videoTable->getVideosByEpisode($episode->id);

                $episode->videos = (object)[];
                $eVideos = $episode->videos;

                foreach($videos as $i => $video){
                    $name = 'video ' . ($i+1);
                    $eVideos->$name = $video;
                }

                $name = 'episode ' . ($k+1);
                $sEpisodes->$name = $episode;
            }
        }

        return $anime;
    }

    public function prepareJsonData($array, $name){

        $data = (object)[];

        foreach($array as $key => $value){

            $index =  $name . ($key + 1);
            $data->$index = $value;
        }

        return $data;
    }

    public function prepareClientData($anime)
    {
        $id_anime = $anime->id;
        $id_client = $this->_client->id;
        $clientAnime = $this->clientAnimeTable->getClientAnimeByAnime($id_client, $id_anime);
        $episodes = $this->clientEpisodeTable->getClientEpisodesByAnime($clientAnime->id);

        $preparedEpisodes = (object) [];
        foreach($episodes as $key => $value){

            $name = 'episode ' . ($key+1);
            $preparedEpisodes->$name = $value;
        }

        return $preparedEpisodes;
    }

    public function authenticate($email, $pass){

        $auth = $this->clientTable->authenticate($email, $pass);

        if(!isset($_SESSION)){
            session_start();
        }

        if($auth){
            $_SESSION['user_email'] = $email;
            $_SESSION['user_authenticate']= true;
            setcookie("user_authenticate",'true', time() + (10 * 365 * 24 * 60 * 60));
            setcookie("user_email",$email, time() + (10 * 365 * 24 * 60 * 60));

            return true;
        }else{

            $client = $this->getClient($email);

            if($client){
                return false;
            }

            $client = $this->getClient(false, false);
            $client->user_email = $email;
            $client->user_pass = $pass;
            $this->clientTable->saveClient($client);

            $_SESSION['user_email'] = $email;
            $_SESSION['user_authenticate']= true;
            setcookie("user_authenticate",'true', time() + (10 * 365 * 24 * 60 * 60));
            setcookie("user_email",$email, time() + (10 * 365 * 24 * 60 * 60));
            return true;
        }
    }

    public function logoutClient()
    {
        session_unset();
        session_destroy();
        unset($_COOKIE["user_email"]);
        unset($_COOKIE["user_authenticate"]);
        setcookie("user_authenticate", 'false', 1);
        setcookie("user_email", "", 1);

        return true;
    }

    public function isAuthenticate()
    {
        if(isset($_COOKIE["user_authenticate"]) && isset($_COOKIE['user_email'])){

            if($_COOKIE['user_authenticate'] === 'true'){

                    $client = $this->clientTable->getClient(null, null, $_COOKIE['user_email']);

                    if(!$client || empty($client)){
                        return false;
                    }

                    return true;

            }else{
                return false;
            }
        }

        if(!isset($_SESSION)){
            session_start();
        }

        if(!isset($_SESSION['user_email'])){
            return false;
        }

        $client = $this->clientTable->getClient(null, null, $_SESSION['user_email']);
        if(!$client || empty($client)){
            return false;
        }
    }

    public function sendMail($email){

        $client = $this->clientTable->getClient(null, null, $email);

        if($client){

         /*   $mail = new Mail\Message();
            $mail->setBody('This is the text of the email.');
            $mail->setFrom($email, "Sender's name");
           // $mail->addTo($email, 'Name of recipient');
            $mail->setSubject('TestSubject');

            $transport = new Mail\Transport\Sendmail();
            $transport->send($mail);*/


            $mail = new Mail\Message();
            $mail->setBody('This is the text of the email.');
            $mail->setFrom('willianspalaor@gmail.com', 'Setfrom');
            $mail->addTo('willianspalaor@gmail.com', 'Addto');
            $mail->setSubject('TestSubject');

            $transport = new Mail\Transport\Sendmail();
            $transport->send($mail);

        }else{
            return false;
        }

        return true;
    }

    public function minifyCSS(){

        $files = ['style', 'admin', 'index', 'jquery-ui-base', 'mobile', 'login-home', 'login-loader', 'player', 'mobile'];

        foreach($files as $key => $value){
            $sourcePath = $_SERVER['DOCUMENT_ROOT'] . '/css/' . $value . '.css';
            $minifierCSS = new Minify\JS($sourcePath);
            $minifiedPath = $_SERVER['DOCUMENT_ROOT'] . '/css/' . $value . '.min.css';
            $minifierCSS->minify($minifiedPath);
        }
    }

    public function minifyJS(){

        $allFiles = [
            1 => ['Player' => 'Player', 'Index' => 'App'],
            2 => ['Player/xhr' => 'Anime', 'Player' => 'Helper'],
            3 => ['Index/xhr' => 'Anime', 'Index' => 'Helper']
        ];

        foreach($allFiles as $key => $files){

            foreach($files as $key => $value){
                $sourcePath = $_SERVER['DOCUMENT_ROOT'] . '/js/module/Application/' . $key . '/' . $value . '.js';
                $minifierJS = new Minify\JS($sourcePath);
                $minifiedPath = $_SERVER['DOCUMENT_ROOT'] . '/js/module/Application/' . $key . '/' . $value . '.min.js';
                $minifierJS->minify($minifiedPath);
            }
        }
    }






    public function minifyFiles()
    {

        /************************************ LAYOUT *************************************************/

        /* App CSS */
        $files = ['style.css', 'admin.css'];
        $minifierCSS = null;
        $first = true;

        foreach($files as $key => $value){
            $sourcePath = $_SERVER['DOCUMENT_ROOT'] . '/css/' . $value;

            if($first){
                $minifierCSS = new Minify\JS($sourcePath);
                $first = false;
            }else{
                $minifierCSS->add($sourcePath);
            }
        }

        $minifiedPath = $_SERVER['DOCUMENT_ROOT'] . '/css/app.min.css';
        $minifierCSS->minify($minifiedPath);


        /* App JS */
        $files = ['Index/App.js', 'Index/Player.js'];
        $minifierJS = null;
        $first = true;

        foreach($files as $key => $value){
            $sourcePath = $_SERVER['DOCUMENT_ROOT'] . '/js/module/Application/' . $value;

            if($first){
                $minifierJS = new Minify\JS($sourcePath);
                $first = false;
            }else{
                $minifierJS->add($sourcePath);
            }
        }

        $minifiedPath = $_SERVER['DOCUMENT_ROOT'] . '/js/module/Application/app.min.js';
        $minifierJS->minify($minifiedPath);

        /************************************ INDEX *************************************************/

        /* App CSS */
        $files = ['index.css', 'mobile.css', 'jquery-ui-base.css'];
        $minifierCSS = null;
        $first = true;

        foreach($files as $key => $value){
            $sourcePath = $_SERVER['DOCUMENT_ROOT'] . '/css/' . $value;

            if($first){
                $minifierCSS = new Minify\JS($sourcePath);
                $first = false;
            }else{
                $minifierCSS->add($sourcePath);
            }
        }

        $minifiedPath = $_SERVER['DOCUMENT_ROOT'] . '/css/index.min.css';
        $minifierCSS->minify($minifiedPath);

        /* Index JS */
        $files = ['Index/xhr/Anime.js', 'Index/Helper.js'];
        $minifierJS = null;
        $first = true;

        foreach($files as $key => $value){
            $sourcePath = $_SERVER['DOCUMENT_ROOT'] . '/js/module/Application/' . $value;

            if($first){
                $minifierJS = new Minify\JS($sourcePath);
                $first = false;
            }else{
                $minifierJS->add($sourcePath);
            }
        }

        $minifiedPath = $_SERVER['DOCUMENT_ROOT'] . '/js/module/Application/index.min.js';
        $minifierJS->minify($minifiedPath);

    }
}