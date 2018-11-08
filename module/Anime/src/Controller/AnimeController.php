<?php

namespace Anime\Controller;

use Anime\Model\AnimeTable;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Anime\Form\AnimeForm;
use Anime\Model\Anime;

class AnimeController extends AbstractActionController
{
    private $table;

    public function __construct(AnimeTable $table)
    {
        $this->table = $table;
    }

    public function indexAction()
    {
        return new ViewModel([
            'animes' => $this->table->fetchAll(),
        ]);
    }

    public function addAction()
    {
        $form = new AnimeForm();
        $form->get('submit')->setValue('Add');

        $request = $this->getRequest();

        if(! $request->isPost()){
            return ['form' => $form];
        }

        $anime = new Anime();
        $form->setInputFilter($anime->getInputFilter());
        $form->setData($request->getPost());

        if(! $form->isValid()){
            return ['form' => $form];
        }

        $anime->exchangeArray($form->getData());
        $this->table->saveAnime($anime);
        return $this->redirect()->toRoute('anime');
    }

    public function editAction()
    {

        $id = (int) $this->params()->fromRoute('id', 0);

        if (0 === $id) {
            return $this->redirect()->toRoute('anime', ['action' => 'add']);
        }

        try {
            $anime = $this->table->getAnime($id);
        } catch (\Exception $e) {
            return $this->redirect()->toRoute('anime', ['action' => 'index']);
        }

        $form = new AnimeForm();
        $form->bind($anime);
        $form->get('submit')->setAttribute('value', 'Edit');

        $request = $this->getRequest();
        $viewData = ['id' => $id, 'form' => $form];

        if (! $request->isPost()) {
            return $viewData;
        }

        $form->setInputFilter($anime->getInputFilter());
        $form->setData($request->getPost());

        if (! $form->isValid()) {
            return $viewData;
        }

        $this->table->saveAnime($anime);

        return $this->redirect()->toRoute('anime', ['action' => 'index']);
    }

    public function deleteAction()
    {

        $id = (int) $this->params()->fromRoute('id', 0);
        
        if (!$id) {
            return $this->redirect()->toRoute('anime');
        }

        $request = $this->getRequest();
        if ($request->isPost()) {
            $del = $request->getPost('del', 'No');

            if ($del == 'Yes') {
                $id = (int) $request->getPost('id');
                $this->table->deleteAnime($id);
            }
            return $this->redirect()->toRoute('anime');
        }

        return [
            'id'    => $id,
            'anime' => $this->table->getAnime($id),
        ];
    }
}

