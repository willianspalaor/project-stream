<?php

namespace Application;

use Zend\Db\Adapter\AdapterInterface;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\TableGateway\TableGateway;
use Zend\ModuleManager\Feature\ConfigProviderInterface;

class Module implements ConfigProviderInterface
{

    const VERSION = '3.0.3-dev';

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
            ],
        ];
    }

    public function getControllerConfig()
    {
        return [
            'factories' => [
                Controller\AppController::class => function($container) {
                     return new Controller\AppController(
                        $container->get(Model\AnimeTable::class)
                    );
                },
                Controller\AnimeController::class => function($container) {
                     return new Controller\AnimeController(
                        $container->get(Model\AnimeTable::class),
                         $container->get(Model\SeasonTable::class),
                        $container->get(Model\EpisodeTable::class),
                        $container->get(Model\VideoTable::class)

                    );
                },
            ],
        ];
    }
}