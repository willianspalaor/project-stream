<?php

namespace Application;

use Zend\Db\Adapter\AdapterInterface;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\TableGateway\TableGateway;
use Zend\ModuleManager\Feature\ConfigProviderInterface;

class Module implements ConfigProviderInterface
{

    const VERSION = '3.0.3-dev';

    public function __construct()
    {
    }

    public function getConfig()
    {
        return include __DIR__ . '/../config/module.config.php';
    }

       // Add this method:
    public function getServiceConfig()
    {
        return [
            'factories' => [
                Model\AnimeTable::class => function($container) {
                    $tableGateway = $container->get(Model\AnimeTableGateway::class);
                    return new Model\AnimeTable($tableGateway);
                },
                Model\AnimeTableGateway::class => function ($container) {
                    $dbAdapter = $container->get(AdapterInterface::class);
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Model\Anime());
                    return new TableGateway('anime', $dbAdapter, null, $resultSetPrototype);
                },
                Model\EpisodeTable::class => function($container) {
                    $tableGateway = $container->get(Model\EpisodeTableGateway::class);
                    return new Model\EpisodeTable($tableGateway);
                },
                Model\EpisodeTableGateway::class => function ($container) {
                    $dbAdapter = $container->get(AdapterInterface::class);
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Model\Episode());
                    return new TableGateway('episode', $dbAdapter, null, $resultSetPrototype);
                },
                Model\SeasonTable::class => function($container) {
                    $tableGateway = $container->get(Model\SeasonTableGateway::class);
                    return new Model\SeasonTable($tableGateway);
                },
                Model\SeasonTableGateway::class => function ($container) {
                    $dbAdapter = $container->get(AdapterInterface::class);
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Model\Season());
                    return new TableGateway('season', $dbAdapter, null, $resultSetPrototype);
                },
                Model\VideoTable::class => function($container) {
                    $tableGateway = $container->get(Model\VideoTableGateway::class);
                    return new Model\VideoTable($tableGateway);
                },
                Model\VideoTableGateway::class => function ($container) {
                    $dbAdapter = $container->get(AdapterInterface::class);
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Model\Video());
                    return new TableGateway('video', $dbAdapter, null, $resultSetPrototype);
                },
                Model\ClientTable::class => function($container) {
                    $tableGateway = $container->get(Model\ClientTableGateway::class);
                    return new Model\ClientTable($tableGateway);
                },
                Model\ClientTableGateway::class => function ($container) {
                    $dbAdapter = $container->get(AdapterInterface::class);
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Model\Client());
                    return new TableGateway('client', $dbAdapter, null, $resultSetPrototype);
                },
                Model\ClientAnimeTable::class => function($container) {
                    $tableGateway = $container->get(Model\ClientAnimeTableGateway::class);
                    return new Model\ClientAnimeTable($tableGateway);
                },
                Model\ClientAnimeTableGateway::class => function ($container) {
                    $dbAdapter = $container->get(AdapterInterface::class);
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Model\ClientAnime());
                    return new TableGateway('client_anime', $dbAdapter, null, $resultSetPrototype);
                },
                Model\ClientEpisodeTable::class => function($container) {
                    $tableGateway = $container->get(Model\ClientEpisodeTableGateway::class);
                    return new Model\ClientEpisodeTable($tableGateway);
                },
                Model\ClientEpisodeTableGateway::class => function ($container) {
                    $dbAdapter = $container->get(AdapterInterface::class);
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Model\ClientEpisode());
                    return new TableGateway('client_episode', $dbAdapter, null, $resultSetPrototype);
                },
                Model\CategoryTable::class => function($container) {
                    $tableGateway = $container->get(Model\CategoryTableGateway::class);
                    return new Model\CategoryTable($tableGateway);
                },
                Model\CategoryTableGateway::class => function ($container) {
                    $dbAdapter = $container->get(AdapterInterface::class);
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Model\Category());
                    return new TableGateway('category', $dbAdapter, null, $resultSetPrototype);
                },
                Model\ClientListTable::class => function($container) {
                    $tableGateway = $container->get(Model\ClientListTableGateway::class);
                    return new Model\ClientListTable($tableGateway);
                },
                Model\ClientListTableGateway::class => function ($container) {
                    $dbAdapter = $container->get(AdapterInterface::class);
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Model\ClientList());
                    return new TableGateway('client_list', $dbAdapter, null, $resultSetPrototype);
                },

            ],
        ];
    }

    public function getControllerConfig()
    {
        return [
            'factories' => [

                Controller\IndexController::class => function($container) {
                    return new Controller\IndexController(
                        $container->get(Model\AnimeTable::class),
                        $container->get(Model\SeasonTable::class),
                        $container->get(Model\EpisodeTable::class),
                        $container->get(Model\VideoTable::class),
                        $container->get(Model\ClientTable::class),
                        $container->get(Model\ClientAnimeTable::class),
                        $container->get(Model\ClientEpisodeTable::class),
                        $container->get(Model\CategoryTable::class),
                        $container->get(Model\ClientListTable::class)
                    );
                },
                Controller\AnimeController::class => function($container) {
                     return new Controller\AnimeController(
                        $container->get(Model\AnimeTable::class),
                        $container->get(Model\SeasonTable::class),
                        $container->get(Model\EpisodeTable::class),
                        $container->get(Model\VideoTable::class),
                        $container->get(Model\ClientTable::class),
                        $container->get(Model\ClientAnimeTable::class),
                        $container->get(Model\ClientEpisodeTable::class),
                         $container->get(Model\CategoryTable::class),
                         $container->get(Model\ClientListTable::class)
                    );
                },
                Controller\PlayerController::class => function($container) {
                    return new Controller\PlayerController(
                        $container->get(Model\AnimeTable::class),
                        $container->get(Model\SeasonTable::class),
                        $container->get(Model\EpisodeTable::class),
                        $container->get(Model\VideoTable::class),
                        $container->get(Model\ClientTable::class),
                        $container->get(Model\ClientAnimeTable::class),
                        $container->get(Model\ClientEpisodeTable::class),
                        $container->get(Model\CategoryTable::class),
                        $container->get(Model\ClientListTable::class)
                    );
                },
            ],
        ];
    }
}