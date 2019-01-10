<?php

namespace Admin;

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
                Model\GenreTable::class => function($container) {
                    $tableGateway = $container->get(Model\GenreTableGateway::class);
                    return new Model\GenreTable($tableGateway);
                },
                Model\GenreTableGateway::class => function ($container) {
                    $dbAdapter = $container->get(AdapterInterface::class);
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Model\Genre());
                    return new TableGateway('genre', $dbAdapter, null, $resultSetPrototype);
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
                Model\AnimeCategoryTable::class => function($container) {
                    $tableGateway = $container->get(Model\AnimeCategoryTableGateway::class);
                    return new Model\AnimeCategoryTable($tableGateway);
                },
                Model\AnimeCategoryTableGateway::class => function ($container) {
                    $dbAdapter = $container->get(AdapterInterface::class);
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Model\AnimeCategory());
                    return new TableGateway('anime_category', $dbAdapter, null, $resultSetPrototype);
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
                Model\AdminTable::class => function($container) {
                    $tableGateway = $container->get(Model\AdminTableGateway::class);
                    return new Model\AdminTable($tableGateway);
                },
                Model\AdminTableGateway::class => function ($container) {
                    $dbAdapter = $container->get(AdapterInterface::class);
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Model\Admin());
                    return new TableGateway('admin', $dbAdapter, null, $resultSetPrototype);
                },
                Model\AuthorTable::class => function($container) {
                    $tableGateway = $container->get(Model\AuthorTableGateway::class);
                    return new Model\AuthorTable($tableGateway);
                },
                Model\AuthorTableGateway::class => function ($container) {
                    $dbAdapter = $container->get(AdapterInterface::class);
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Model\Author());
                    return new TableGateway('author', $dbAdapter, null, $resultSetPrototype);
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
                Model\EpisodeReportTable::class => function($container) {
                    $tableGateway = $container->get(Model\EpisodeReportTableGateway::class);
                    return new Model\EpisodeReportTable($tableGateway);
                },
                Model\EpisodeReportTableGateway::class => function ($container) {
                    $dbAdapter = $container->get(AdapterInterface::class);
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Model\EpisodeReport());
                    return new TableGateway('episode_report', $dbAdapter, null, $resultSetPrototype);
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
                        $container->get(Model\GenreTable::class),
                        $container->get(Model\CategoryTable::class),
                        $container->get(Model\AnimeCategoryTable::class),
                        $container->get(Model\SeasonTable::class),
                        $container->get(Model\EpisodeTable::class),
                        $container->get(Model\VideoTable::class),
                        $container->get(Model\AdminTable::class),
                        $container->get(Model\AuthorTable::class),
                        $container->get(Model\ClientAnimeTable::class),
                        $container->get(Model\ClientEpisodeTable::class),
                        $container->get(Model\EpisodeReportTable::class)
                    );
                },
                Controller\AnimeController::class => function($container) {
                    return new Controller\AnimeController(
                        $container->get(Model\AnimeTable::class),
                        $container->get(Model\GenreTable::class),
                        $container->get(Model\CategoryTable::class),
                        $container->get(Model\AnimeCategoryTable::class),
                        $container->get(Model\SeasonTable::class),
                        $container->get(Model\EpisodeTable::class),
                        $container->get(Model\VideoTable::class),
                        $container->get(Model\AdminTable::class),
                        $container->get(Model\AuthorTable::class),
                        $container->get(Model\ClientAnimeTable::class),
                        $container->get(Model\ClientEpisodeTable::class),
                        $container->get(Model\EpisodeReportTable::class)
                    );
                },
                Controller\SeasonController::class => function($container) {
                    return new Controller\SeasonController(
                        $container->get(Model\AnimeTable::class),
                        $container->get(Model\GenreTable::class),
                        $container->get(Model\CategoryTable::class),
                        $container->get(Model\AnimeCategoryTable::class),
                        $container->get(Model\SeasonTable::class),
                        $container->get(Model\EpisodeTable::class),
                        $container->get(Model\VideoTable::class),
                        $container->get(Model\AdminTable::class),
                        $container->get(Model\AuthorTable::class),
                        $container->get(Model\ClientAnimeTable::class),
                        $container->get(Model\ClientEpisodeTable::class),
                        $container->get(Model\EpisodeReportTable::class)
                    );
                },
                Controller\EpisodeController::class => function($container) {
                    return new Controller\EpisodeController(
                        $container->get(Model\AnimeTable::class),
                        $container->get(Model\GenreTable::class),
                        $container->get(Model\CategoryTable::class),
                        $container->get(Model\AnimeCategoryTable::class),
                        $container->get(Model\SeasonTable::class),
                        $container->get(Model\EpisodeTable::class),
                        $container->get(Model\VideoTable::class),
                        $container->get(Model\AdminTable::class),
                        $container->get(Model\AuthorTable::class),
                        $container->get(Model\ClientAnimeTable::class),
                        $container->get(Model\ClientEpisodeTable::class),
                        $container->get(Model\EpisodeReportTable::class)
                    );
                },
                Controller\VideoController::class => function($container) {
                    return new Controller\VideoController(
                        $container->get(Model\AnimeTable::class),
                        $container->get(Model\GenreTable::class),
                        $container->get(Model\CategoryTable::class),
                        $container->get(Model\AnimeCategoryTable::class),
                        $container->get(Model\SeasonTable::class),
                        $container->get(Model\EpisodeTable::class),
                        $container->get(Model\VideoTable::class),
                        $container->get(Model\AdminTable::class),
                        $container->get(Model\AuthorTable::class),
                        $container->get(Model\ClientAnimeTable::class),
                        $container->get(Model\ClientEpisodeTable::class),
                        $container->get(Model\EpisodeReportTable::class)
                    );
                },
            ],
        ];
    }
}