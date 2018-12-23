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

class Author implements InputFilterAwareInterface
{
    public $id_author;
    public $name;

    private $inputFilter;

    public function exchangeArray(array $data)
    {
        $this->id_author = !empty($data['id_author']) ? $data['id_author'] : null;
        $this->name = !empty($data['name']) ? $data['name'] : null;
    }

    public function getArrayCopy()
    {
        return [
            'id_author' => $this->id_author,
            'name' => $this->name
        ];
    }

    public function getData(){

        return [
            'name' => $this->name
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
            'name' => 'id_author',
            'required' => true,
            'filters' => [
                ['name' => ToInt::class],
            ],
        ]);

        $this->inputFilter = $inputFilter;
        return $this->inputFilter;
    }
}