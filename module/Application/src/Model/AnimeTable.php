<?php

namespace Application\Model;

use RuntimeException;
use Zend\Db\TableGateway\TableGatewayInterface;
use Zend\Db\Sql\Expression;

class AnimeTable
{
    private $tableGateway;

    public function __construct(TableGatewayInterface $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    public function fetchAll()
    {
        $resultSet =  $this->tableGateway->select();
        //$resultSet->buffer();
       // $resultSet->next();
        return $resultSet;
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

}