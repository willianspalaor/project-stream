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

class GenreTable
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
        $select->order('title');
        $rowset = $this->tableGateway->selectWith($select);

        return $rowset->toArray();
    }

    public function getGenre($id)
    {
        $id = (int)$id;
        $rowset = $this->tableGateway->select(['id_genre' => $id]);
        return $rowset->current();
    }


}