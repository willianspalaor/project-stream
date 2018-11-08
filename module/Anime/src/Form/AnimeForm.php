<?php

namespace Anime\Form;

use Zend\Form\Form;

class AnimeForm extends Form
{
	public function __construct($name = null)
	{
		parent::__construct('anime');

		//$this->setAttribute('method', 'GET');

		$this->add([
			'name' => 'id',
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
			'name' => 'submit',
			'type' => 'submit',
			'attributes' => [
				'value' => 'Go',
				'id' => 'submitbutton',
			],
		]);
	}
}