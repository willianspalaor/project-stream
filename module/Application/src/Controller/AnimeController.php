<?php

namespace Application\Controller;

//use Application\Model\Video;
//use Zend\View\Model\ViewModel;

use Admin\Model\Video;
use Application\Utils\VideoStream;

class AnimeController extends AbstractController
{

    public function getAnimeAction()
    {
        $id_md5 = $this->params()->fromQuery('trackId');
        $anime = $this->animeTable->getAnime($id_md5);
        die(json_encode(array('anime' => $anime)));
    }

    function curl_get_file_size( $url ) {
        // Assume failure.
        $result = -1;

        $curl = curl_init( $url );

        // Issue a HEAD request and follow any redirects.
        curl_setopt( $curl, CURLOPT_NOBODY, true );
        curl_setopt( $curl, CURLOPT_HEADER, true );
        curl_setopt( $curl, CURLOPT_RETURNTRANSFER, true );
        curl_setopt( $curl, CURLOPT_FOLLOWLOCATION, true );
        //curl_setopt( $curl, CURLOPT_USERAGENT, get_user_agent_string() );

        $data = curl_exec( $curl );
        curl_close( $curl );

        if( $data ) {
            $content_length = "unknown";
            $status = "unknown";

            if( preg_match( "/^HTTP\/1\.[01] (\d\d\d)/", $data, $matches ) ) {
                $status = (int)$matches[1];
            }

            if( preg_match( "/Content-Length: (\d+)/", $data, $matches ) ) {
                $content_length = (int)$matches[1];
            }

            // http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
            if( $status == 200 || ($status > 300 && $status <= 308) ) {
                $result = $content_length;
            }
        }

        return $result;
    }


    public function getVideoAnimeAction()
    {


        $token = $this->params()->fromQuery('t');
        $position = strpos($token, ';');
        $video = substr($token, 0, $position);
        $date = substr($token, $position+1, strlen($token));


        $video =  base64_decode(urldecode($video));
        $date =  base64_decode(urldecode($date));

        $now = date('m/d/Y h:i:s a', time());
        $now = strtotime((string)$now);

        $now = (int)$now;
        $date = (int)$date;
        $diff = $date - $now;

        if($diff < 5000000){
            $headers = get_headers($video, 1);
            die($headers['Location'][1]);
        }

        die();
    }

    public function getPlayerAnimeAction(){
        $id_md5 = $this->params()->fromQuery('trackId');
        $anime = $this->animeTable->getAnime($id_md5);
        $this->saveClientAnime(null, $anime);
        $seasons = $this->seasonTable->getSeasonByAnime($anime->id);
        $data = $this->prepareAnimeData($anime, $seasons);

        die(json_encode(array('anime' => $data)));
    }

    public function getCurrentAnimesAction(){

        $client = $this->getCurrentClient();
        $animes = $this->animeTable->getCurrentAnimes($client->id);

        foreach($animes as $key => $value){
            $categories = $this->categoryTable->getCategoryByAnime($value['id']);
            $value['categories'] = $this->prepareJsonData($categories, 'category');
            $animes[$key] = $value;
        }

        $data = $this->prepareJsonData($animes, 'anime');

        die(json_encode(array('current_animes' => $data)));
    }


    public function getAnimesAction(){

        $params = $this->params()->fromPost();
        $paginator = $this->animeTable->fetchAll(true, $params);
        $paginator->setCurrentPageNumber(1);
        $paginator->setItemCountPerPage(25);
        $items = $this->prepareJsonData($paginator->getCurrentItems(), 'anime');

        foreach($items as $key => $value){
            $categories = $this->categoryTable->getCategoryByAnime($items->$key->id);
            $items->$key->categories = $this->prepareJsonData($categories, 'category');
        }

        die(json_encode(array('animes' =>$items)));
    }

    public function getAnimesByCategoryAction(){

        $id_category = $this->params()->fromQuery('category');
        $paginator = $this->animeTable->getAnimesByCategory($id_category);
        $paginator->setCurrentPageNumber(1);
        $paginator->setItemCountPerPage(20);
        $items = $this->prepareJsonData($paginator->getCurrentItems(), 'anime');

        foreach($items as $key => $value){
            $categories = $this->categoryTable->getCategoryByAnime($items->$key->id);
            $items->$key->categories = $this->prepareJsonData($categories, 'category');
        }

        die(json_encode(array('animes' => $items)));
    }

    public function getAnimeCategoriesAction(){

        $categories = $this->categoryTable->fetchAll();
        $data = $this->prepareJsonData($categories, 'category');

        die(json_encode(array('categories' => $data)));
    }

    public function getAnimeGenresAction(){

        $genres = $this->genreTable->fetchAll();
        $data = $this->prepareJsonData($genres, 'genre');

        die(json_encode(array('genres' => $data)));
    }

    public function getAnimeAuthorsAction(){

        $authors = $this->authorTable->fetchAll();
        $data = $this->prepareJsonData($authors, 'author');

        die(json_encode(array('authors' => $data)));
    }

    public function saveCacheAction()
    {
        $data = $this->params()->fromPost();
        //$this->storeCache($data);
        // die(json_encode(array('cache' => $this->getCache())));
        die(json_encode(array('cache' => $this->getIp())));
    }

    public function saveClientAnimeAction(){

        $data = $this->params()->fromPost();
        $clientAnime = $this->saveClientAnime($data, null);
        die(json_encode(array('data' => $clientAnime)));
    }

    public function saveClientEpisodeAction()
    {
        $episode = $this->params()->fromPost();
        $clientEpisode = $this->saveClientEpisode($episode);
        die(json_encode(array('data' => $clientEpisode)));
    }

    public function getClientDataAction()
    {
        $id_md5 = $this->params()->fromQuery('trackId');
        $anime = $this->animeTable->getAnime($id_md5);
        $data = $this->prepareClientData($anime);

        die(json_encode(array('client' => $data)));
    }

    public function saveAnimeAction()
    {
        $data = $this->params()->fromPost();
        $anime = $this->saveAnime($data);
        die(json_encode(array('data' => $anime)));
    }

    public function saveClientListAction(){

        $data = $this->params()->fromPost();
        $clientList = $this->saveClientList($data['id_anime']);;
        die(json_encode(array('data' => $clientList)));
    }

    public function saveEpisodeReportAction(){

        $data = $this->params()->fromPost();
        $report = $this->saveEpisodeReport($data['id_anime'], $data['id_episode']);;
        die(json_encode(array('data' => $report)));
    }

    public function saveVideoStatusAction(){

        $data = $this->params()->fromPost();

        foreach($data as $id_video){
            $this->videoTable->changeStatus($id_video, 0);
        }

        die(json_encode(array('data' => $data)));
    }

    public function getRelatedAnimesAction()
    {
        $id_md5 = $this->params()->fromQuery('trackId');
        $anime = $this->animeTable->getAnime($id_md5);
        $relatedAnimes = $this->animeTable->getRelatedAnimes($anime);
        $data =  $this->prepareJsonData($relatedAnimes, 'anime');

        die(json_encode(array('related_animes' => $data)));
    }
}

