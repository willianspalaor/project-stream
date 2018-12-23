<?php

namespace Admin\Model;

use DomainException;
use Zend\Filter\StringTrim;
use Zend\Filter\StripTags;
use Zend\Filter\ToInt;
use Zend\InputFilter\InputFilter;
use Zend\InputFilter\InputFilterAwareInterface;
use Zend\InputFilter\InputFilterInterface;
use Zend\Validator\StringLength;

class AnimeCategory implements InputFilterAwareInterface
{
    public $id_anime_category;
    public $id_anime;
    public $id_category;

    private $inputFilter;

    public function exchangeArray(array $data)
    {
        $this->id_anime_category = !empty($data['id_anime_category']) ? $data['id_anime_category'] : null;
        $this->id_anime = !empty($data['id_anime']) ? $data['id_anime'] : null;
        $this->id_category = !empty($data['id_category']) ? $data['id_category'] : null;
    }

    public function getArrayCopy()
    {
        return [
            'id_anime_category' => $this->id_anime_category,
            'id_anime' => $this->id_anime,
            'id_category' => $this->id_category
        ];
    }

    public function getData(){

        return [
            'id_anime' => $this->id_anime,
            'id_category' => $this->id_category,
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
            'name' => 'id_anime_category',
            'required' => true,
            'filters' => [
                ['name' => ToInt::class],
            ],
        ]);

        $this->inputFilter = $inputFilter;
        return $this->inputFilter;
    }
}