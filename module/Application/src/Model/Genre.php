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

class Genre implements InputFilterAwareInterface
{

    public $id;
    public $title;

    private $inputFilter;

    public function exchangeArray(array $data)
    {
        $this->id = !empty($data['id_genre']) ? $data['id_genre'] : null;
        $this->title = !empty($data['title']) ? $data['title'] : null;
    }

    public function getArrayCopy()
    {
        return [
            'id' => $this->id,
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