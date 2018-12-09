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

    public function getClientAnimeByAnime($id_client, $id_anime){

        $id_client = (int) $id_client;
        $id_anime = (int) $id_anime;
        $sqlSelect = $this->tableGateway->getSql()->select();
        $sqlSelect->columns(array('*'));
        $sqlSelect->where(array('client_anime.id_client' => $id_client));
        $sqlSelect->where(array('client_anime.id_anime' => $id_anime));
        $rowset = $this->tableGateway->selectWith($sqlSelect);

        $row = $rowset->current();

        if (! $row) {
            return null;
        }

        return $row;
    }

    public function saveClientAnime(ClientAnime $clientAnime)
    {
        $data = [
            'id_anime' => $clientAnime->id_anime,
            'id_client' => $clientAnime->id_client,
            'current_season' => $clientAnime->current_season,
            'current_episode' => $clientAnime->current_episode
        ];

        $id = (int) $clientAnime->id;

        if ($id === 0) {
            $this->tableGateway->insert($data);
            return;
        }

        if (! $this->getClientAnime($id)) {
            throw new RuntimeException(sprintf(
                'Cannot update album with identifier %d; does not exist',
                $id
            ));
        }

        $this->tableGateway->update($data, ['id_client_anime' => $id]);
    }

}