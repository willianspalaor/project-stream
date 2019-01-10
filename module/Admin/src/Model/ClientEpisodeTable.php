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

class ClientEpisodeTable
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

    public function getClientEpisode($id)
    {
        $id = (int) $id;
        $rowset = $this->tableGateway->select(['id_client_episode' => $id]);

        $row = $rowset->current();
        if (! $row) {
            throw new RuntimeException(sprintf(
                'Could not find row with identifier %d',
                $id
            ));
        }

        return $row;
    }

    public function deleteClientEpisode($id)
    {
        $this->tableGateway->delete(['id_client_episode' => (int) $id]);
    }

    public function deleteClientsEpisodes($clientAnimes){

        foreach($clientAnimes as $clientAnime){
            $this->tableGateway->delete(['id_client_anime' => (int) $clientAnime->id_client_anime]);
        }
    }

}