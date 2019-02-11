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

        $file = $request->getFiles()->toArray();
        $data = $request->getPost();

        $form->setData($data);

        if(! $form->isValid()){
            return ['form' => $form];
        }

        $data = $form->getData();

        if($data['open_start'] !== ''){
            $data['open_start'] = $this->timeToSeconds($data['open_start']);
        }

        if($data['open_end'] !== ''){
            $data['open_end'] = $this->timeToSeconds($data['open_end']);
        }

        if($data['resume_start'] !== ''){
            $data['resume_start'] = $this->timeToSeconds($data['resume_start']);
        }

        if($data['resume_end'] !== ''){
            $data['resume_end'] = $this->timeToSeconds($data['resume_end']);
        }

        if($data['end_start'] !== ''){
            $data['end_start'] = $this->timeToSeconds($data['end_start']);
        }

        if($file['image']['size'] > 0){
            $imgName = $this->prepareKey($data['key']) . '_' . $data['episode'] . '.' . pathinfo($file['image']['name'], PATHINFO_EXTENSION);
            $data['thumb'] = '/img/Anime/thumbs/' . $imgName;
            move_uploaded_file($file['image']['tmp_name'],    $_SERVER['DOCUMENT_ROOT'] . '/img/Anime/thumbs/' . $imgName);
        }
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

        if($episode->open_start !== '' && $episode->open_start){
            $episode->open_start = $this->secondsToTime($episode->open_start);
        }
        if($episode->open_end !== '' && $episode->open_end){
            $episode->open_end = $this->secondsToTime($episode->open_end);
        }
        if($episode->resume_start !== '' && $episode->resume_start){
            $episode->resume_start = $this->secondsToTime($episode->resume_start);
        }
        if($episode->resume_end !== '' && $episode->resume_end){
            $episode->resume_end = $this->secondsToTime($episode->resume_end);
        }
        if($episode->end_start !== '' && $episode->end_start){
            $episode->end_start = $this->secondsToTime($episode->end_start);
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

        $file = $this->request->getFiles()->toArray();

        if($episode->open_start && $episode->open_start !== ''){
            $episode->open_start = $this->timeToSeconds($episode->open_start);
        }

        if($episode->open_end && $episode->open_end !== ''){
            $episode->open_end = $this->timeToSeconds($episode->open_end);
        }

        if($episode->resume_start && $episode->resume_start !== ''){
            $episode->resume_start = $this->timeToSeconds($episode->resume_start);
        }

        if($episode->resume_end && $episode->resume_end !== ''){
            $episode->resume_end = $this->timeToSeconds($episode->resume_end);
        }

        if($episode->end_start && $episode->end_start !== ''){
            $episode->end_start = $this->timeToSeconds($episode->end_start);
        }

        if($file['image']['size'] > 0){

            if($episode->thumb){

                if(file_exists ( $_SERVER['DOCUMENT_ROOT'] . $episode->thumb )){
                    unlink($_SERVER['DOCUMENT_ROOT'] . $episode->thumb);
                }
            }

            $imgName = $this->prepareKey($data['key']) . '_' . $data['episode'] . '.' . pathinfo($file['image']['name'], PATHINFO_EXTENSION);
            $episode->thumb = '/img/Anime/thumbs/' . $imgName;
            move_uploaded_file($file['image']['tmp_name'], $_SERVER['DOCUMENT_ROOT'] . $episode->thumb);
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
                $episode = $this->_episodeTable->getEpisode($id);

                if(file_exists($_SERVER['DOCUMENT_ROOT'] . $episode->thumb)){
                    unlink($_SERVER['DOCUMENT_ROOT']. $episode->thumb);
                }

               // $videos = $this->_videoTable->getVideosByEpisode($id);

                $this->_videoTable->deleteVideosEpisode($id);
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

