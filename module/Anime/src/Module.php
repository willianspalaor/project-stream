<?php

namespace Anime;

use Zend\Db\Adapter\AdapterInterface;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\TableGateway\TableGateway;
use Zend\ModuleManager\Feature\ConfigProviderInterface;

class Module implements ConfigProviderInterface
{
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
            ],
        ];
    }

    public function getControllerConfig()
    {
        return [
            'factories' => [
                Controller\AnimeController::class => function($container) {
                    return new Controller\AnimeController(
                        $container->get(Model\AnimeTable::class)
                    );
                },
            ],
        ];
    }
}