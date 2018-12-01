
class Player{

    start(){

        let handle = new Handle();

        handle.showControls();
        handle.createSlider();
        handle.createProgressBar();
        handle.createSkipVideo();
        handle.manageControls();

        this.bindEvents();
    }

    play(){

        let video =  $("#player-video")[0];
        let controls = $(".player-controls");

        if(video.paused){
            video.play();
            controls.find('.fa-play').attr('class', 'fas fa-pause');
        } else {
            video.pause();
            controls.find('.fa-pause').attr('class', 'fas fa-play');
        }
    }

    mute(){

        let video =  $("#player-video")[0];
        let controls = $(".player-controls");
        let slider = $("#slider-vertical");

        if(video.muted){
            video.muted = false;
            controls.find('.fa-volume-mute').attr('class', 'fas fa-volume-up');
            slider.slider("value", parseInt(slider.attr('data-volume')));
        } else {
            video.muted = true;
            controls.find('.fa-volume-up').attr('class', 'fas fa-volume-mute');
            slider.attr('data-volume', slider.slider('value'));
            slider.slider("value", 0);
        }
    }

    bindEvents(){

        let video =  $("#player-video")[0];
        let nextVideo = $('.player-next-video');
        let btnPlay = $("#btnPlay");
        let btnVolume = $("#btnVolume");
        let btnReturn = $("#btnReturn");
        let btnSkip = $("#btnSkip");
        let btnForward = $('#btnForward');
        let btnFullScreen = $("#btnFullScreen");

        let self = this;
        let handle = new Handle();

        btnPlay.bind("click", function(){
            self.play();
        });

        btnVolume.bind("click", function(){
            self.mute();
        });

        btnReturn.bind("click", function(){
            location.href = 'http://project-stream.localhost/';
        });

        btnSkip.bind("click", function(){
            video.currentTime = parseInt($(video).attr('data-end'));
        });

        btnForward.bind("click", function(){
            location.href = window.location.href + '?trackId=' + $(video).attr('data-next');
        });

        nextVideo.bind("click", function(){
            location.href = window.location.href + '?trackId=' + $(video).attr('data-next');
        });

        handle.bindEventsSlider();
        handle.bindEventsStepForward();
        handle.bindEventsSeasons();

        btnFullScreen.bind("click", function(){
            handle.toggleFullScreen(document.body);
            handle.fullScreenVideo();
        });

        document.addEventListener('fullscreenchange', handle.fullScreenVideo);
        document.addEventListener('webkitfullscreenchange', handle.fullScreenVideo);
        document.addEventListener('mozfullscreenchange', handle.fullScreenVideo);
        document.addEventListener('MSFullscreenChange', handle.fullScreenVideo);
    }

}

