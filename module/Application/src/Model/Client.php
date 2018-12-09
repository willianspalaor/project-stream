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

class Client implements InputFilterAwareInterface
{
    public $id;
    public $ip_address;

    private $inputFilter;

    public function exchangeArray(array $data)
    {
        $this->id = !empty($data['id_client']) ? $data['id_client'] : null;
        $this->ip_address = !empty($data['ip_address']) ? $data['ip_address'] : null;

    }

    public function getArrayCopy()
    {
        return [
            'id' => $this->id,
            'ip_address' => $this->ip_address,
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
            'name' => 'id_client',
            'required' => true,
            'filters' => [
                ['name' => ToInt::class],
            ],
        ]);

        $this->inputFilter = $inputFilter;
        return $this->inputFilter;
    }
}