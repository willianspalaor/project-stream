class Player{

    start(track){

       let self = this;

        Player_Anime.setData(track, function(data){

            Player_Helper.setVideo(document.getElementById('video'));
            Player_Helper.assignElements();

            let currentSeason = Player_Anime.getCurrentSeason(true);
            let currentEpisode = Player_Anime.getCurrentEpisode(true);

            let season = Player_Anime.getSeason(currentSeason);
            let episode = Player_Anime.getEpisode(season, currentEpisode);

            Player_Anime.setCurrentSeason(season);
            Player_Anime.setCurrentEpisode(episode);

            self.play(episode);
        });
    }

    play(episode){

        let self = this;
        let video = Player_Helper.getVideo();

        Player_Anime.getVideo(episode, function(videoEpisode){

            video.src = videoEpisode.url;

            self.bindButtonEvents();
            self.bindProgressEvents();
            self.bindVideoEvents(video);

        });
    }

    bindVideoEvents(video){

        video.onloadstart = function() {
            Player_Helper.showLoader();
        };

        video.onloadedmetadata = function() {
            Player_Helper.setCurrentData();
            Player_Helper.createSliders();
            Player_Helper.listEpisodes();
        };

        video.onloadeddata = function() {
            Player_Helper.setStartTime(function(){
                Player_Helper.showControls();
                Player_Helper.checkControls();
            });
        };

        video.oncanplay = function() {
            Player_Helper.hideLoader();
        };

        video.ontimeupdate = function() {
            Player_Helper.manageProgressBar();
        };

        video.onabort = function() {
            alert("Video load aborted");
        };
    }

    bindProgressEvents(){

        let container = $('.video-progress');
        let timeDrag = false;

        container.mousedown(function (e) {
            timeDrag = true;
            Player_Helper.updateProgressBar(e.pageX);
            Player_Helper.createActionSkip();
        });

        $(document).mouseup(function (e) {
            if (timeDrag) {
                timeDrag = false;
                Player_Helper.updateProgressBar(e.pageX);
            }
        });

        $(document).mousemove(function (e) {
            if (timeDrag) {
                Player_Helper.updateProgressBar(e.pageX);
            }
        });

        $(window).on('beforeunload', function(ev) {
            Player_Anime.setEpisodeProgress();
            Player_Anime.setCurrentData();
        });
    }

    bindButtonEvents(){

        let video = Player_Helper.getVideo();
        let btnPlay = $('#btnPlay');
        let btnVolume = $('#btnVolume');
        let btnForward = $('#btnForward');
        let btnFullScreen = $('#btnFullScreen');
        let btnReturn = $('#btnReturn');
        let btnReport = $('#btnReport');
        let btnSkip = $('#btnSkip');
        let btnEpisodes = $('#btnEpisodes');
        let btnSkipSeconds = $('#btnSkipSeconds');
        let btnBackSeconds = $('#btnBackSeconds');
        let interval = null;

        btnPlay.bind('click', function(){
          //  Player_Helper.hideTooltip('episode');
            video.paused ? Player_Helper.play(this) : Player_Helper.pause(this);
        });

        btnVolume.bind('click', function(){
            video.muted ? Player_Helper.unMute(this) : Player_Helper.mute(this);
        });

        btnVolume.bind('mouseover', function(){
            Player_Helper.hideTooltip('episode');
            Player_Helper.showVolume();
        });

        btnVolume.bind('mouseleave', function(e){
            Player_Helper.hideVolume(this, e.pageX, e.pageY);
        });

        btnForward.bind('click', function(){
            Player_Helper.playNextEpisode();
        });

        btnForward.bind('mouseover', function(){
            Player_Helper.hideTooltip('episode');
            Player_Helper.showNextEpisode();
        });

        btnForward.bind('mouseleave', function(e){
            Player_Helper.hideNextEpisode(this, e.pageX, e.pageY);
        });

        btnEpisodes.bind('mouseenter', function(){
            Player_Helper.hideTooltip('episode');
            Player_Helper.showEpisodes();
        });

        btnEpisodes.bind('mouseleave', function(e){
            Player_Helper.hideEpisodes(this, e.pageX, e.pageY);
        });

        btnReturn.bind('click', function(){
            Player_Helper.returnListAnimes();
        });

        btnReturn.bind('mouseenter', function(){
            Player_Helper.hideTooltip('episode');
            Player_Helper.showTooltip('return');
        });

        btnReturn.bind('mouseleave', function(){
            Player_Helper.hideTooltip('return');
        });

        btnReport.bind('click', function(){
            Player_Helper.showAlertReport();
            Player_Anime.sendEpisodeReport();
        });

        btnReport.bind('mouseenter', function(){
            Player_Helper.hideProgressBar();
            Player_Helper.hideTooltip('episode');
            Player_Helper.showTooltip('report');
        });

        btnReport.bind('mouseleave', function(){
            Player_Helper.showProgressBar();
            Player_Helper.hideTooltip('report');
        });

        btnSkip.bind('click', function(){
            Player_Helper.skipVideo();
        });

        btnFullScreen.bind('click', function(){
            Player_Helper.toggleFullScreen(document.body);
        });

        btnSkipSeconds.bind('click', function(){
            Player_Helper.skipSeconds();
        });

        btnSkipSeconds.bind('mouseenter', function(){
            Player_Helper.hideTooltip('episode');
            Player_Helper.showTooltip('skip-secs');
        });

        btnSkipSeconds.bind('mouseleave', function(){
            Player_Helper.hideTooltip('skip-secs');
        });

        btnSkipSeconds.mousedown(function (e) {
            interval = setInterval(function(){
                Player_Helper.skipSeconds();
            }, 200);
            return false;
        });

        btnSkipSeconds.mouseup(function (e) {
            clearInterval(interval);
            return false;
        });

        btnBackSeconds.bind('click', function(){
            Player_Helper.backSeconds();
        });

        btnBackSeconds.bind('mouseenter', function(){
            Player_Helper.hideTooltip('episode');
            Player_Helper.showTooltip('back-secs');
        });

        btnBackSeconds.bind('mouseleave', function(){
            Player_Helper.hideTooltip('back-secs');
        });

        btnBackSeconds.mousedown(function (e) {
            interval = setInterval(function(){
                Player_Helper.backSeconds();
            }, 200);
            return false;
        });

        btnBackSeconds.mouseup(function (e) {
            clearInterval(interval);
            return false;
        });

        $(video).click(function (e) {
            video.paused ? Player_Helper.play(btnPlay, true) : Player_Helper.pause(btnPlay, true);
        });

        $(document).keyup(function (e) {

            if(video){

                switch(e.keyCode){
                    case 37 : Player_Helper.backSeconds(true); break;
                    case 38: Player_Helper.volumeUp(btnVolume, true); break;
                    case 39: Player_Helper.skipSeconds(true); break;
                    case 40: Player_Helper.volumeDown(btnVolume, true); break;
                    case 32 :
                        video.paused ?
                            Player_Helper.play(btnPlay, true) :
                            Player_Helper.pause(btnPlay, true);
                        return false;
                }
            }
        });


        document.addEventListener('fullscreenchange', Player_Helper.fullScreenVideo);
        document.addEventListener('webkitfullscreenchange', Player_Helper.fullScreenVideo);
        document.addEventListener('mozfullscreenchange', Player_Helper.fullScreenVideo);
        document.addEventListener('MSFullscreenChange', Player_Helper.fullScreenVideo);

        Player_Helper.showTooltip('episode');

        setTimeout(function(){
            Player_Helper.hideTooltip('episode');
        }, 5000);
    }
}