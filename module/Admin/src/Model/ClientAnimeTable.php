<?php
/**
 * Created by PhpStorm.
 * User: Willian
 * Date: 03/12/2018
 * Time: 02:58
 */

namespace Admin\Model;

use RuntimeException;
use Zend\Db\TableGateway\TableGatewayInterface;

class ClientAnimeTable
{
    private $tableGateway;

    public function __construct(TableGatewayInterface $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    public function fetchAll()
    {
        $resultSet =  $this->tableGateway->select();
        return $resultSet;
    }

    public function getClientAnime($id)
    {
        $id = (int) $id;
        $rowset = $this->tableGateway->select(['id_client_anime' => $id]);

        $row = $rowset->current();
        if (! $row) {
            throw new RuntimeException(sprintf(
                'Could not find row with identifier %d',
                $id
            ));
        }

        return $row;
    }

    public function getClientsAnimeByAnime($id_anime)
    {
        $id_anime = (int) $id_anime;
        $sqlSelect = $this->tableGateway->getSql()->select();
        $sqlSelect->columns(array('*'));
        $sqlSelect->where(array('id_anime' => $id_anime));

        $rowset = $this->tableGateway->selectWith($sqlSelect);
        $rows = [];

        foreach ($rowset as $key => $value) {
            $rows[(int)$key] = $value;
        }

        return $rows;
    }

    public function deleteClientAnime($id)
    {
        $this->tableGateway->delete(['id_client_anime' => (int) $id]);
    }

    public function deleteClientsAnime($id_anime){
        $this->tableGateway->delete(['id_anime' => (int) $id_anime]);
    }

}