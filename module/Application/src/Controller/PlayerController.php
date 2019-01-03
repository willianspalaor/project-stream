<?php
/**
 * Created by PhpStorm.
 * User: Willian
 * Date: 14/11/2018
 * Time: 22:45
 */

namespace Application\Controller;

use Zend\View\Model\ViewModel;

//require __DIR__ . '/../../../../DriverAPI.php';

class PlayerController extends AbstractController
{
    public function indexAction()
    {
        $name = $this->params()->fromRoute('id', -1);
        $anime = $this->animeTable->getAnime(null, $name);

       // getFile5();

        return new ViewModel([
            'anime' => $anime
        ]);
    }
}