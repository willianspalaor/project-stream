<?php

namespace Admin\Form;

use Zend\Form\Form;


class VideoForm extends Form
{
    public function __construct($name = null)
    {
        parent::__construct('video');

        $this->add([
            'name' => 'id_video',
            'type' => 'hidden',
        ]);

        $this->add([
            'name' => 'server',
            'type' => 'text',
            'options' => [
                'label' => 'Server',
            ],
        ]);

        $this->add([
            'name' => 'url',
            'type' => 'text',
            'options' => [
                'label' => 'Url',
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

    }
}