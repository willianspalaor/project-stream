<?php
/**
 * Created by PhpStorm.
 * User: Willian
 * Date: 19/12/2018
 * Time: 13:54
 */

namespace Admin\Model;

use DomainException;
use Zend\Filter\ToInt;
use Zend\InputFilter\InputFilter;
use Zend\InputFilter\InputFilterAwareInterface;
use Zend\InputFilter\InputFilterInterface;

class Video implements InputFilterAwareInterface
{

    public $id_video;
    public $id_episode;
    public $server;
    public $url;
    public $status;
    public $token;

    private $inputFilter;

    public function exchangeArray(array $data)
    {
        $this->id_video = !empty($data['id_video']) ? $data['id_video'] : null;
        $this->id_episode = !empty($data['id_episode']) ? $data['id_episode'] : null;
        $this->server = !empty($data['server']) ? $data['server'] : null;
        $this->url = !empty($data['url']) ? $data['url'] : null;
        $this->status = !empty($data['status']) ? $data['status'] : null;
        $this->token = !empty($data['token']) ? $data['token'] : null;
    }

    public function getArrayCopy()
    {
        return [
            'id_video' => $this->id_video,
            'id_episode' => $this->id_episode,
            'server' => $this->server,
            'url' => $this->url,
            'status' => $this->status,
            'token' => $this->token
        ];
    }

    public function getData()
    {
        return [
            'id_episode' => $this->id_episode,
            'server' => $this->server,
            'url' => $this->url,
            'status' => $this->status,
            'token' => $this->token
        ];
    }

    public function setInputFilter(InputFilterInterface $inputFilter)
    {
        throw new DomainException(sprintf(
            '%s does not allow injection of an alternate input filter',
            __CLASS__
        ));
    }

    public function getInputFilter()
    {
        if ($this->inputFilter) {
            return $this->inputFilter;
        }

        $inputFilter = new InputFilter();

        $inputFilter->add([
            'name' => 'id_video',
            'required' => true,
            'filters' => [
                ['name' => ToInt::class],
            ],
        ]);

        $this->inputFilter = $inputFilter;
        return $this->inputFilter;
    }


}