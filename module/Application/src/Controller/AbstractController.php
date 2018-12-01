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
use Application\Utils\RemoteAddress;

class AbstractController extends AbstractActionController
{
    public $animeTable;
    public $seasonTable;
    public $episodeTable;
    public $videoTable;
    public $serviceManager;
    public $remoteAddress;

    const DEVELOPMENT = true;

    public function __construct(AnimeTable $animeTable, SeasonTable $seasonTable,
                                EpisodeTable $episodeTable, VideoTable $videoTable)
    {
        $this->animeTable = $animeTable;
        $this->seasonTable = $seasonTable;
        $this->episodeTable = $episodeTable;
        $this->videoTable = $videoTable;
        $this->remoteAddress = new RemoteAddress();
    }

    public function prepareData($anime, $seasons)
    {
        $anime->seasons = (object) [];
        $aSeasons = $anime->seasons;

        foreach($seasons as $key => $season){

            $episodes = $this->episodeTable->getEpisodesBySeason($season->id);

            $name = 'season ' . ($key+1);
            $aSeasons->$name = $season;

            $season->episodes = (object) [];
            $sEpisodes = $season->episodes;

            foreach($episodes as $k => $episode){

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


      return $this->remoteAddress->getIpAddress();

      //return $ip=$_SERVER['REMOTE_ADDR'];
    }

}