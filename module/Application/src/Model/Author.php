<?php
/**
 * Created by PhpStorm.
 * User: Willian
 * Date: 07/12/2018
 * Time: 14:54
 */

namespace Application\Model;

use DomainException;
use Zend\Filter\ToInt;
use Zend\InputFilter\InputFilter;
use Zend\InputFilter\InputFilterAwareInterface;
use Zend\InputFilter\InputFilterInterface;

class Author implements InputFilterAwareInterface
{

    public $id;
    public $name;

    private $inputFilter;

    public function exchangeArray(array $data)
    {
        $this->id = !empty($data['id_author']) ? $data['id_author'] : null;
        $this->name = !empty($data['name']) ? $data['name'] : null;
    }

    public function getArrayCopy()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
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