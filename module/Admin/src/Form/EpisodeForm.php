<?php

namespace Admin\Form;

use Zend\Form\Form;
use Zend\Form\Element;


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

        /*$this->add([
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
            'name' => 'resume_end',
            'type' => 'number',
            'options' => [
                'label' => 'Resume end',
            ],
        ]);

        $this->add([
            'name' => 'end_start',
            'type' => 'number',
            'options' => [
                'label' => 'Ending start',
            ],
        ]);*/

        // open start
        $open_start = new Element\Time('open_start');
        $open_start->setLabel('open_start');
        $open_start->setAttributes([
            'min'  => '00:00:00',
            'step' => '1',
        ]);
        $open_start->setOptions([
            'format' => 'H:i:s',
        ]);
        $this->add($open_start);

        // open end
        $open_end = new Element\Time('open_end');
        $open_end->setLabel('open_end');
        $open_end->setAttributes([
            'min'  => '00:00:00',
            'step' => '1',
        ]);
        $open_end->setOptions([
            'format' => 'H:i:s',
        ]);
        $this->add($open_end);

        //resume start
        $resume_start = new Element\Time('resume_start');
        $resume_start->setLabel('resume_start');
        $resume_start->setAttributes([
            'min'  => '00:00:00',
            'step' => '1',
        ]);
        $resume_start->setOptions([
            'format' => 'H:i:s',
        ]);
        $this->add($resume_start);


        //resume end
        $resume_end = new Element\Time('resume_end');
        $resume_end->setLabel('resume_end');
        $resume_end->setAttributes([
            'min'  => '00:00:00',
            'step' => '1',
        ]);
        $resume_end->setOptions([
            'format' => 'H:i:s',
        ]);
        $this->add($resume_end);

        //end start
        $end_start = new Element\Time('end_start');
        $end_start->setLabel('end_start');
        $end_start->setAttributes([
            'min'  => '00:00:00',
            'step' => '1',
        ]);
        $end_start->setOptions([
            'format' => 'H:i:s',
        ]);
        $this->add($end_start);

    /*   $time2 = new Element\Time('open_end');
        $time2->setLabel('open_end');
        $time2->setAttributes([
            'min'  => '00:00',
            'step' => '10',
        ]);
        $time2->setOptions([
            'format' => 'i:s',
        ]);
        $this->add($time2);

        $time3 = new Element\Time('resume_start');
        $time3->setLabel('resume_start');
        $time3->setAttributes([
            'min'  => '00:00',
            'step' => '10',
        ]);
        $time3->setOptions([
            'format' => 'i:s',
        ]);
        $this->add($time3);


        $time4 = new Element\Time('resume_end');
        $time4->setLabel('resume_end');
        $time4->setAttributes([
            'min'  => '00:00',
            'step' => '10',
        ]);
        $time4->setOptions([
            'format' => 'i:s',
        ]);
        $this->add($time4);

        $time5 = new Element\Time('end_start');
        $time5->setLabel('end_start');
        $time5->setAttributes([
            'min'  => '00:00',
            'step' => '10',
        ]);
        $time5->setOptions([
            'format' => 'i:s',
        ]);
        $this->add($time5);*/


        $this->add([
            'name' => 'submit',
            'type' => 'submit',
            'attributes' => [
                'value' => 'Go',
                'id' => 'submitbutton',
            ],
        ]);

        $this->add([
            'name' => 'key',
            'type' => 'text',
            'options' => [
                'label' => 'Key',
            ],
        ]);

        $this->add([
            'name' => 'image',
            'type' => 'file',
            'options' => [
                'label' => 'Image'
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