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

class Anime implements InputFilterAwareInterface
{
    public $id_anime;
    public $title;
    public $name;
    public $img;
    public $trailer;
    public $route;
    public $track;
    public $year;
    public $id_author;
    public $episodes;
    public $seasons;
    public $genre;
    public $id_genre;
    public $status;
    public $description;
    public $thumb_up;
    public $thumb_down;

   	private $inputFilter;

    public function exchangeArray(array $data)
    {
        $this->id_anime = !empty($data['id_anime']) ? $data['id_anime'] : null;
        $this->title = !empty($data['title']) ? $data['title'] : null;
        $this->name = !empty($data['name']) ? $data['name'] : null;
        $this->img = !empty($data['img']) ? $data['img'] : null;
        $this->trailer = !empty($data['trailer']) ? $data['trailer'] : null;
        $this->route = !empty($data['route']) ? $data['route'] : null;
        $this->track = !empty($data['track']) ? $data['track'] : null;
        $this->year = !empty($data['year']) ? $data['year'] : null;
        $this->id_author = !empty($data['id_author']) ? $data['id_author'] : null;
        $this->episodes = !empty($data['episodes']) ? $data['episodes'] : null;
        $this->seasons = !empty($data['seasons']) ? $data['seasons'] : null;
        $this->id_genre = !empty($data['id_genre']) ? $data['id_genre'] : null;
        $this->genre = !empty($data['genre']) ? $data['genre'] : null;
        $this->status = !empty($data['status']) ? $data['status'] : null;
        $this->description = !empty($data['description']) ? $data['description'] : null;
        $this->thumb_up = !empty($data['thumb_up']) ? $data['thumb_up'] : null;
        $this->thumb_down = !empty($data['thumb_down']) ? $data['thumb_down'] : null;
    }

    public function getArrayCopy()
    {
        return [
            'id_anime' => $this->id_anime,
            'title' => $this->title,
            'name' => $this->name,
            'img' => $this->img,
            'trailer' => $this->trailer,
            'route' => $this->route,
            'track' => $this->track,
            'year' => $this->year,
            'id_author' => $this->id_author,
            'episodes' => $this->episodes,
            'seasons' => $this->seasons,
            'id_genre' => $this->id_genre,
            'status' => $this->status,
            'description' => $this->description,
            'thumb_up' => $this->thumb_up,
            'thumb_down' => $this->thumb_down
        ];
    }

    public function getData(){

        return [
            'title' => $this->title,
            'name' => $this->name,
            'img' => $this->img,
            'trailer' => $this->trailer,
            'route' => $this->route,
            'track' => $this->track,
            'year' => $this->year,
            'id_author' => $this->id_author,
            'episodes' => $this->episodes,
            'seasons' => $this->seasons,
            'id_genre' => $this->id_genre,
            'status' => $this->status,
            'description' => $this->description,
            'thumb_up' => $this->thumb_up,
            'thumb_down' => $this->thumb_down
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

        $this->inputFilter = $inputFilter;
        return $this->inputFilter;
    }
}