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

class Admin implements InputFilterAwareInterface
{
    public $id_admin;
    public $user;
    public $password;

    private $inputFilter;

    public function exchangeArray(array $data)
    {
        $this->id_admin = !empty($data['id_admin']) ? $data['id_admin'] : null;
        $this->user = !empty($data['user']) ? $data['user'] : null;
        $this->password = !empty($data['password']) ? $data['password'] : null;
    }

    public function getArrayCopy()
    {
        return [
            'id_admin' => $this->id_admin,
            'user' => $this->user,
            'password' => $this->password,
        ];
    }

    public function getData(){

        return [
            'user' => $this->user,
            'password' => $this->password,
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
            'name' => 'id_admin',
            'required' => true,
            'filters' => [
                ['name' => ToInt::class],
            ],
        ]);

        $this->inputFilter = $inputFilter;
        return $this->inputFilter;
    }
}