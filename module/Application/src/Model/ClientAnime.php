<?php
/**
 * Created by PhpStorm.
 * User: Willian
 * Date: 03/12/2018
 * Time: 02:55
 */

namespace Application\Model;

use DomainException;
use Zend\Filter\ToInt;
use Zend\InputFilter\InputFilter;
use Zend\InputFilter\InputFilterAwareInterface;
use Zend\InputFilter\InputFilterInterface;

class ClientAnime implements InputFilterAwareInterface
{
    public $id;
    public $id_anime;
    public $id_client;
    public $current_season;
    public $current_episode;

    private $inputFilter;

    public function exchangeArray(array $data)
    {
        $this->id = !empty($data['id_client_anime']) ? $data['id_client_anime'] : null;
        $this->id_anime = !empty($data['id_anime']) ? $data['id_anime'] : null;
        $this->id_client = !empty($data['id_client']) ? $data['id_client'] : null;
        $this->current_season = !empty($data['current_season']) ? $data['current_season'] : null;
        $this->current_episode = !empty($data['current_episode']) ? $data['current_episode'] : null;
    }

    public function getArrayCopy()
    {
        return [
            'id_client_anime' => $this->id,
            'id_anime' => $this->id_anime,
            'id_client' => $this->id_client,
            'current_season' => $this->current_season,
            'current_episode' => $this->current_episode
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
            'name' => 'id_client_anime',
            'required' => true,
            'filters' => [
                ['name' => ToInt::class],
            ],
        ]);

        $this->inputFilter = $inputFilter;
        return $this->inputFilter;
    }
}