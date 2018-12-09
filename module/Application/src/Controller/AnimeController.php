<?php

namespace Application\Controller;

class AnimeController extends AbstractController
{

    public function getAnimeAction()
    {
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
        $data = $this->prepareJsonData($animes, 'anime');

        die(json_encode(array('current_animes' => $data)));
    }


    public function getAnimesAction(){

        $paginator = $this->animeTable->fetchAll(true);
        $paginator->setCurrentPageNumber(1);
        $paginator->setItemCountPerPage(24);
        $items = $this->prepareJsonData($paginator->getCurrentItems(), 'anime');

        die(json_encode(array('animes' => $items)));
    }

    public function getAnimesByCategoryAction(){

        $id_category = $this->params()->fromQuery('category');
        $paginator = $this->animeTable->getAnimesByCategory($id_category);
        $paginator->setCurrentPageNumber(1);
        $paginator->setItemCountPerPage(20);
        $items = $this->prepareJsonData($paginator->getCurrentItems(), 'anime');

        die(json_encode(array('animes' => $items)));
    }

    public function getAnimeCategoriesAction(){

        $categories = $this->categoryTable->fetchAll();
        $data = $this->prepareJsonData($categories, 'categoria');

        die(json_encode(array('categorias' => $data)));
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
}

