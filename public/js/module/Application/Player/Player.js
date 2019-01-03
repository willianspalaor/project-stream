class Player{

    start(track, checkUrl = true){

        let self = this;

        Player_Anime.setData(track, function(data) {

            Player_Helper.setVideo(document.getElementById('video'));
            Player_Helper.assignElements();
            Player_Helper.assignScreen();

            let currentSeason = Player_Anime.getCurrentSeason(true);
            let currentEpisode = Player_Anime.getCurrentEpisode(true);

            let season = Player_Anime.getSeason(currentSeason);
            let episode = Player_Anime.getEpisode(season, currentEpisode);

            Player_Anime.setCurrentSeason(season);
            Player_Anime.setCurrentEpisode(episode);

            self.play(episode, checkUrl);
        });
      }

    play(episode, checkUrl){
    
        let self = this;
        let video = Player_Helper.getVideo();
    
        Player_Anime.getVideo(episode, function(videoEpisode){

            Player_Helper.showLoader();

            Player_Helper.getUrlVideo(videoEpisode, function(url){

                video.src = url;
                self.bindButtonEvents();
                self.bindProgressEvents();
                self.bindVideoEvents(video);

                video.play();
            });

        }, null, checkUrl);
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
            Player_Helper.hideError();
            Player_Helper.hideLoader();
        };

        video.ontimeupdate = function() {
            Player_Helper.manageProgressBar();
        };

        video.onprogress = function() {
        //   Player_Helper.manageProgressBuffer();
        };

        video.onabort = function(ev) {
        /*let player = new Player();
        let episode = Player_Anime.getCurrentEpisode();
        player.play(episode, false);*/
        };

        video.onerror = function(ev){
    
            Player_Helper.setCurrentData(function(){
                Player_Helper.showError();
                Player_Helper.hideLoader();
            });
        }
    }

    bindProgressEvents(){

        let container = $('.video-progress');
        let timeDrag = false;

        container.mousedown(function (e) {
            timeDrag = true;
            Player_Helper.updateProgressBar(e.pageX, e.pageY);
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


        //btnPlay.unbind('click');
        btnPlay.bind('click', function(){
            video.paused ? Player_Helper.play(this) : Player_Helper.pause(this);
        });

        //btnVolume.unbind('click');
        btnVolume.bind('click', function(){
            video.muted ? Player_Helper.unMute(this) : Player_Helper.mute(this);

            if($('.control-volume-slider').css('display') === 'none'){
                Player_Helper.showVolume();
            } else{
                Player_Helper.hideVolume();
            }
        });

       // btnVolume.unbind('mouseover');
        btnVolume.bind('mouseover', function(){
            Player_Helper.showVolume();
        });

       // btnVolume.unbind('mouseleave');
        btnVolume.bind('mouseleave', function(e){
            Player_Helper.hideVolume(this, e.pageX, e.pageY);
        });

       // btnForward.unbind('click');
        btnForward.bind('click', function(){
            Player_Helper.playNextEpisode(true);
        });

       // btnForward.unbind('mouseover');
        btnForward.bind('mouseover', function(){
            Player_Helper.showNextEpisode();
        });

      //  btnForward.unbind('mouseleave');
        btnForward.bind('mouseleave', function(e){
            Player_Helper.hideNextEpisode(this, e.pageX, e.pageY);
        });

       // btnEpisodes.unbind('click');
        btnEpisodes.bind('click', function(){

            if($('.control-episodes').css('display') === 'none'){
                Player_Helper.showEpisodes();
            } else{
                Player_Helper.hideEpisodes();
            }
        });

       // btnEpisodes.unbind('mouseenter');
        btnEpisodes.bind('mouseenter', function(){
            Player_Helper.showEpisodes();
        });

       // btnEpisodes.unbind('mouseleave');
        btnEpisodes.bind('mouseleave', function(e){
            Player_Helper.hideEpisodes(this, e.pageX, e.pageY);
        });

        //btnReturn.unbind('click');
        btnReturn.bind('click', function(){
            Player_Helper.returnListAnimes();
        });

       // btnReturn.unbind('mouseenter');
        btnReturn.bind('mouseenter', function(){
            Player_Helper.showTooltip('return');
        });

       // btnReturn.unbind('mouseleave');
        btnReturn.bind('mouseleave', function(){
            Player_Helper.hideTooltip('return');
        });

       // btnReport.unbind('click');
        btnReport.bind('click', function(){
            Player_Helper.showAlertReport();
            Player_Anime.sendEpisodeReport();
        });

      //  btnReport.unbind('mouseenter');
        btnReport.bind('mouseenter', function(){
            Player_Helper.hideProgressBar();
            Player_Helper.showTooltip('report');
        });

        //btnReport.unbind('mouseleave');
        btnReport.bind('mouseleave', function(){
            Player_Helper.showProgressBar();
            Player_Helper.hideTooltip('report');
        });

       // btnSkip.unbind('click');
        btnSkip.bind('click', function(){
            Player_Helper.skipVideo();
        });

        //btnFullScreen.unbind('click');
        btnFullScreen.bind('click', function(){
            Player_Helper.toggleFullScreen(document.body);
        });

        //btnSkipSeconds.unbind('click');
        btnSkipSeconds.bind('click', function(){
            Player_Helper.skipSeconds();
        });

        //btnSkipSeconds.unbind('mouseenter');
        btnSkipSeconds.bind('mouseenter', function(){
            Player_Helper.showTooltip('skip-secs');
        });

        //btnSkipSeconds.unbind('mouseleave');
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

        //btnBackSeconds.unbind('click');
        btnBackSeconds.bind('click', function(){
            Player_Helper.backSeconds();
        });

       // btnBackSeconds.unbind('mouseenter');
        btnBackSeconds.bind('mouseenter', function(){
            Player_Helper.showTooltip('back-secs');
        });

        //btnBackSeconds.unbind('mouseleave');
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

        //$(video).unbind('click');
        $(video).bind('click', function(){

            if(Player_Helper.getScreenType() !== 'mobile'){
                video.paused ? Player_Helper.play(btnPlay, true) : Player_Helper.pause(btnPlay, true);
            }

            Player_Helper.removeTimeoutCount();
        });

        if(Player_Helper.getScreenType() !== 'mobile'){

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
        }


        document.addEventListener('fullscreenchange', Player_Helper.fullScreenVideo);
        document.addEventListener('webkitfullscreenchange', Player_Helper.fullScreenVideo);
        document.addEventListener('mozfullscreenchange', Player_Helper.fullScreenVideo);
        document.addEventListener('MSFullscreenChange', Player_Helper.fullScreenVideo);

        /*Player_Helper.showTooltip('episode');

        setTimeout(function(){
            Player_Helper.hideTooltip('episode');
        }, 3000);*/


        if (window.matchMedia("(orientation: portrait)").matches) {
            if(Player_Helper.getScreenType() === 'mobile'){
                Player_Helper.setOrientation('portrait');
            }
        }

        if (window.matchMedia("(orientation: landscape)").matches) {
            if(Player_Helper.getScreenType() === 'mobile'){
                Player_Helper.setOrientation('landscape');
            }
        }

        $( window ).on( "orientationchange", function( event ) {

            let orientation = null;

            switch(window.orientation){
                case 0 :  orientation = 'portrait'; break;
                case 90 :  orientation = 'landscape'; break;
                case -90 :  orientation = 'landscape'; break;
            }

            Player_Helper.setOrientation(orientation);
        });
    }
}