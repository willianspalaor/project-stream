<?php
/**
 * Created by PhpStorm.
 * User: Willian
 * Date: 07/11/2018
 * Time: 16:23
 */

namespace Application\Model;

use DomainException;
use Zend\Filter\ToInt;
use Zend\InputFilter\InputFilter;
use Zend\InputFilter\InputFilterAwareInterface;
use Zend\InputFilter\InputFilterInterface;

class Season implements InputFilterAwareInterface
{
    public $id;
    public $id_anime;
    public $season;
    public $episodes;

    private $inputFilter;

    public function exchangeArray(array $data)
    {
        $this->id = !empty($data['id_season']) ? (int)$data['id_season'] : null;
        $this->id_anime = !empty($data['id_anime']) ? (int)$data['id_anime'] : null;
        $this->season = !empty($data['season']) ? (int)$data['season'] : null;
        $this->episodes = !empty($data['episodes']) ? (int)$data['episodes'] : null;
    }

    public function getArrayCopy()
    {
        return [
            'id'       => $this->id,
            'id_anime' => $this->id_anime,
            'season'   => $this->season,
            'episodes' => $this->episodes
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
            'name' => 'id_season',
            'required' => true,
            'filters' => [
                ['name' => ToInt::class],
            ],
        ]);

        $this->inputFilter = $inputFilter;
        return $this->inputFilter;
    }

}