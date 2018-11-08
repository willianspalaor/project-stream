<?php
/**
 * Created by PhpStorm.
 * User: Willian
 * Date: 07/11/2018
 * Time: 16:57
 */

namespace Application\Model;


use RuntimeException;
use Zend\Db\TableGateway\TableGatewayInterface;

class SeasonTable
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

    public function getSeason($id)
    {
        $id = (int) $id;
        $rowset = $this->tableGateway->select(['id_season' => $id]);

        $row = $rowset->current();
        if (! $row) {
            throw new RuntimeException(sprintf(
                'Could not find row with identifier %d',
                $id
            ));
        }

        return $row;
    }

    public function getSeasonByAnime($id_anime, $season){

        $id_anime = (int) $id_anime;
        $sqlSelect = $this->tableGateway->getSql()->select();
        $sqlSelect->columns(array('*'));
        $sqlSelect->join('anime', 'season.id_anime = anime.id_anime', array(), 'inner');
        $sqlSelect->where(array('anime.id_anime' => $id_anime));
        $sqlSelect->where(array('season.season' => $season));
        $sqlSelect->order('season.season');
        $rowset = $this->tableGateway->selectWith($sqlSelect);

        $row = $rowset->current();
        if (! $row) {
            throw new RuntimeException(sprintf(
                'Could not find row with identifier %d',
                $id_anime
            ));
        }

        return $row;

       // return $rowset->toArray();
    }
}