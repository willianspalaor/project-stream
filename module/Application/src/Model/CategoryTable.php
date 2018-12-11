<?php
/**
 * Created by PhpStorm.
 * User: Willian
 * Date: 03/12/2018
 * Time: 02:58
 */

namespace Application\Model;

use RuntimeException;
use Zend\Db\TableGateway\TableGatewayInterface;

class CategoryTable
{
    private $tableGateway;

    public function __construct(TableGatewayInterface $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    public function fetchAll()
    {
        $select = $this->tableGateway->getSql()->select();
        $select->columns(array('*'));
        $select->order('order');
        $rowset = $this->tableGateway->selectWith($select);

        return $rowset->toArray();
    }

    public function getCategory($id)
    {
        $id = (int)$id;
        $rowset = $this->tableGateway->select(['id_category' => $id]);
        return $rowset->current();
    }

    public function getCategoryByAnime($id_anime){

        $select = $this->tableGateway->getSql()->select();
        $select->columns(array('*'));
        $select->join('anime_category', 'anime_category.id_category = category.id_category', array(), 'inner');
        $select->where(array('anime_category.id_anime' => $id_anime));
        $rowset = $this->tableGateway->selectWith($select);

        return $rowset->toArray();
    }

}