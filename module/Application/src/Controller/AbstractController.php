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
use Application\Model\SeasonTable;
use Application\Model\EpisodeTable;
use Application\Model\VideoTable;
use Application\Model\ClientTable;
use Application\Model\Client;
use Application\Model\ClientAnimeTable;
use Application\Model\ClientAnime;
use Application\Model\ClientEpisodeTable;
use Application\Model\CategoryTable;
use Application\Model\ClientEpisode;
use Application\Utils\RemoteAddress;

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
    public $categoryTable;

    private $_client;

    public function __construct(AnimeTable $animeTable, SeasonTable $seasonTable, EpisodeTable $episodeTable,
                                VideoTable $videoTable, ClientTable $clientTable, ClientAnimeTable $clientAnimeTable,
                                ClientEpisodeTable $clientEpisodeTable, CategoryTable $categoryTable)
    {
        $this->animeTable = $animeTable;
        $this->seasonTable = $seasonTable;
        $this->episodeTable = $episodeTable;
        $this->videoTable = $videoTable;
        $this->clientTable = $clientTable;
        $this->clientAnimeTable = $clientAnimeTable;
        $this->clientEpisodeTable = $clientEpisodeTable;
        $this->categoryTable = $categoryTable;

        $this->setClient();
    }

    public function setClient($client = null){

        if(!$client)
            $this->_client = $this->getClient();
        else
            $this->_client = $client;
    }

    public function getCurrentClient(){
        return $this->_client;
    }

    public function getClient(){

        $ip = $this->getIp();
        $client = $this->clientTable->getClient(null, $ip);

        if(!$client){

            $newClient = new Client();
            $newClient->ip_address = $ip;
            $this->clientTable->saveClient($newClient);
            $client = $this->clientTable->getClient(null, $ip);
        }

        return $client;
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

        return "191.242.50.78";
      //  return $this->remoteAddress->getIpAddress();
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

}