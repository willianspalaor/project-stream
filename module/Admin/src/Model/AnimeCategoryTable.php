<?php

namespace Admin\Model;

use RuntimeException;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\Sql\Select;
use Zend\Db\TableGateway\TableGatewayInterface;
use Zend\Paginator\Adapter\DbSelect;
use Zend\Paginator\Paginator;

class AnimeCategoryTable
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
        $resultSetPrototype->setArrayObjectPrototype(new AnimeCategory());

        $paginatorAdapter = new DbSelect(
            $select,
            $this->tableGateway->getAdapter(),
            $resultSetPrototype
        );

        $paginator = new Paginator($paginatorAdapter);
        return $paginator;
    }

    public function getAnimeCategory($id = null)
    {
        $rowset = $this->tableGateway->select(['id_anime_category' => $id]);
        $row = $rowset->current();
        if (! $row) {
            throw new RuntimeException(sprintf(
                'Could not find row with identifier %d',
                $id
            ));
        }

        return $row;
    }

    public function getAnimeCategories($id_anime){

        $id_anime = (int) $id_anime;
        $sqlSelect = $this->tableGateway->getSql()->select();
        $sqlSelect->columns(array('*'));
        $sqlSelect->where(array('anime_category.id_anime' => $id_anime));

        $rowset = $this->tableGateway->selectWith($sqlSelect);
        $rows = [];

        foreach ($rowset as $key => $value) {
            $rows[(int)$key] = $value;
        }

        return $rows;
    }

    public function saveAnimeCategory(AnimeCategory $animeCategory)
    {
        $id = (int) $animeCategory->id_anime_category;

        if ($id === 0) {
            $this->tableGateway->insert($animeCategory->getArrayCopy());
            return $this->tableGateway->lastInsertValue;
        }

        $data = $animeCategory->getData();
        $this->tableGateway->update($data, ['id_anime_category' => $id]);
    }

    public function deleteAnimeCategory($id_anime)
    {
        $this->tableGateway->delete(['id_anime' => (int) $id_anime]);
    }


}