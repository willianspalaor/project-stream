<?php
/**
 * Created by PhpStorm.
 * User: Willian
 * Date: 14/11/2018
 * Time: 22:45
 */

namespace Application\Controller;


class PlayerController extends AbstractController
{
    public function getAnimeAction()
    {
        $id_md5 = $this->params()->fromQuery('trackId');
        $anime = $this->animeTable->getAnime($id_md5);
        $seasons = $this->seasonTable->getSeasonByAnime($anime->id);

        $data = $this->prepareData($anime, $seasons);
        die(json_encode(array('anime' => $data)));
    }

    public function saveCacheAction()
    {
        $data = $this->params()->fromPost();
        //$this->storeCache($data);
       // die(json_encode(array('cache' => $this->getCache())));
        die(json_encode(array('cache' => $this->getIp())));
    }


}