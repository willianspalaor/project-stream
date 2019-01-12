<?php
namespace Application\Controller;
use Zend\View\Model\ViewModel;


class IndexController extends AbstractController
{
    public function indexAction()
    {

        $this->minifyCSS();
        $this->minifyJS();
        return new ViewModel();
    }
 }

