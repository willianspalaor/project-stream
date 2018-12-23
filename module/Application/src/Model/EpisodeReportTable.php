<?php

namespace Application\Model;

use RuntimeException;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\Sql\Select;
use Zend\Db\TableGateway\TableGatewayInterface;
use Zend\Paginator\Adapter\DbSelect;
use Zend\Paginator\Paginator;

class EpisodeReportTable
{
    private $tableGateway;

    public function __construct(TableGatewayInterface $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    public function fetchAll($paginated = false, $params = [])
    {
        if ($paginated) {
            $select = new Select($this->tableGateway->getTable());
            return $this->fetchPaginatedResults($select);
        }

        return $this->tableGateway->select()->toArray();
    }

    private function fetchPaginatedResults($select)
    {
        $resultSetPrototype = new ResultSet();
        $resultSetPrototype->setArrayObjectPrototype(new EpisodeReport());

        $paginatorAdapter = new DbSelect(
            $select,
            $this->tableGateway->getAdapter(),
            $resultSetPrototype
        );

        $paginator = new Paginator($paginatorAdapter);
        return $paginator;
    }

    public function getEpisodeReport($id)
    {
        $rowset = $this->tableGateway->select(['id_episode_report' => $id]);
        $row = $rowset->current();
        if (! $row) {
            throw new RuntimeException(sprintf(
                'Could not find row with identifier %d',
                $id
            ));
        }

        return $row;
    }

    public function getEpisodeReportByAnime($id_anime, $id_episode)
    {
        $id_anime = (int)$id_anime;
        $id_episode = (int)$id_episode;

        $sqlSelect = $this->tableGateway->getSql()->select();
        $sqlSelect->columns(array('*'));
        $sqlSelect->where(array('id_anime' => $id_anime));
        $sqlSelect->where(array('id_episode' => $id_episode));
        $rowset = $this->tableGateway->selectWith($sqlSelect);
        return $rowset->current();
    }

    public function saveEpisodeReport(EpisodeReport $report)
    {
        $id = (int) $report->id;

        if ($id === 0) {
            $this->tableGateway->insert($report->getData());
            return;
        }

        $this->tableGateway->update($report->getData(), ['id_episode_report' => $id]);
    }
}