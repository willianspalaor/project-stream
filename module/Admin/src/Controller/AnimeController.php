<?php

namespace Admin\Controller;

use Zend\View\Model\ViewModel;
use Admin\Model\Anime;
use Admin\Model\Category;
use Admin\Model\Author;
use Admin\Model\Genre;
use Admin\Model\AnimeCategory;
use Admin\Form\AnimeForm;

class AnimeController extends AbstractController
{
    public function indexAction()
    {
        if(!$this->isAuthenticate()) {
            return $this->redirect()->toRoute('admin');
        }

        return new ViewModel([
            'animes' => $this->_animeTable->fetchAll(),
        ]);
    }

    public function addAction()
    {
        if(!$this->isAuthenticate()) {
            return $this->redirect()->toRoute('admin');
        }

        $formCategories = $this->getCategories();
        $formGenres = $this->getGenres();
        $formAuthors = $this->getAuthors();

        $form = new AnimeForm($formGenres, $formCategories, $formAuthors);

        $form->get('submit')->setValue('Add');

        $request = $this->getRequest();

        if(! $request->isPost()){
            return ['form' => $form];
        }

        $anime = new Anime();
        $form->setInputFilter($anime->getInputFilter());

        $file = $request->getFiles()->toArray();
        $data = $request->getPost();

        $form->setData($data);

        if(! $form->isValid()){
            return ['form' => $form];
        }

        $data = $form->getData();

        if($file['image']['size'] > 0){
            $imgName = $this->prepareKey($data['name'])  . '.' . pathinfo($file['image']['name'], PATHINFO_EXTENSION);
            $data['img'] = '/img/Anime/miniaturas/' . $imgName;
            move_uploaded_file($file['image']['tmp_name'], 'public/img/Anime/miniaturas/' . $imgName);
        }

        if($file['video']['size'] > 0){
            $trailerName = $this->prepareKey($data['name'])  . '.' . pathinfo($file['video']['name'], PATHINFO_EXTENSION);
            $data['trailer'] = '/video/Anime/trailers/' . $trailerName;
            move_uploaded_file($file['video']['tmp_name'], 'public/video/Anime/trailers/' . $trailerName);
        }

        $categories = $data['category'];
        $id_author = $data['author'];
        $id_genre = $data['genre'];

        unset($data['category']);
        unset($data['author']);
        unset($data['genre']);

        if (!is_numeric($id_author)) {

            $newAuthor = new Author();
            $name = $id_author;
            $newAuthor->exchangeArray([
                'name' => $name
            ]);

            $id_author = $this->_authorTable->saveAuthor($newAuthor);
        }

        if (!is_numeric($id_genre)) {

            $newGenre = new Genre();
            $title = $id_genre;
            $newGenre->exchangeArray([
                'title' => $title
            ]);

            $id_genre = $this->_genreTable->saveGenre($newGenre);
        }

        $anime->exchangeArray($data);
        $anime->id_author = $id_author;
        $anime->id_genre = $id_genre;
        $id_anime = $this->_animeTable->saveAnime($anime);
        $anime->id_anime = $id_anime;
        $anime->track = md5($id_anime);
        $this->_animeTable->saveAnime($anime);

        $this->_animeCategoryTable->deleteAnimeCategory($id_anime);

        foreach($categories as $category){

            $id_category = $category;

            if (!is_numeric($category)) {

                $order = $this->_categoryTable->getNextOrder();

                $title = $category;
                $category = new Category();

                $category->exchangeArray([
                    'title' => $title,
                    'key' => $this->prepareKey($title),
                    'order' => $order
                ]);

                $id_category = $this->_categoryTable->saveCategory($category);
            }

            $animeCategory = new AnimeCategory();

            $animeCategory->exchangeArray([
                'id_anime' => $id_anime,
                'id_category' => $id_category
            ]);

            $this->_animeCategoryTable->saveAnimeCategory($animeCategory);
        }

        return $this->redirect()->toRoute('admin/anime');
    }

