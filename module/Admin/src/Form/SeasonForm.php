<?php

namespace Admin\Form;

use Zend\Form\Form;


class SeasonForm extends Form
{
    public function __construct($name = null)
    {
        parent::__construct('season');

        $this->add([
            'name' => 'id_season',
            'type' => 'hidden',
        ]);

        $this->add([
            'name' => 'season',
            'type' => 'number',
            'options' => [
                'label' => 'Season',
            ],
        ]);

        $this->add([
            'name' => 'episodes',
            'type' => 'number',
            'options' => [
                'label' => 'Episodes',
            ],
        ]);

        $this->add([
            'name' => 'submit',
            'type' => 'submit',
            'attributes' => [
                'value' => 'Go',
                'id' => 'submitbutton',
            ],
        ]);

        $this->add([
            'name' => 'add-episode',
            'type' => 'button',
            'attributes' => [
                'value' => 'Add episode',
                'id' => 'btnAddEpisode',
            ],
            'options' => [
                'label' => 'Add episode'
            ]
        ]);

    }
}