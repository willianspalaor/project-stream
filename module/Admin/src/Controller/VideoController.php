<?php
/**
 * Created by PhpStorm.
 * User: Willian
 * Date: 19/12/2018
 * Time: 13:49
 */

namespace Admin\Controller;
use Zend\View\Model\ViewModel;
use Admin\Form\VideoForm;
use Admin\Model\Video;

class VideoController extends AbstractController
{
    public function indexAction()
    {

        if(!$this->isAuthenticate()) {
            return $this->redirect()->toRoute('admin');
        }

        $id_episode = (int)$this->params()->fromRoute('id_episode');

        return new ViewModel([
            'videos' => $this->_videoTable->getVideosByEpisode($id_episode),
            'id_episode'=>$id_episode
        ]);
    }

    public function addAction()
    {
        if(!$this->isAuthenticate()) {
            return $this->redirect()->toRoute('admin');
        }

        $id_episode = (int)$this->params()->fromRoute('id');

        if(!$id_episode){
            return false;
        }

        $form = new VideoForm();
        $form->get('submit')->setValue('Add');
        $request = $this->getRequest();

        $viewData = ['id_episode' => $id_episode, 'form' => $form];

        if (! $request->isPost()) {
            return $viewData;
        }

        $video = new Video();
        $form->setInputFilter($video->getInputFilter());

        $data = $request->getPost();
        $form->setData($data);

        if(! $form->isValid()){
            return ['form' => $form];
        }

        $data = $form->getData();
        $data['id_episode'] = $id_episode;
        $data['status'] = 1;

        $video->exchangeArray($data);
        $this->_videoTable->saveVideo($video);

        return $this->redirect()->toRoute('admin/video', array(
            'controller' => 'video',
            'action' =>  'index',
            'id_episode' => $id_episode,
        ));
    }

    public function editAction()
    {
        if(!$this->isAuthenticate()) {
            return $this->redirect()->toRoute('admin');
        }

        $id = (int) $this->params()->fromRoute('id', 0);
        $id_episode = (int) $this->params()->fromRoute('id_episode', 0);

        if (0 === $id) {
            return $this->redirect()->toRoute('admin/video', array(
                'controller' => 'video',
                'action' =>  'add',
                'id' => $id_episode,
            ));
        }

        try {
            $video = $this->_videoTable->getVideo($id);
        } catch (\Exception $e) {

            return $this->redirect()->toRoute('admin/video', array(
                'controller' => 'video',
                'action' =>  'index',
                'id_episode' => $id_episode,
            ));
        }

        $form = new VideoForm();
        $form->bind($video);
        $form->get('submit')->setAttribute('value', 'Edit');

        $request = $this->getRequest();
        $viewData = ['id' => $id, 'form' => $form, 'id_episode' => $id_episode];

        if (! $request->isPost()) {
            return $viewData;
        }
        $data = $request->getPost();
        $form->setInputFilter($form->getInputFilter());
        $form->setData($data);

        if (! $form->isValid()) {
            return $viewData;
        }

        $this->_videoTable->saveVideo($video);

        return $this->redirect()->toRoute('admin/video', array(
            'controller' => 'video',
            'action' =>  'index',
            'id_episode' => $id_episode,
        ));
    }

    public function deleteAction()
    {
        if(!$this->isAuthenticate()) {
            return $this->redirect()->toRoute('admin');
        }

        $id = (int) $this->params()->fromRoute('id', 0);
        $id_episode = (int)$this->params()->fromRoute('id_episode', 0);

        if (!$id) {
            return $this->redirect()->toRoute('admin/video', array(
                'controller' => 'video',
                'action' =>  'index',
                'id_episode' => $id_episode,
            ));
        }

        $request = $this->getRequest();

        if ($request->isPost()) {

            $del = $request->getPost('del', 'No');

            if ($del == 'Yes') {
                $id = (int) $request->getPost('id');
                $this->_videoTable->deleteVideo($id);
            }

            return $this->redirect()->toRoute('admin/video', array(
                'controller' => 'video',
                'action' =>  'index',
                'id_episode' => $id_episode,
            ));
        }

        return[

            'id' => $id,
            'id_episode' => $id_episode,
            'video' => $this->_videoTable->getVideo($id)
        ];
    }
}