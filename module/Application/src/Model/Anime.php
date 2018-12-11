<?php

namespace Application\Model;

use DomainException;
use Zend\Filter\StringTrim;
use Zend\Filter\StripTags;
use Zend\Filter\ToInt;
use Zend\InputFilter\InputFilter;
use Zend\InputFilter\InputFilterAwareInterface;
use Zend\InputFilter\InputFilterInterface;
use Zend\Validator\StringLength;

class Anime implements InputFilterAwareInterface
{
    public $id;
    public $title;
    public $img;
    public $route;
    public $track;
    public $year;
    public $author;
    public $episodes;
    public $genre;
    public $status;

   	private $inputFilter;

    public function exchangeArray(array $data)
    {
        $this->id = !empty($data['id_anime']) ? $data['id_anime'] : null;
        $this->title = !empty($data['title']) ? $data['title'] : null;
        $this->img = !empty($data['img']) ? $data['img'] : null;
        $this->route = !empty($data['route']) ? $data['route'] : null;
        $this->track = !empty($data['track']) ? $data['track'] : null;
        $this->year = !empty($data['year']) ? $data['year'] : null;
        $this->author = !empty($data['author']) ? $data['author'] : null;
        $this->episodes = !empty($data['episodes']) ? $data['episodes'] : null;
        $this->genre = !empty($data['genre']) ? $data['genre'] : null;
        $this->status = !empty($data['status']) ? $data['status'] : null;
    }

    public function getArrayCopy()
    {
        return [
            'id'      => $this->id,
            'title'   => $this->title,
            'img' => $this->img,
            'route' => $this->route,
            'track' => $this->track,
            'year' => $this->track,
            'author' => $this->track,
            'episodes' => $this->episodes,
            'genre' => $this->genre,
            'status' => $this->status
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
            'name' => 'id_anime',
            'required' => true,
            'filters' => [
                ['name' => ToInt::class],
            ],
        ]);

        $inputFilter->add([
            'name' => 'title',
            'required' => true,
            'filters' => [
                ['name' => StripTags::class],
                ['name' => StringTrim::class],
            ],
            'validators' => [
                [
                    'name' => StringLength::class,
                    'options' => [
                        'encoding' => 'UTF-8',
                        'min' => 1,
                        'max' => 100,
                    ],
                ],
            ],
        ]);

        $this->inputFilter = $inputFilter;
        return $this->inputFilter;
    }
}