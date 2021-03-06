<?php
/**
 * Created by PhpStorm.
 * User: Willian
 * Date: 07/11/2018
 * Time: 17:09
 */

namespace Application\Model;

use RuntimeException;
use Zend\Db\TableGateway\TableGatewayInterface;

class EpisodeTable
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

    public function getEpisode($id)
    {
        $id = (int) $id;
        $rowset = $this->tableGateway->select(['id_episode' => $id]);

        $row = $rowset->current();
        if (! $row) {
            throw new RuntimeException(sprintf(
                'Could not find row with identifier %d',
                $id
            ));
        }

        return $row;
    }

    public function getEpisodeByAnime($id_anime, $track)
    {
        $id_anime = (int) $id_anime;
        $sqlSelect = $this->tableGateway->getSql()->select();
        $sqlSelect->columns(array('*'));
        $sqlSelect->join('season', 'episode.id_season = season.id_season', array(), 'inner');
        $sqlSelect->join('anime', 'season.id_anime = anime.id_anime', array(), 'inner');
        $sqlSelect->where(array('anime.id_anime' => $id_anime));
        $sqlSelect->where(array('episode.track' => $track));
        $sqlSelect->order('episode.episode');
        $rowset = $this->tableGateway->selectWith($sqlSelect);

        $row = $rowset->current();
        if (! $row) {
           return null;
        }

        return $row;
    }

    public function getEpisodesBySeason($id_season)
    {
        $id_season = (int) $id_season;
        $sqlSelect = $this->tableGateway->getSql()->select();
        $sqlSelect->columns(array('*'));
        $sqlSelect->where(array('episode.id_season' => $id_season));
        $sqlSelect->order('episode.id_season');

        $rowset = $this->tableGateway->selectWith($sqlSelect);
        $rows = [];

        foreach ($rowset as $key => $value) {
            $rows[(int)$key] = $value;
        }

        return $rows;
    }


    public function getEpisodeByTrack($track)
    {
        $sqlSelect = $this->tableGateway->getSql()->select();
        $sqlSelect->columns(array('*'));
        $sqlSelect->where(array('episode.track' => $track));

        $rowset = $this->tableGateway->selectWith($sqlSelect);
        return $rowset->current();
    }



}