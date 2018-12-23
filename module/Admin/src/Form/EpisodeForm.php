<?php

namespace Admin\Form;

use Zend\Form\Form;


class EpisodeForm extends Form
{
    public function __construct($name = null)
    {
        parent::__construct('episode');

        $this->add([
            'name' => 'id_episode',
            'type' => 'hidden',
        ]);

        $this->add([
            'name' => 'title',
            'type' => 'text',
            'options' => [
                'label' => 'Title',
            ],
        ]);

        $this->add([
            'name' => 'description',
            'type' => 'text',
            'options' => [
                'label' => 'Description',
            ],
        ]);

        $this->add([
            'name' => 'episode',
            'type' => 'number',
            'options' => [
                'label' => 'Episode',
            ],
        ]);

        $this->add([
            'name' => 'open_start',
            'type' => 'number',
            'options' => [
                'label' => 'Opening start',
            ],
        ]);

        $this->add([
            'name' => 'open_end',
            'type' => 'number',
            'options' => [
                'label' => 'Opening end',
            ],
        ]);

        $this->add([
            'name' => 'end_start',
            'type' => 'number',
            'options' => [
                'label' => 'Ending start',
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
            'name' => 'add-video',
            'type' => 'button',
            'attributes' => [
                'value' => 'Add video',
                'id' => 'btnAddVideo',
            ],
            'options' => [
                'label' => 'Add video'
            ]
        ]);

    }
}