<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Application\Model\AnimeTable;

class AppController extends AbstractActionController
{

	private $animeTable;

    public function __construct(AnimeTable $animeTable)
    {
        $this->animeTable = $animeTable;
    }

    public function indexAction()
    {
        return new ViewModel([
            'animes' => $this->animeTable->fetchAll(),
        ]);
    }
}

