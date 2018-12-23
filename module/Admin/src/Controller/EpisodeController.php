<?php

namespace Admin\Controller;

use Zend\View\Model\ViewModel;
use Admin\Form\EpisodeForm;
use Admin\Model\Episode;


class EpisodeController extends AbstractController
{
    public function indexAction()
    {
        if(!$this->isAuthenticate()) {
            return $this->redirect()->toRoute('admin');
        }

        $id_season = (int)$this->params()->fromRoute('id_season');

        return new ViewModel([
            'episodes' => $this->_episodeTable->getEpisodesBySeason($id_season),
            'id_season'=>$id_season
        ]);
    }

    public function addAction()
    {
        if(!$this->isAuthenticate()) {
            return $this->redirect()->toRoute('admin');
        }

        $id_season = (int)$this->params()->fromRoute('id');

        if(!$id_season){
            return false;
        }

        $form = new EpisodeForm();
        $form->get('submit')->setValue('Add');
        $request = $this->getRequest();

        $viewData = ['id_season' => $id_season, 'form' => $form];

        if (! $request->isPost()) {
            return $viewData;
        }

        $episode = new Episode();
        $form->setInputFilter($episode->getInputFilter());

        $data = $request->getPost();
        $form->setData($data);

        if(! $form->isValid()){
            return ['form' => $form];
        }

        $data = $form->getData();
        $data['id_season'] = $id_season;
        $data['track'] = md5($data['id_episode']);

        $episode->exchangeArray($data);
        $this->_episodeTable->saveEpisode($episode);

        return $this->redirect()->toRoute('admin/episode', array(
            'controller' => 'episode',
            'action' =>  'index',
            'id_season' => $id_season,
        ));
    }

    public function editAction()
    {
        if(!$this->isAuthenticate()) {
            return $this->redirect()->toRoute('admin');
        }

        $id = (int) $this->params()->fromRoute('id', 0);
        $id_season = (int) $this->params()->fromRoute('id_season', 0);

        if (0 === $id) {
            return $this->redirect()->toRoute('admin/episode', array(
                'controller' => 'episode',
                'action' =>  'add',
                'id' => $id_season,
            ));
        }

        try {
            $episode = $this->_episodeTable->getEpisode($id);
        } catch (\Exception $e) {

            return $this->redirect()->toRoute('admin/episode', array(
                'controller' => 'episode',
                'action' =>  'index',
                'id_season' => $id_season,
            ));
        }

        $form = new EpisodeForm();
        $form->bind($episode);
        $form->get('submit')->setAttribute('value', 'Edit');

        $request = $this->getRequest();
        $viewData = ['id' => $id, 'form' => $form, 'id_season' => $id_season];

        if (! $request->isPost()) {
            return $viewData;
        }
        $data = $request->getPost();
        $form->setInputFilter($form->getInputFilter());
        $form->setData($data);

        if (! $form->isValid()) {
            return $viewData;
        }

        $this->_episodeTable->saveEpisode($episode);

        return $this->redirect()->toRoute('admin/episode', array(
            'controller' => 'episode',
            'action' =>  'index',
            'id_season' => $id_season,
        ));
    }

    public function deleteAction()
    {

        if(!$this->isAuthenticate()) {
            return $this->redirect()->toRoute('admin');
        }

        $id = (int) $this->params()->fromRoute('id', 0);
        $id_season = (int)$this->params()->fromRoute('id_season', 0);

        if (!$id) {
            return $this->redirect()->toRoute('admin/episode', array(
                'controller' => 'episode',
                'action' =>  'index',
                'id_season' => $id_season,
            ));
        }

        $request = $this->getRequest();

        if ($request->isPost()) {

            $del = $request->getPost('del', 'No');

            if ($del == 'Yes') {
                $id = (int) $request->getPost('id');
                $this->_episodeTable->deleteEpisode($id);
            }

            return $this->redirect()->toRoute('admin/episode', array(
                'controller' => 'episode',
                'action' =>  'index',
                'id_season' => $id_season,
            ));
        }

        return[

            'id' => $id,
            'id_season' => $id_season,
            'episode' => $this->_episodeTable->getEpisode($id)
        ];
    }

}
