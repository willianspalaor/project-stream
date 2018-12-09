<?php
/**
 * Created by PhpStorm.
 * User: Willian
 * Date: 14/11/2018
 * Time: 22:45
 */

namespace Application\Controller;

use Zend\View\Model\ViewModel;

class PlayerController extends AbstractController
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