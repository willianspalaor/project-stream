<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Application\Model\AnimeTable;
use Application\Model\SeasonTable;
use Application\Model\EpisodeTable;
use Application\Model\VideoTable;

class AnimeController extends AbstractActionController
{

	private $animeTable;
    private $seasonTable;
	private $episodeTable;
	private $videoTable;

    public function __construct(AnimeTable $animeTable, SeasonTable $seasonTable,
                                EpisodeTable $episodeTable, VideoTable $videoTable)
    {
        $this->animeTable = $animeTable;
        $this->seasonTable = $seasonTable;
        $this->episodeTable = $episodeTable;
        $this->videoTable = $videoTable;
    }

    public function indexAction()
    {
    	$id = $this->params()->fromRoute('id', -1);

    	$anime = $this->animeTable->getAnime($id);
    	$season = $this->seasonTable->getSeasonByAnime($anime->id, 1);
    	$episode = $this->episodeTable->getEpisodeBySeason($season->id, 1);
    	$video = $this->videoTable->getVideoByEpisode($episode->id, 1);



        return new ViewModel([
            'anime' => $anime,
            'season' => $season,
            'episode' => $episode,
            'video' => $video

        ]);
    }

}

