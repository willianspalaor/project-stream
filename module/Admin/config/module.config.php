<?php

namespace Admin;

use Zend\Router\Http\Segment;
use Zend\Router\Http\Literal;
use Zend\Router\Http\TreeRouteStack;

return [

    'router' => [
        'router_class' => TreeRouteStack::class,
        'routes' => [
            'admin' => [
                'type'    => Literal::class,
                'options' => [
                    'route' => '/admin',
                    'defaults' => [
                        'controller' => Controller\IndexController::class,
                        'action'     => 'index',
                    ],
                ],
                'may_terminate' => true,
                'child_routes' => [
                    'login' => [
                        'type' => Segment::Class,
                        'options' => [
                            'route' => '/login',
                            'defaults' => [
                                'controller' => Controller\IndexController::class,
                                'action'     => 'login',
                            ],
                        ],
                    ],
                    'logout' => [
                        'type' => Segment::Class,
                        'options' => [
                            'route' => '/logout',
                            'defaults' => [
                                'controller' => Controller\IndexController::class,
                                'action'     => 'logout',
                            ],
                        ],
                    ],
                    'anime' => [
                        'type' => Segment::Class,
                        'options' => [
                            'route' => '/anime[/:action[/:id]]',
                            'constraints' => [
                                'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                                'id'     => '[0-9]+',
                            ],
                            'defaults' => [
                                'controller' => Controller\AnimeController::class,
                                'action'     => 'index',
                            ],
                        ],
                    ],
                    'season' => [
                        'type' => Segment::Class,
                        'options' => [
                            'route' => '/season[/:action[/:id]][/:id_anime]',
                            'constraints' => [
                                'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                                'id'     => '[0-9]+',
                            ],
                            'defaults' => [
                                'controller' => Controller\SeasonController::class,
                                'action'     => 'index',
                            ],
                        ],
                    ],
                    'episode' => [
                        'type' => Segment::Class,
                        'options' => [
                            'route' => '/episode[/:action[/:id]][/:id_season]',
                            'constraints' => [
                                'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                                'id'     => '[0-9]+',
                            ],
                            'defaults' => [
                                'controller' => Controller\EpisodeController::class,
                                'action'     => 'index',
                            ],
                        ],
                    ],
                    'video' => [
                        'type' => Segment::Class,
                        'options' => [
                            'route' => '/video[/:action[/:id]][/:id_episode]',
                            'constraints' => [
                                'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                                'id'     => '[0-9]+',
                            ],
                            'defaults' => [
                                'controller' => Controller\VideoController::class,
                                'action'     => 'index',
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],

    'view_manager' => [
        'template_path_stack' => [
            'admin' => __DIR__ . '/../view',
        ],
    ],
];