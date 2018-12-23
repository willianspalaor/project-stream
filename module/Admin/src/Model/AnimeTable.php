<?php

namespace Admin\Model;

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

            return $this->fetchPaginatedResults($select);
        }

        /*$select = $this->tableGateway->getSql()->select();
        $select->columns(array('*'));
        $select->order('title');
        $rowset = $this->tableGateway->selectWith($select);
        return $rowset->toArray();*/

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

    public function getAnime($id = null)
    {
        $rowset = $this->tableGateway->select(['id_anime' => $id]);
        $row = $rowset->current();
        if (! $row) {
            throw new RuntimeException(sprintf(
                'Could not find row with identifier %d',
                $id
            ));
        }

        return $row;
    }

    public function getLastId(){
        return $this->tableGateway->lastInsertValue;
    }

    public function saveAnime(Anime $anime)
    {
        $id = (int) $anime->id_anime;

        if ($id === 0) {
            $this->tableGateway->insert($anime->getArrayCopy());
            return $this->tableGateway->lastInsertValue;
        }

        $data = $anime->getData();
        $this->tableGateway->update($data, ['id_anime' => $id]);
    }

    public function deleteAnime($id)
    {
        $this->tableGateway->delete(['id_anime' => (int) $id]);
    }
}