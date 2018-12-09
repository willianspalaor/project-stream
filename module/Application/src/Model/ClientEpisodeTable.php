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

    public function getClientEpisodesByAnime($id_client_anime){

        $id_client_anime = (int) $id_client_anime;
        $sqlSelect = $this->tableGateway->getSql()->select();
        $sqlSelect->columns(array('*'));
        $sqlSelect->where(array('client_episode.id_client_anime' => $id_client_anime));

        $rowset = $this->tableGateway->selectWith($sqlSelect);
        $rows = [];

        foreach ($rowset as $key => $value) {
            $rows[(int)$key] = $value;
        }

        return $rows;
    }

    public function getClientEpisodeByEpisode($id_client_anime, $id_episode){

        $id_client_anime = (int) $id_client_anime;
        $id_episode = (int) $id_episode;

        $sqlSelect = $this->tableGateway->getSql()->select();
        $sqlSelect->columns(array('*'));
        $sqlSelect->where(array('client_episode.id_client_anime' => $id_client_anime));
        $sqlSelect->where(array('client_episode.id_episode' => $id_episode));
        $rowset = $this->tableGateway->selectWith($sqlSelect);

        $row = $rowset->current();

        if (! $row) {
            return null;
        }

        return $row;
    }

    public function saveClientEpisode(ClientEpisode $clientEpisode)
    {
        $data = [
            'id_client_anime' => $clientEpisode->id_client_anime,
            'id_episode' => $clientEpisode->id_episode,
            'progress' => $clientEpisode->progress
        ];

        $id = (int) $clientEpisode->id;

        if ($id === 0) {
            $this->tableGateway->insert($data);
            return;
        }

        if (! $this->getClientEpisode($id)) {
            throw new RuntimeException(sprintf(
                'Cannot update album with identifier %d; does not exist',
                $id
            ));
        }

        $this->tableGateway->update($data, ['id_client_episode' => $id]);
    }

}