<?php

namespace Anime\Model;

use RuntimeException;
use Zend\Db\TableGateway\TableGatewayInterface;

class AnimeTable
{
    private $tableGateway;

    public function __construct(TableGatewayInterface $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    public function fetchAll()
    {
        return $this->tableGateway->select();
    }

    public function getAnime($id)
    {
        $id = (int) $id;
        $rowset = $this->tableGateway->select(['id' => $id]);
        $row = $rowset->current();
        if (! $row) {
            throw new RuntimeException(sprintf(
                'Could not find row with identifier %d',
                $id
            ));
        }

        return $row;
    }

    public function saveAnime(Anime $anime)
    {
        $data = [
            'title'  => $anime->title,
        ];

        $id = (int) $anime->id;

        if ($id === 0) {
            $this->tableGateway->insert($data);
            return;
        }

        if (! $this->getAnime($id)) {
            throw new RuntimeException(sprintf(
                'Cannot update anime with identifier %d; does not exist',
                $id
            ));
        }

        $this->tableGateway->update($data, ['id' => $id]);
    }

    public function deleteAnime($id)
    {
        $this->tableGateway->delete(['id' => (int) $id]);
    }
}