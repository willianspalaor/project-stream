<?php

namespace Application\Model;

use RuntimeException;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\Sql\Select;
use Zend\Db\TableGateway\TableGatewayInterface;
use Zend\Paginator\Adapter\DbSelect;
use Zend\Paginator\Paginator;

class AnimeTable
{
    private $tableGateway;

    public function __construct(TableGatewayInterface $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    public function fetchAll($paginated = false, $params = [])
    {
        if ($paginated) {

            $select = $this->tableGateway->getSql()->select();
            $select->columns(array('*'));
            $select->join('genre', 'anime.id_genre = genre.id_genre', array('genre' => 'title'), 'left');

            if(!empty($params)){

                if(isset($params['category']) && !empty($params['category'])){
                    $select->join('anime_category', 'anime_category.id_anime = anime.id_anime', array(), 'inner');
                    $select->where(array('anime_category.id_category' => (int)$params['category']));
                }

                if(isset($params['text']) && !empty($params['text'])){
                    $select->where(array('anime.title LIKE ?' => '%' . $params['text'] . '%'));
                }

                if(isset($params['first_word']) && !empty($params['first_word'])){
                    $select->where(array('SUBSTR(anime.title,1,1) = ?' =>  $params['first_word']));
                }

                if(isset($params['year']) && !empty($params['year'])){
                    $select->where(array('anime.year = ?' => $params['year']));
                }

                if(isset($params['author']) && !empty($params['author'])){
                    $select->where(array('anime.id_author = ?' => $params['author']));
                }

                if(isset($params['genre']) && !empty($params['genre'])){
                    $select->where(array('anime.id_genre = ?' => $params['genre']));
                }

                if(isset($params['seasons']) && !empty($params['seasons'])){
                    $select->where(array('anime.seasons <= ?' => $params['seasons']));
                }

                if(isset($params['episodes']) && !empty($params['episodes'])){
                    $select->where(array('anime.seasons <= ?' => $params['episodes']));
                }
            }

            // $select = new Select($this->tableGateway->getTable());
            $result = $this->fetchPaginatedResults($select);

            if(isset($params['search_all']) && isset($params['text'])){

                if($result->count() <= 0){
                    $select = $this->tableGateway->getSql()->select();
                    $select->columns(array('*'));
                    $select->join('anime_category', 'anime_category.id_anime = anime.id_anime', array(), 'inner');
                    $select->join('category', 'anime_category.id_category = category.id_category', array(), 'inner');
                    $select->where(array('category.title LIKE ?' => '%' . $params['text'] . '%'));
                    $result = $this->fetchPaginatedResults($select);
                }

                if($result->count() <= 0){

                    $select = $this->tableGateway->getSql()->select();
                    $select->columns(array('*'));
                    $select->join('author', 'author.id_author = anime.id_author', array(), 'inner');
                    $select->where(array('author.name LIKE ?' => '%' . $params['text'] . '%'));
                    $result = $this->fetchPaginatedResults($select);
                }
            }

            return $result;
        }

        return $this->tableGateway->select()->toArray();
    }

    private function fetchPaginatedResults($select)
    {
        $resultSetPrototype = new ResultSet();
        $resultSetPrototype->setArrayObjectPrototype(new Anime());

        $paginatorAdapter = new DbSelect(
            $select,
            $this->tableGateway->getAdapter(),
            $resultSetPrototype
        );

        $paginator = new Paginator($paginatorAdapter);
        return $paginator;
    }

    public function getAnime($id = null, $name = null)
    {
        if($id){
            $rowset = $this->tableGateway->select(['track' => $id]);
        }else{
            $rowset = $this->tableGateway->select(['name' => $name]);
        }

        $row = $rowset->current();
        if (! $row) {
            throw new RuntimeException(sprintf(
                'Could not find row with identifier %d',
                $id
            ));
        }

        return $row;
    }

    public function getCurrentAnimes($id_client){

        $sqlSelect = $this->tableGateway->getSql()->select();
        $sqlSelect->columns(array('*'));
        $sqlSelect->join('client_anime', 'client_anime.id_anime = anime.id_anime', array(), 'inner');
        $sqlSelect->join('genre', 'anime.id_genre = genre.id_genre', array('genre' => 'title'), 'left');
        $sqlSelect->where(array('client_anime.id_client' => $id_client));
        $sqlSelect->order('client_anime.last_activity DESC');
        $rowset = $this->tableGateway->selectWith($sqlSelect);

        return $rowset->toArray();
    }

    public function getAnimesByCategory($id_category)
    {
        $select = $this->tableGateway->getSql()->select();
        $select->columns(array('*'));
        $select->join('anime_category', 'anime_category.id_anime = anime.id_anime', array(), 'inner');
        $select->join('category', 'anime_category.id_category = category.id_category', array(), 'inner');
        $select->join('genre', 'anime.id_genre = genre.id_genre', array('genre' => 'title'), 'left');
        $select->where(array('anime_category.id_category' => $id_category));
        $select->order('category.order ASC');

        return $this->fetchPaginatedResults($select);

    }

    public function saveAnime(Anime $anime)
    {
        $id = (int) $anime->id;

        if ($id === 0) {
            $this->tableGateway->insert($anime->getArrayCopy());
            return;
        }

        $data = $anime->getData();
        $this->tableGateway->update($data, ['id_anime' => $id]);
    }

    public function getRelatedAnimes($anime){

        $select = $this->tableGateway->getSql()->select();
        $select->columns(array('*'));
        $select->where(array('anime.title LIKE ?' => '%' . $anime->title . '%'));
        $select->where(array('anime.id_anime != ?' => $anime->id));
        $select->limit(1);
        $rowset = $this->tableGateway->selectWith($select);
        $row = $rowset->toArray();
        //$result = $this->fetchPaginatedResults($select);


        if(!$row || empty($row)){
            $select = $this->tableGateway->getSql()->select();
            $select->columns(array('*'));
            $select->join('anime_category', 'anime_category.id_anime = anime.id_anime', array(), 'inner');
            $select->join('category', 'anime_category.id_category = category.id_category', array(), 'inner');
            $select->where(array('anime_category.id_anime' => $anime->id));
            $select->where(array('anime.id_anime != ?' => $anime->id));
            $select->limit(1);
            $rowset = $this->tableGateway->selectWith($select);
            $row = $rowset->toArray();
           // $result = $this->fetchPaginatedResults($select);
        }

        if(!$row || empty($row)){
            $select = $this->tableGateway->getSql()->select();
            $select->columns(array('*'));
            $select->limit(1);
            $select->where(array('anime.id_anime != ?' => $anime->id));
            $rowset = $this->tableGateway->selectWith($select);
            $row = $rowset->toArray();
        }

        return $row;

    }
}