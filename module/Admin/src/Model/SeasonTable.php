<?php
/**
 * Created by PhpStorm.
 * User: Willian
 * Date: 07/11/2018
 * Time: 16:57
 */

namespace Admin\Model;


use RuntimeException;
use Zend\Db\TableGateway\TableGatewayInterface;
use Zend\Db\Sql\Expression;

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

    public function getSeasonByAnime($id_anime, $season = null){

        $id_anime = (int) $id_anime;
        $sqlSelect = $this->tableGateway->getSql()->select();
        $sqlSelect->columns(array('*'));
        $sqlSelect->join('anime', 'season.id_anime = anime.id_anime', array(), 'inner');
        $sqlSelect->where(array('season.id_anime' => $id_anime));

        if($season != null){
            $sqlSelect->where(array('season.season' => $season));
        }

        $rowset = $this->tableGateway->selectWith($sqlSelect);
        $rows = [];

        foreach ($rowset as $key => $value) {
            $rows[(int)$key] = $value;
        }

        return $rows;

    }

    public function saveSeason(Season $season)
    {
        $id = (int) $season->id_season;

        if ($id === 0) {
            $this->tableGateway->insert($season->getArrayCopy());
            return;
        }

        $data = $season->getData();
        $this->tableGateway->update($data, ['id_season' => $id]);
    }

    public function deleteSeason($id)
    {
        $this->tableGateway->delete(['id_season' => (int) $id]);
    }

    public function deleteSeasonsAnime($id){
        $this->tableGateway->delete(['id_anime' => (int) $id]);
    }


}