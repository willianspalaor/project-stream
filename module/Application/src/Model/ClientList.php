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

class ClientList implements InputFilterAwareInterface
{
    public $id;
    public $id_client;
    public $id_anime;

    private $inputFilter;

    public function exchangeArray(array $data)
    {

        $this->id = !empty($data['id_client_list']) ? $data['id_client_list'] : null;
        $this->id_client = !empty($data['id_client']) ? $data['id_client'] : null;
        $this->id_anime = !empty($data['id_anime']) ? $data['id_anime'] : null;
    }

    public function getArrayCopy()
    {
        return [
            'id' => $this->id,
            'id_client' => $this->id_client,
            'id_anime' => $this->id_anime,

        ];
    }

    public function getData(){

        return[
            'id_client' => $this->id_client,
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
            'name' => 'id_client_list',
            'required' => true,
            'filters' => [
                ['name' => ToInt::class],
            ],
        ]);


        $this->inputFilter = $inputFilter;
        return $this->inputFilter;
    }
}