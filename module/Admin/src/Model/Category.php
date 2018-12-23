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

class Category implements InputFilterAwareInterface
{
    public $id_category;
    public $title;
    public $key;
    public $order;

    private $inputFilter;

    public function exchangeArray(array $data)
    {
        $this->id_category = !empty($data['id_category']) ? $data['id_category'] : null;
        $this->title = !empty($data['title']) ? $data['title'] : null;
        $this->key = !empty($data['key']) ? $data['key'] : null;
        $this->order = !empty($data['order']) ? $data['order'] : null;
    }

    public function getArrayCopy()
    {
        return [
            'id_category' => $this->id_category,
            'title' => $this->title,
            'key' => $this->key,
            'order' => $this->order,
        ];
    }

    public function getData(){

        return [
            'title' => $this->title,
            'key' => $this->key,
            'order' => $this->order,
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
            'name' => 'id_category',
            'required' => true,
            'filters' => [
                ['name' => ToInt::class],
            ],
        ]);

        $this->inputFilter = $inputFilter;
        return $this->inputFilter;
    }
}