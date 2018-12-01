class Player{

    start(track){

       let self = this;

        Anime.setData(track, function(){

            Helper.setVideo(document.getElementById('video'));
            Helper.assignElements();

            let season = Anime.getSeason(1);
            let episode = Anime.getEpisode(season, 1);

            Anime.setCurrentSeason(season);
            Anime.setCurrentEpisode(episode);

            self.play(episode);

        });
    }

    play(episode){

        let self = this;
        let video = Helper.getVideo();
        let videoEpisode = Anime.getVideo(episode, 1);

        video.src = videoEpisode.url;
        video.load();
        video.play();

        self.bindButtonEvents();
        self.bindProgressEvents();
        self.bindVideoEvents(video);
    }

    bindVideoEvents(video){

        video.onloadstart = function() {
            Helper.showLoader();
        };

        video.onloadedmetadata = function() {
            Helper.setCurrentData();
            Helper.createVideoActions();
            Helper.createSliders();
            Helper.listEpisodes();
        };

        video.onloadeddata = function() {
            Helper.hideLoader();
            Helper.showControls();
            Helper.checkControls();
        };

        video.ontimeupdate = function() {
            Helper.manageProgressBar();
        };
    }

    bindProgressEvents(){

        let container = $('.video-progress');
        let timeDrag = false;

        container.mousedown(function (e) {
            timeDrag = true;
            Helper.updateProgressBar(e.pageX);
            Helper.createActionSkip();
        });

        $(document).mouseup(function (e) {
            if (timeDrag) {
                timeDrag = false;
                Helper.updateProgressBar(e.pageX);
            }
        });
        $(document).mousemove(function (e) {
            if (timeDrag) {
                Helper.updateProgressBar(e.pageX);
            }
        });
    }

    bindButtonEvents(){

        let video = Helper.getVideo();
        let btnPlay = $('#btnPlay');
        let btnVolume = $('#btnVolume');
        let btnForward = $('#btnForward');
        let btnBackward = $('#btnBackward');
        let btnFullScreen = $('#btnFullScreen');
        let btnReturn = $('#btnReturn');
        let btnSkip = $('#btnSkip');
        let btnEpisodes = $('#btnEpisodes');
        let btnSkipSeconds = $('#btnSkipSeconds');
        let btnBackSeconds = $('#btnBackSeconds');
        let interval = null;

        btnPlay.bind('click', function(){
            video.paused ? Helper.play(this) : Helper.pause(this);
        });

        btnVolume.bind('click', function(){
            video.muted ? Helper.unMute(this) : Helper.mute(this);
        });

        btnVolume.bind('mouseover', function(){
            Helper.showVolume();
        });

        btnVolume.bind('mouseleave', function(e){
            Helper.hideVolume(this, e.pageX, e.pageY);
        });

        btnForward.bind('click', function(){
            Helper.playNextEpisode();
        });

        btnForward.bind('mouseover', function(){
            Helper.showNextEpisode();
        });

        btnForward.bind('mouseleave', function(e){
            Helper.hideNextEpisode(this, e.pageX, e.pageY);
        });

        btnBackward.bind('click', function(){
            Helper.playPreviousEpisode();
        });

        btnBackward.bind('mouseover', function(){
            Helper.showPreviousEpisode();
        });

        btnBackward.bind('mouseleave', function(e){
            Helper.hidePreviousEpisode(this, e.pageX, e.pageY);
        });

        btnEpisodes.bind('mouseover', function(){
            Helper.showEpisodes();
        });

        btnEpisodes.bind('mouseleave', function(e){
            Helper.hideEpisodes(this, e.pageX, e.pageY);
        });

        btnReturn.bind('click', function(){
            Helper.returnListAnimes();
        });

        btnReturn.bind('mouseover', function(){
            Helper.showTooltip('return');
        });

        btnReturn.bind('mouseleave', function(){
            Helper.hideTooltip('return');
        });

        btnSkip.bind('click', function(){
            Helper.skipVideo();
        });

        btnFullScreen.bind('click', function(){
            Helper.toggleFullScreen(document.body);
        });

        btnSkipSeconds.bind('click', function(){
            Helper.skipSeconds();
        });

        btnSkipSeconds.bind('mouseover', function(){
            Helper.showTooltip('skip-secs');
        });

        btnSkipSeconds.bind('mouseleave', function(){
            Helper.hideTooltip('skip-secs');
        });

        btnSkipSeconds.mousedown(function (e) {
            interval = setInterval(function(){
                Helper.skipSeconds();
            }, 200);
            return false;
        });

        btnSkipSeconds.mouseup(function (e) {
            clearInterval(interval);
            return false;
        });

        btnBackSeconds.bind('click', function(){
            Helper.backSeconds();
        });

        btnBackSeconds.bind('mouseover', function(){
            Helper.showTooltip('back-secs');
        });

        btnBackSeconds.bind('mouseleave', function(){
            Helper.hideTooltip('back-secs');
        });

        btnBackSeconds.mousedown(function (e) {
            interval = setInterval(function(){
                Helper.backSeconds();
            }, 200);
            return false;
        });

        btnBackSeconds.mouseup(function (e) {
            clearInterval(interval);
            return false;
        });

        document.addEventListener('fullscreenchange', Helper.fullScreenVideo);
        document.addEventListener('webkitfullscreenchange', Helper.fullScreenVideo);
        document.addEventListener('mozfullscreenchange', Helper.fullScreenVideo);
        document.addEventListener('MSFullscreenChange', Helper.fullScreenVideo);
    }
}