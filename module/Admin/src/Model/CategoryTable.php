<?php

namespace Admin\Model;

use RuntimeException;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\Sql\Select;
use Zend\Db\TableGateway\TableGatewayInterface;
use Zend\Paginator\Adapter\DbSelect;
use Zend\Paginator\Paginator;

class CategoryTable
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
        $resultSetPrototype->setArrayObjectPrototype(new Category());

        $paginatorAdapter = new DbSelect(
            $select,
            $this->tableGateway->getAdapter(),
            $resultSetPrototype
        );

        $paginator = new Paginator($paginatorAdapter);
        return $paginator;
    }

    public function getCategory($id = null)
    {
        $rowset = $this->tableGateway->select(['id_category' => $id]);
        $row = $rowset->current();
        if (! $row) {
            throw new RuntimeException(sprintf(
                'Could not find row with identifier %d',
                $id
            ));
        }

        return $row;
    }

    public function getNextOrder(){

        $sqlSelect = $this->tableGateway->getSql()->select();
        $sqlSelect->columns(array('order'));
        $sqlSelect->order('category.order DESC');
        $sqlSelect->limit(1);

        $rowset = $this->tableGateway->selectWith($sqlSelect);
        $current = $rowset->current();

        if($current){
            return (int)$current->order + 1;
        }else{
            return 1;
        }
    }

    public function saveCategory(Category $category)
    {
        $id = (int) $category->id_category;

        if ($id === 0) {
            $this->tableGateway->insert($category->getArrayCopy());
            return $this->tableGateway->lastInsertValue;
        }

        $data = $category->getData();
        $this->tableGateway->update($data, ['id_category' => $id]);
    }

    public function saveAnimeCategory($id_anime, $id_category){

        $id_anime = (int) $id_anime;
        $id_category = (int) $id_category;

        $data = [
            'id_anime' => $id_anime,
            'id_category' => $id_category
        ];

        $table = $this->tableGateway->getTable('anime_category');
        $table->insert($data);
    }

    public function removeAnimeCategory($id_anime){

        $table = $this->tableGateway->getTable('anime_category');
        $table->delete(['id_anime' => (int) $id_anime]);
    }

    public function deleteCategory($id)
    {
        $this->tableGateway->delete(['id_category' => (int) $id]);
    }
}