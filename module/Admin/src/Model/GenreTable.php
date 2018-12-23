<?php

namespace Admin\Model;

use RuntimeException;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\Sql\Select;
use Zend\Db\TableGateway\TableGatewayInterface;
use Zend\Paginator\Adapter\DbSelect;
use Zend\Paginator\Paginator;

class GenreTable
{
    private $tableGateway;

    public function __construct(TableGatewayInterface $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    public function fetchAll($paginated = false, $params = [])
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
        $resultSetPrototype->setArrayObjectPrototype(new Genre());

        $paginatorAdapter = new DbSelect(
            $select,
            $this->tableGateway->getAdapter(),
            $resultSetPrototype
        );

        $paginator = new Paginator($paginatorAdapter);
        return $paginator;
    }

    public function getGenre($id = null)
    {
        $rowset = $this->tableGateway->select(['id_genre' => $id]);
        $row = $rowset->current();
        if (! $row) {
            throw new RuntimeException(sprintf(
                'Could not find row with identifier %d',
                $id
            ));
        }

        return $row;
    }

    public function saveGenre(Genre $genre)
    {
        $id = (int) $genre->id_genre;

        if ($id === 0) {
            $this->tableGateway->insert($genre->getArrayCopy());
            return $this->tableGateway->lastInsertValue;
        }

        $data = $genre->getData();
        $this->tableGateway->update($data, ['id_genre' => $id]);
        return $this->tableGateway->lastInsertValue;
    }

    public function deleteGenre($id)
    {
        $this->tableGateway->delete(['id_genre' => (int) $id]);
    }
}