    public function editAction()
    {

        if(!$this->isAuthenticate()) {
            return $this->redirect()->toRoute('admin');
        }

        $id = (int) $this->params()->fromRoute('id', 0);

        if (0 === $id) {
            return $this->redirect()->toRoute('admin/anime', ['action' => 'add']);
        }

        try {
            $anime = $this->_animeTable->getAnime($id);
        } catch (\Exception $e) {
            return $this->redirect()->toRoute('admin/anime', ['action' => 'index']);
        }

        $formCategories = $this->getCategories();
        $formGenres = $this->getGenres();
        $formSelectedCategories = $this->getSelectedCategories($id);
        $formAuthors = $this->getAuthors();

        $form = new AnimeForm($formGenres, $formCategories, $formAuthors);
        $form->bind($anime);
        $form->get('submit')->setAttribute('value', 'Edit');

        $request = $this->getRequest();
        $viewData = ['id' => $id, 'form' => $form, 'selectedCategories' => $formSelectedCategories, 'id_author' => $anime->id_author, 'id_genre' => $anime->id_genre];

        if (! $request->isPost()) {
            return $viewData;
        }

        $data = $request->getPost();
        $categories = $data['category'];

        $this->_animeCategoryTable->deleteAnimeCategory($id);

        foreach($categories as $category){

            $id_category = $category;

            if (!is_numeric($category)) {

                $order = $this->_categoryTable->getNextOrder();
                $title = $category;
                $category = new Category();

                $category->exchangeArray([
                    'title' => $title,
                    'key' => $this->prepareKey($title),
                    'order' => $order
                ]);

                $id_category = $this->_categoryTable->saveCategory($category);
            }

            $animeCategory = new AnimeCategory();

            $animeCategory->exchangeArray([
                'id_anime' => $id,
                'id_category' => $id_category
            ]);

            $this->_animeCategoryTable->saveAnimeCategory($animeCategory);
        }

        $form->setInputFilter($form->getInputFilter());
        $form->setData($data);

        if (! $form->isValid()) {
            return $viewData;
        }

        $file = $this->request->getFiles()->toArray();

        if($file['image']['size'] > 0){

            if(file_exists ( 'public' . $anime->img)){
                unlink('public' . $anime->img);
            }

            $imgName = $this->prepareKey($data['name'])  . '.' . pathinfo($file['image']['name'], PATHINFO_EXTENSION);
            $anime->img = '/img/Anime/miniaturas/' . $imgName;
            move_uploaded_file($file['image']['tmp_name'], 'public' . $anime->img);
        }

        if($file['video']['size'] > 0){
            unlink('public' . $anime->trailer);
            move_uploaded_file($file['video']['tmp_name'], 'public/' . $anime->trailer);
        }

        $id_author = $data['author'];
        $id_genre = $data['genre'];

        if (!is_numeric($id_author)) {

            $newAuthor = new Author();
            $name = $id_author;
            $newAuthor->exchangeArray([
                'name' => $name
            ]);

            $id_author = $this->_authorTable->saveAuthor($newAuthor);
        }

        if (!is_numeric($id_genre)) {

            $newGenre = new Genre();
            $title = $id_genre;
            $newGenre->exchangeArray([
                'title' => $title
            ]);

            $id_genre = $this->_genreTable->saveGenre($newGenre);
        }

        $anime->track = md5($id);
        $anime->id_author = $id_author;
        $anime->id_genre = $id_genre;
        $this->_animeTable->saveAnime($anime);
        return $this->redirect()->toRoute('admin/anime', ['action' => 'index']);
    }


    public function deleteAction()
    {
        if(!$this->isAuthenticate()) {
            return $this->redirect()->toRoute('admin');
        }

        $id = (int) $this->params()->fromRoute('id', 0);

        if (!$id) {
            return $this->redirect()->toRoute('admin/anime');
        }

        $request = $this->getRequest();

        if ($request->isPost()) {
            $del = $request->getPost('del', 'No');

            if ($del == 'Yes') {

                $id = (int) $request->getPost('id');
                $anime = $this->_animeTable->getAnime($id);
                unlink('public' . $anime->img);
                unlink('public' . $anime->trailer);
                $this->_animeCategoryTable->deleteAnimeCategory($id);
                $this->_animeTable->deleteAnime($id);
            }

            return $this->redirect()->toRoute('admin/anime');
      }

      return[

          'id' => $id,
          'anime' => $this->_animeTable->getAnime($id)
      ];

    }

}

