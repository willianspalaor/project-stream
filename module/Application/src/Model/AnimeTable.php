<?php

namespace Application\Model;

use RuntimeException;
use Zend\Db\TableGateway\TableGatewayInterface;

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

    public function getAnime($id)
    {
        if(gettype($id) == 'string'){
            $rowset = $this->tableGateway->select(['name' => $id]);
        }else{
            $id = (int) $id;
            $rowset = $this->tableGateway->select(['id_anime' => $id]);
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