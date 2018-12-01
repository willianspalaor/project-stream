<?php

namespace Application\Controller;

use Zend\View\Model\ViewModel;

class AnimeController extends AbstractController
{

    public function indexAction()
    {
        $name = $this->params()->fromRoute('id', -1);
        $anime = $this->animeTable->getAnime(null, $name);

        return new ViewModel([
            'anime' => $anime
        ]);
    }

}

