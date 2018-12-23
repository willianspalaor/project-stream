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

class Genre implements InputFilterAwareInterface
{
    public $id_genre;
    public $title;

    private $inputFilter;

    public function exchangeArray(array $data)
    {
        $this->id_genre = !empty($data['id_genre']) ? $data['id_genre'] : null;
        $this->title = !empty($data['title']) ? $data['title'] : null;
    }

    public function getArrayCopy()
    {
        return [
            'id_genre' => $this->id_genre,
            'title' => $this->title,
        ];
    }

    public function getData(){

        return [
            'title' => $this->title,
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
            'name' => 'id_genre',
            'required' => true,
            'filters' => [
                ['name' => ToInt::class],
            ],
        ]);

        $this->inputFilter = $inputFilter;
        return $this->inputFilter;
    }
}