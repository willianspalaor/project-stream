<?php
/**
 * Created by PhpStorm.
 * User: Willian
 * Date: 03/12/2018
 * Time: 02:55
 */

namespace Admin\Model;

use DomainException;
use Zend\Filter\ToInt;
use Zend\InputFilter\InputFilter;
use Zend\InputFilter\InputFilterAwareInterface;
use Zend\InputFilter\InputFilterInterface;

class ClientEpisode implements InputFilterAwareInterface
{
    public $id_client_episode;
    public $id_client_anime;
    public $id_episode;
    public $progress;

    private $inputFilter;

    public function exchangeArray(array $data)
    {
        $this->id_client_episode = !empty($data['id_client_episode']) ? $data['id_client_episode'] : null;
        $this->id_client_anime = !empty($data['id_client_anime']) ? $data['id_client_anime'] : null;
        $this->id_episode = !empty($data['id_episode']) ? $data['id_episode'] : null;
        $this->progress = !empty($data['progress']) ? $data['progress'] : null;

    }

    public function getArrayCopy()
    {
        return [
            'id_client_episode' => $this->id_client_episode,
            'id_client_anime' => $this->id_client_anime,
            'id_episode' => $this->id_episode,
            'progress' => $this->progress
        ];
    }

    public function getData(){

        return [
            'id_client_anime' => $this->id_client_anime,
            'id_episode' => $this->id_episode,
            'progress' => $this->progress
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
            'name' => 'id_client_episode',
            'required' => true,
            'filters' => [
                ['name' => ToInt::class],
            ],
        ]);

        $this->inputFilter = $inputFilter;
        return $this->inputFilter;
    }
}