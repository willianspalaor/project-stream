<?php

namespace Admin\Model;

use RuntimeException;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\Sql\Select;
use Zend\Db\TableGateway\TableGatewayInterface;
use Zend\Paginator\Adapter\DbSelect;
use Zend\Paginator\Paginator;

class AuthorTable
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
        $resultSetPrototype->setArrayObjectPrototype(new Author());

        $paginatorAdapter = new DbSelect(
            $select,
            $this->tableGateway->getAdapter(),
            $resultSetPrototype
        );

        $paginator = new Paginator($paginatorAdapter);
        return $paginator;
    }

    public function getAuthor($id = null)
    {
        $rowset = $this->tableGateway->select(['id_author' => $id]);
        $row = $rowset->current();
        if (! $row) {
            throw new RuntimeException(sprintf(
                'Could not find row with identifier %d',
                $id
            ));
        }

        return $row;
    }

    public function saveAuthor(Author $author)
    {
        $id = (int) $author->id_author;

        if ($id === 0) {
            $this->tableGateway->insert($author->getArrayCopy());
            return $this->tableGateway->lastInsertValue;
        }

        $data = $author->getData();
        $this->tableGateway->update($data, ['id_author' => $id]);
        return $this->tableGateway->lastInsertValue;
    }

    public function deleteAuthor($id)
    {
        $this->tableGateway->delete(['id_author' => (int) $id]);
    }
}