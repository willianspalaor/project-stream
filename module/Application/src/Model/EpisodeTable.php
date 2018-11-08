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


    public function getEpisodeBySeason($id_season, $episode)
    {
        $id_season = (int) $id_season;
        $sqlSelect = $this->tableGateway->getSql()->select();
        $sqlSelect->columns(array('*'));
        $sqlSelect->join('season', 'episode.id_season = season.id_season', array(), 'inner');
        $sqlSelect->where(array('season.id_season' => $id_season));
        $sqlSelect->where(array('episode.episode' => $episode));
        $sqlSelect->order('episode.episode');
        $rowset = $this->tableGateway->selectWith($sqlSelect);

        $row = $rowset->current();
        if (! $row) {
            throw new RuntimeException(sprintf(
                'Could not find row with identifier %d',
                $id_season
            ));
        }

        return $row;

    }
}