<?php

namespace Admin\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Admin\Model\AnimeTable;

class IndexController extends AbstractController
{
    public function indexAction()
    {
        if($this->isAuthenticate()) {
            return $this->redirect()->toRoute('admin/anime');
           // $this->redirect()->toRoute('admin/anime');
        }

        return new ViewModel();
    }

    public function loginAction(){

        if($this->isAuthenticate()){
            $this->redirect()->toRoute('admin/anime');
        }else{
            $request = $this->getRequest();
            $data = $request->getPost();
            $auth = $this->authenticate($data['Username'], $data['Password']);

            if(!$auth){
                $this->redirect()->toRoute('admin');
            }else{
                $this->redirect()->toRoute('admin/anime');
            }
        }
    }

    public function logoutAction()
    {
        session_start();
        session_unset();
        session_destroy();

        $this->redirect()->toRoute('admin');
    }
}

