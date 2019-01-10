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
use Admin\Model\ClientAnimeTable;
use Admin\Model\ClientEpisodeTable;
use Admin\Model\EpisodeReportTable;

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
    public $_clientAnimeTable;
    public $_clientEpisodeTable;
    public $_episodeReportTable;

    public function __construct(AnimeTable $animeTable, GenreTable $genreTable, CategoryTable $categoryTable, AnimeCategoryTable $animeCategoryTable,
                                SeasonTable $seasonTable, EpisodeTable $episodeTable, VideoTable $videoTable, AdminTable $adminTable, AuthorTable $authorTable,
                                ClientAnimeTable $clientAnimeTable, ClientEpisodeTable $clientEpisodeTable, EpisodeReportTable $episodeReportTable)
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
        $this->_clientAnimeTable = $clientAnimeTable;
        $this->_clientEpisodeTable = $clientEpisodeTable;
        $this->_episodeReportTable = $episodeReportTable;
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

        if(!isset($_SESSION)){
            session_start();
        }

        $auth = $this->_adminTable->authenticate($user, $pass);

        if($auth){
            $_SESSION['username'] = $user;
            $_SESSION['authenticate']= true;
        }

        return $auth;
    }

    public function isAuthenticate(){

        if(!isset($_SESSION)){
            session_start();
        }

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

    public function secondsToTime($seconds){

        $dtF = new \DateTime('@0');
        $dtT = new \DateTime("@$seconds");
        $hours = $dtF->diff($dtT)->format('%h');
        $minutes = $dtF->diff($dtT)->format('%i');
        $seconds = $dtF->diff($dtT)->format('%s');

        if($hours < 10){
            $hours = '0' . $hours;
        }

        if($minutes < 10){
            $minutes = '0' . $minutes;
        }

        if($seconds < 10){
            $seconds = '0' . $seconds;
        }

        return $hours . ':' . $minutes . ':' . $seconds;
    }

    public function timeToSeconds($time){
        return strtotime("1970-01-01 $time UTC");
    }



}