<?php

namespace Admin\Model;

use RuntimeException;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\Sql\Select;
use Zend\Db\TableGateway\TableGatewayInterface;
use Zend\Paginator\Adapter\DbSelect;
use Zend\Paginator\Paginator;

class AdminTable
{
    private $tableGateway;

    public function __construct(TableGatewayInterface $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    public function authenticate($user, $pass)
    {
        $sqlSelect = $this->tableGateway->getSql()->select();
        $sqlSelect->columns(array('*'));
        $sqlSelect->where(array('user' => $user));
        $sqlSelect->where(array('password' => $pass));

        $rowset = $this->tableGateway->selectWith($sqlSelect);
        $row = $rowset->current();

        if($row){
            return true;
        }

        return false;
    }

}