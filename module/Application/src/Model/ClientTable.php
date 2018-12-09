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

class ClientTable
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

    public function getClient($id = null, $ip = null)
    {
        if($id){
            $rowset = $this->tableGateway->select(['id_client' => $id]);
        }else{
            $rowset = $this->tableGateway->select(['ip_address' => $ip]);
        }

        return $rowset->current();
    }

    public function getClientAnimes($id_client){

        $id_client = (int)$id_client;
        $sqlSelect = $this->tableGateway->getSql()->select();
        $sqlSelect->columns(array('*'));
        $sqlSelect->join('client_anime', 'client.id_client = client_anime.id_client', array('*'), 'inner');
        $sqlSelect->where(array('client.id_client' => $id_client));
        $rowset = $this->tableGateway->selectWith($sqlSelect);

        return $rowset->current();
    }


    public function getClientEpisodes($id_client, $id_anime){

        $id_client = (int)$id_client;
        $id_anime = (int)$id_anime;

        $sqlSelect = $this->tableGateway->getSql()->select();
        $sqlSelect->columns(array('*'));
        $sqlSelect->join('client_anime', 'client.id_client = client_anime.id_client', array(''), 'inner');
        $sqlSelect->join('client_episode', 'client_anime.id_client_anime = client_episode.id_client_anime', array('*'), 'inner');
        $sqlSelect->where(array('client.id_client' => $id_client));
        $sqlSelect->where(array('client_anime.id_anime' => $id_anime));
        $rowset = $this->tableGateway->selectWith($sqlSelect);

        return $rowset->current();
    }

    public function saveClient(Client $client)
    {
        $data = [
            'ip_address' => $client->ip_address,
        ];

        $id = (int) $client->id;

        if ($id === 0) {
            $this->tableGateway->insert($data);
            return;
        }

        if (! $this->getClient($id)) {
            throw new RuntimeException(sprintf(
                'Cannot update album with identifier %d; does not exist',
                $id
            ));
        }

        $this->tableGateway->update($data, ['id' => $id]);
    }

    public function deleteClient($id)
    {
        $this->tableGateway->delete(['id_client' => (int) $id]);
    }

}