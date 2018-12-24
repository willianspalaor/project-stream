<?php
/**
 * Created by PhpStorm.
 * User: Willian
 * Date: 07/11/2018
 * Time: 16:23
 */

namespace Admin\Model;

use DomainException;
use Zend\Filter\ToInt;
use Zend\InputFilter\InputFilter;
use Zend\InputFilter\InputFilterAwareInterface;
use Zend\InputFilter\InputFilterInterface;

class Episode implements InputFilterAwareInterface
{
    public $id_episode;
    public $id_season;
    public $episode;
    public $open_start;
    public $open_end;
    public $end_start;
    public $title;
    public $description;
    public $track;
    public $thumb;
    public $key;

    private $inputFilter;

    public function exchangeArray(array $data)
    {
        $this->id_episode = !empty($data['id_episode']) ? $data['id_episode'] : null;
        $this->id_season = !empty($data['id_season']) ? $data['id_season'] : null;
        $this->episode = !empty($data['episode']) ? $data['episode'] : null;
        $this->open_start = !empty($data['open_start']) ? $data['open_start'] : null;
        $this->open_end = !empty($data['open_end']) ? $data['open_end'] : null;
        $this->end_start = !empty($data['end_start']) ? $data['end_start'] : null;
        $this->title = !empty($data['title']) ? $data['title'] : null;
        $this->description = !empty($data['description']) ? $data['description'] : null;
        $this->track = !empty($data['track']) ? $data['track'] : null;
        $this->thumb = !empty($data['thumb']) ? $data['thumb'] : null;
        $this->key = !empty($data['key']) ? $data['key'] : null;
    }

    public function getArrayCopy()
    {
        return [
            'id_episode' => $this->id_episode,
            'id_season' => $this->id_season,
            'episode' => $this->episode,
            'open_start' => $this->open_start,
            'open_end' => $this->open_end,
            'end_start' => $this->end_start,
            'title' => $this->title,
            'description' => $this->description,
            'track' => $this->track,
            'thumb' => $this->thumb,
            'key' => $this->key
        ];
    }

    public function getData(){
        return [
            'id_season' => $this->id_season,
            'episode' => $this->episode,
            'open_start' => $this->open_start,
            'open_end' => $this->open_end,
            'end_start' => $this->end_start,
            'title' => $this->title,
            'description' => $this->description,
            'track' => $this->track,
            'thumb' => $this->thumb,
            'key' => $this->key
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
            'name' => 'id_episode',
            'required' => true,
            'filters' => [
                ['name' => ToInt::class],
            ],
        ]);

        $this->inputFilter = $inputFilter;
        return $this->inputFilter;
    }
}