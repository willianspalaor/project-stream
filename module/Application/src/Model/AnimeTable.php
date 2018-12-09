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

    public function fetchAll($paginated = false)
    {
        if ($paginated) {

            $select = new Select($this->tableGateway->getTable());
            return $this->fetchPaginatedResults($select);
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
        $sqlSelect->where(array('client_anime.id_client' => $id_client));
        $rowset = $this->tableGateway->selectWith($sqlSelect);

        return $rowset->toArray();
    }

    public function getAnimesByCategory($id_category)
    {
        $select = $this->tableGateway->getSql()->select();
        $select->columns(array('*'));
        $select->join('anime_category', 'anime_category.id_anime = anime.id_anime', array(), 'inner');
        $select->where(array('anime_category.id_category' => $id_category));

        return $this->fetchPaginatedResults($select);

    }
}