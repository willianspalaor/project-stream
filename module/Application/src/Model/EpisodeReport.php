<?php
/**
 * Created by PhpStorm.
 * User: Willian
 * Date: 13/12/2018
 * Time: 17:51
 */

namespace Application\Model;

use DomainException;
use Zend\Filter\StringTrim;
use Zend\Filter\StripTags;
use Zend\Filter\ToInt;
use Zend\InputFilter\InputFilter;
use Zend\InputFilter\InputFilterAwareInterface;
use Zend\InputFilter\InputFilterInterface;
use Zend\Validator\StringLength;

class EpisodeReport implements InputFilterAwareInterface
{
    public $id;
    public $id_episode;
    public $id_anime;

    private $inputFilter;

    public function exchangeArray(array $data)
    {

        $this->id = !empty($data['id_episode_report']) ? $data['id_episode_report'] : null;
        $this->id_episode = !empty($data['id_episode']) ? $data['id_episode'] : null;
        $this->id_anime = !empty($data['id_anime']) ? $data['id_anime'] : null;
    }

    public function getArrayCopy()
    {
        return [
            'id' => $this->id,
            'id_episode' => $this->id_episode,
            'id_anime' => $this->id_anime,

        ];
    }

    public function getData(){

        return[
            'id_episode' => $this->id_episode,
            'id_anime' => $this->id_anime
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
            'name' => 'id_episode_report',
            'required' => true,
            'filters' => [
                ['name' => ToInt::class],
            ],
        ]);


        $this->inputFilter = $inputFilter;
        return $this->inputFilter;
    }
}