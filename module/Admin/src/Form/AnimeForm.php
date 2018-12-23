<?php

namespace Admin\Form;

use Zend\Form\Element;
use Zend\Form\Form;


class AnimeForm extends Form
{
    public function __construct($genres, $categories, $authors, $name = null)
    {
        parent::__construct('anime');

        $this->add([
            'name' => 'id_anime',
            'type' => 'hidden',
        ]);

        $this->add([
            'name' => 'categories',
            'type' => 'hidden'
        ]);

        $this->add([
            'name' => 'title',
            'type' => 'text',
            'options' => [
                'label' => 'Title',
            ],
        ]);

        $this->add([
            'name' => 'route',
            'type' => 'text',
            'options' => [
                'label' => 'Route',
            ],
        ]);

        $this->add([
            'name' => 'name',
            'type' => 'text',
            'options' => [
                'label' => 'Name',
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
            'name' => 'image',
            'type' => 'file',
            'options' => [
                'label' => 'Image'
            ],
        ]);

        $this->add([
            'name' => 'video',
            'type' => 'file',
            'options' => [
                'label' => 'Video'
            ],
        ]);

        /*$this->add([
            'name' => 'author',
            'type' => 'text',
            'options' => [
                'label' => 'author',
            ],
        ]);*/
        $this->add([
            'name' => 'year',
            'type' => 'number',
            'options' => [
                'label' => 'year',
            ],
        ]);

        $this->add([
            'name' => 'episodes',
            'type' => 'number',
            'options' => [
                'label' => 'episodes',
            ],
        ]);

        $this->add([
            'name' => 'seasons',
            'type' => 'number',
            'options' => [
                'label' => 'seasons',
            ],
        ]);

        $this->add([
            'name' => 'status',
            'type' => 'select',
            'options' => [
                'options' => [
                    '1' => 'Em andamento',
                    '2' => 'Completo',
                    '3' => 'Encerrado'
                ],
                'label' => 'status'
            ],
        ]);

        /*$this->add([
            'name' => 'id_genre',
            'type' => 'select',
            'options' => [
                'options' => $genres,
                'label' => 'Genre'
            ]

        ]);*/

        $this->add([
            'name' => 'category',
            'type' => 'select',
            'options' => [
                'options' => $categories,
                'disable_inarray_validator' => true,
                'label' => 'categories'
            ],
            'attributes' => [
                'multiple' => 'multiple',
                'id' => 'select-category'
            ],
        ]);

        $this->add([
            'name' => 'author',
            'type' => 'select',
            'options' => [
                'options' => $authors,
                'disable_inarray_validator' => true,
                'label' => 'authors'
            ],
            'attributes' => [
                'id' => 'select-author'
            ],
        ]);

        $this->add([
            'name' => 'genre',
            'type' => 'select',
            'options' => [
                'options' => $genres,
                'disable_inarray_validator' => true,
                'label' => 'authors'
            ],
            'attributes' => [
                'id' => 'select-genre'
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
            'name' => 'add-season',
            'type' => 'button',
            'attributes' => [
                'value' => 'Add season',
                'id' => 'btnAddSeason',
            ],
            'options' => [
                'label' => 'Add season'
            ]
        ]);
    }
}