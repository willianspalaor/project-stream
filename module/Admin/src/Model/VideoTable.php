<?php
/**
 * Created by PhpStorm.
 * User: Willian
 * Date: 19/12/2018
 * Time: 13:55
 */

namespace Admin\Model;


use RuntimeException;
use Zend\Db\TableGateway\TableGatewayInterface;

class VideoTable
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

    public function getVideo($id)
    {
        $id = (int) $id;
        $rowset = $this->tableGateway->select(['id_video' => $id]);
        $row = $rowset->current();

        if (! $row) {
            throw new RuntimeException(sprintf(
                'Could not find row with identifier %d',
                $id
            ));
        }

        return $row;
    }

    public function getVideosByEpisode($id_episode)
    {
        $id_episode = (int) $id_episode;
        $sqlSelect = $this->tableGateway->getSql()->select();
        $sqlSelect->columns(array('*'));
        $sqlSelect->where(array('video.id_episode' => $id_episode));
        $sqlSelect->order('video.server');
        $rowset = $this->tableGateway->selectWith($sqlSelect);
        $rows = [];

        foreach ($rowset as $key => $value) {
            $rows[(int)$key] = $value;
        }

        return $rows;
    }

    public function saveVideo(Video $video)
    {
        $id = (int) $video->id_video;

        if ($id === 0) {
            $this->tableGateway->insert($video->getArrayCopy());
            return;
        }

        $data = $video->getData();
        $this->tableGateway->update($data, ['id_video' => $id]);
    }

    public function deleteVideo($id)
    {
        $this->tableGateway->delete(['id_video' => (int) $id]);
    }

}