<?php
/**
 * Created by PhpStorm.
 * User: Willian
 * Date: 19/12/2018
 * Time: 00:03
 */

namespace Admin\Controller;

use Admin\Model\Episode;
use Zend\Mvc\Controller\AbstractActionController;
use Admin\Model\AnimeTable;
use Admin\Model\GenreTable;
use Admin\Model\CategoryTable;
use Admin\Model\AnimeCategoryTable;
use Admin\Model\SeasonTable;
use Admin\Model\EpisodeTable;
use Admin\Model\VideoTable;
use Admin\Model\AdminTable;
use Admin\Model\AuthorTable;

class AbstractController extends AbstractActionController
{

    public $_animeTable;
    public $_genreTable;
    public $_categoryTable;
    public $_animeCategoryTable;
    public $_seasonTable;
    public $_episodeTable;
    public $_videoTable;
    public $_adminTable;
    public $_authorTable;

    public function __construct(AnimeTable $animeTable, GenreTable $genreTable, CategoryTable $categoryTable, AnimeCategoryTable $animeCategoryTable,
                                SeasonTable $seasonTable, EpisodeTable $episodeTable, VideoTable $videoTable, AdminTable $adminTable, AuthorTable $authorTable)
    {
        $this->_animeTable = $animeTable;
        $this->_genreTable = $genreTable;
        $this->_categoryTable = $categoryTable;
        $this->_animeCategoryTable = $animeCategoryTable;
        $this->_seasonTable = $seasonTable;
        $this->_episodeTable = $episodeTable;
        $this->_videoTable = $videoTable;
        $this->_adminTable = $adminTable;
        $this->_authorTable = $authorTable;
    }

    function prepareKey($string){
        $string = preg_replace( '/[`^~\'"]/', null, iconv( 'UTF-8', 'ASCII//TRANSLIT', $string ) );
        $string = str_replace(" ", "_", $string);
        $string = str_replace("-", "_", $string);
        return strtolower($string);
    }

    public function getCategories(){

        $categories = [];
        $dataCategories = $this->_categoryTable->fetchAll();

        foreach($dataCategories as $category){
            $category = (object)$category;
            $categories[$category->id_category] = $category->title;
        }

        return $categories;
    }

    public function getSelectedCategories($id_anime){

        $selectedCategories = [];
        $animeCategories = $this->_animeCategoryTable->getAnimeCategories($id_anime);

        foreach($animeCategories as $animeCategory){
            $selectedCategories[] = $animeCategory->id_category;
        }
        return implode(",", $selectedCategories);
    }

    public function getGenres(){

        $genres = [];
        $dataGenres = $this->_genreTable->fetchAll();

        foreach($dataGenres as $genre){
            $genre = (object)$genre;
            $genres[$genre->id_genre] = $genre->title;
        }

        return $genres;
    }

    public function getAuthors(){

        $authors = [];
        $dataAuthors = $this->_authorTable->fetchAll();

        foreach($dataAuthors as $author){
            $author = (object)$author;
            $authors[$author->id_author] = $author->name;
        }

        return $authors;
    }

    public function authenticate($user, $pass){

        session_start();
        $auth = $this->_adminTable->authenticate($user, $pass);

        if($auth){
            $_SESSION['username'] = $user;
            $_SESSION['authenticate']= true;
        }

        return $auth;
    }

    public function isAuthenticate(){

        session_start();

        if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > 1800)) {
            session_unset();
            session_destroy();
        }

        $_SESSION['LAST_ACTIVITY'] = time();

        if(isset($_SESSION['authenticate']) && $_SESSION['authenticate'] === true){
            return true;
        }else{
            return false;
        }
    }



}