<?php

namespace Admin\Controller;

use Zend\View\Model\ViewModel;
use Admin\Form\SeasonForm;
use Admin\Model\Season;

class SeasonController extends AbstractController
{
    public function indexAction()
    {
        if(!$this->isAuthenticate()) {
            return $this->redirect()->toRoute('admin');
        }

       $id_anime = (int)$this->params()->fromRoute('id_anime');
        return new ViewModel([
            'seasons' => $this->_seasonTable->getSeasonByAnime($id_anime),
            'id_anime'=>$id_anime
        ]);
    }

    public function addAction()
    {
        if(!$this->isAuthenticate()) {
            return $this->redirect()->toRoute('admin');
        }

        $id_anime = (int)$this->params()->fromRoute('id');

        if(!$id_anime){
            return false;
        }

        $form = new SeasonForm();
        $form->get('submit')->setValue('Add');
        $request = $this->getRequest();

        $viewData = ['id_anime' => $id_anime, 'form' => $form];

        if (! $request->isPost()) {
            return $viewData;
        }

        $season = new Season();
        $form->setInputFilter($season->getInputFilter());

        $data = $request->getPost();
        $form->setData($data);

        if(! $form->isValid()){
            return ['form' => $form];
        }

        $data = $form->getData();
        $data['id_anime'] = $id_anime;
        $season->exchangeArray($data);
        $this->_seasonTable->saveSeason($season);

        return $this->redirect()->toRoute('admin/season', array(
            'controller' => 'season',
            'action' =>  'index',
            'id_anime' => $id_anime,
        ));
    }

    public function editAction()
    {
        if(!$this->isAuthenticate()) {
            return $this->redirect()->toRoute('admin');
        }

        $id = (int) $this->params()->fromRoute('id', 0);
        $id_anime = (int) $this->params()->fromRoute('id_anime', 0);

        if (0 === $id) {
            return $this->redirect()->toRoute('admin/season', array(
                'controller' => 'season',
                'action' =>  'add',
                'id' => $id_anime,
            ));
        }

        try {
            $season = $this->_seasonTable->getSeason($id);
        } catch (\Exception $e) {

            return $this->redirect()->toRoute('admin/season', array(
                'controller' => 'season',
                'action' =>  'index',
                'id_anime' => $id_anime,
            ));
        }

        $form = new SeasonForm();
        $form->bind($season);
        $form->get('submit')->setAttribute('value', 'Edit');

        $request = $this->getRequest();
        $viewData = ['id' => $id, 'form' => $form, 'id_anime' => $id_anime];

        if (! $request->isPost()) {
            return $viewData;
        }
        $data = $request->getPost();
        $form->setInputFilter($form->getInputFilter());
        $form->setData($data);

        if (! $form->isValid()) {
            return $viewData;
        }

        $this->_seasonTable->saveSeason($season);

        return $this->redirect()->toRoute('admin/season', array(
            'controller' => 'season',
            'action' =>  'index',
            'id_anime' => $id_anime,
        ));
    }

    public function deleteAction()
    {
        if(!$this->isAuthenticate()) {
            return $this->redirect()->toRoute('admin');
        }

        $id = (int) $this->params()->fromRoute('id', 0);
        $id_anime = (int)$this->params()->fromRoute('id_anime', 0);

        if (!$id) {
            return $this->redirect()->toRoute('admin/season', array(
                'controller' => 'season',
                'action' =>  'index',
                'id_anime' => $id_anime,
            ));
        }

        $request = $this->getRequest();

        if ($request->isPost()) {

            $del = $request->getPost('del', 'No');

            if ($del == 'Yes') {
                $id = (int) $request->getPost('id');
                $this->_seasonTable->deleteSeason($id);
            }

            return $this->redirect()->toRoute('admin/season', array(
                'controller' => 'season',
                'action' =>  'index',
                'id_anime' => $id_anime,
            ));
        }

        return[

            'id' => $id,
            'id_anime' => $id_anime,
            'season' => $this->_seasonTable->getSeason($id)
        ];

    }

}

