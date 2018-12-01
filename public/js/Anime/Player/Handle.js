
class Handle {

    showControls() {

        let controls = $('.player-controls');
        let btnReturn = $('.player-return');
        let progressBar = $('.player-progress');

        controls.fadeTo("slow",1);
        progressBar.fadeTo("slow", 1);
        btnReturn.fadeTo("slow", 1);
    }

    toggleFullScreen(elem) {

        // ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
            if (elem.requestFullScreen) {
                elem.requestFullScreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullScreen) {
                elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    fullScreenVideo() {

        let video = $("#player-video");

        if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {

            video.removeAttr( 'style' );
            video.css({'width': '80%', 'left':'10%', 'bottom': '5%', 'position': 'fixed'});
        }else{

            video.removeAttr( 'style' );
            video.css({'width': '100%', 'left': 0, 'top': 0, 'position': 'relative'});
        }
    }

    createSlider() {

        let controls = $(".player-controls");
        let video = $("#player-video")[0];
        let sliderVolume = $("#slider-vertical");
        let sliderProgress = $("#slider-horizontal");

        sliderVolume.slider({
            orientation: "vertical",
            range: "min",
            min: 0,
            max: 100,
            step: 10,
            value: 50,
            slide: function (event, ui) {

                video.muted = false;
                video.volume = ui.value / 100;

                let volumeUp = controls.find('.fa-volume-up')[0];
                let volumeMute = controls.find('.fa-volume-mute')[0];

                if (video.volume === 0) {
                    $(volumeUp).attr('class', 'fas fa-volume-mute');
                    video.muted = true;
                    sliderVolume.attr('data-volume', 50);
                } else {

                    if (volumeMute !== undefined) {
                        $(volumeMute).attr('class', 'fas fa-volume-up');
                    }
                }
            }
        });

        sliderProgress.slider({
            orientation: "horizontal",
            range: "min",
            animate: "fast",
            min: 0,
            max: 100,
            step: 0.01,
            value: 0,
            slide: function (event, ui) {
                let currentPos = video.currentTime; //Get currenttime
                let maxduration = video.duration; //Get video duration
                let percentage = 100 * currentPos / maxduration; //in %
                $('.aux-progress').css({'width' : percentage+1 + '%'});
            }
        });
    }

    createProgressBar() {

        let video = $("#player-video")[0];
        let self = this;

        let timeDrag = false;
        let progress =  $('.player-progress');

        /* Drag status */
        progress.mousedown(function (e) {
            timeDrag = true;
            updatebar(e.pageX);
            self.createSkipVideo();
        });

        $(document).mouseup(function (e) {
            if (timeDrag) {
                timeDrag = false;
                updatebar(e.pageX);
            }
        });
        $(document).mousemove(function (e) {
            if (timeDrag) {
                updatebar(e.pageX);
            }
        });

        video.ontimeupdate = function () {

            let currentTime = video.currentTime; //Get currenttime
            let maxduration = video.duration; //Get video duration
            let percentage = 100 * currentTime / maxduration; //in %
            let mins = Math.floor(currentTime / 60);
            let secs = Math.floor(currentTime % 60);
            let minutes = mins < 10 ? '0' + mins : mins;
            let seconds = secs < 10? '0' + secs : secs;
            let time = minutes + ':' + seconds;

            $('.progress-bar').css('width', percentage + '%');
            $( "#slider-horizontal" ).slider( "option", "value", percentage);
            $('.aux-progress').css({'width' : percentage+1 + '%'});
            $('#player-time').text(time);
        };

        let updatebar = function (x) {

            let progress = $('.player-progress');
            let maxduration = video.duration;
            let currentPos = video.currentTime; //Get currenttime
            let position = x - progress.offset().left;
            let percentage = 100 * position / progress.width();
            let percentAux = 100 * currentPos / maxduration; //in %

            if (percentage > 100) {
                percentage = 100;
            }
            if (percentage < 0) {
                percentage = 0;
            }
            $( "#slider-horizontal" ).slider( "option", "value", Math.round(percentAux));
            $('.aux-progress').css({'width' : percentage+1 + '%'});
            $('.progress-bar').css('width', percentage + '%');
            video.currentTime = maxduration * percentage / 100;
        };
    }

    createSkipVideo() {

        let video = $("#player-video")[0];
        let startTime = parseInt($(video).attr('data-start'));
        let endTime = parseInt($(video).attr('data-end'));

        checkTime();

        function checkTime() {

            let videoSkip = $('.player-skip');

            if (video.currentTime >= startTime) {

                if(videoSkip.css('display') === 'none'){
                    if (video.currentTime < endTime) {
                        videoSkip.fadeIn("slow", function () {
                            videoSkip.show();
                            videoSkip.css('opacity', 0.7);
                        });
                    }
                }

                if (video.currentTime >= endTime) {
                    videoSkip.fadeTo("fast", 0);
                } else {
                    setTimeout(checkTime, 100);
                }

            } else {
                setTimeout(checkTime, 100);
                videoSkip.hide();
                videoSkip.css('opacity', 0);
            }
        }
    }

    manageControls() {

        let interval = 0;
        let idleInterval = setInterval(timerIncrement, 500);
        let controls = $('.player-controls');
        let progressBar = $('.player-progress');
        let btnReturn = $('.player-return');
        let video = $('#player-video');

        video.mousemove(function () {
            interval = 0;
            controls.css("display", 'block');
            progressBar.css("display", 'block');
            btnReturn.css("display", 'block');
        });

        video.keypress(function (event) {
            interval = 0;
            controls.css("display", 'block');
            progressBar.css("display", 'block');
            btnReturn.css("display", 'block');
        });

        controls.bind("mouseover", function () {
            interval = 0;
            clearInterval(idleInterval);
        });

        controls.bind("mouseleave", function () {
            interval = 0;
            clearInterval(idleInterval);
            idleInterval = setInterval(timerIncrement, 500);
        });

        progressBar.bind("mouseover", function () {
            interval = 0;
            clearInterval(idleInterval);
        });

        progressBar.bind("mouseleave", function () {
            interval = 0;
            clearInterval(idleInterval);
            idleInterval = setInterval(timerIncrement, 500);
        });

        function timerIncrement() {
            interval = interval + 500;
            if (interval > 1500 && !video[0].paused) {
                controls.css("display", 'none');
                progressBar.css("display", 'none');
                btnReturn.css("display", 'none');
            }
        }

    }

    bindEventsSlider(){

        let btnVolume = $('.player-volume');
        let sliderVolume = $(".slider-volume");
        let progressBar = $('.player-progress');

        btnVolume.bind("mouseover", function () {
            sliderVolume.css('display', 'block');
            progressBar.css('display', 'none');
        });

        btnVolume.bind("mouseleave", function () {
            sliderVolume.css('display', 'none');
            progressBar.css('display', 'block');
        });
    }

    bindEventsStepForward(){

        let stepForward = $(".player-forward");
        let nextVideo = $('.player-next-video');
        let progressBar = $('.player-progress');

        stepForward.bind("mouseover", function () {
            nextVideo.css('display', 'block');
            progressBar.css('display', 'none');
        });

        stepForward.bind("mouseleave", function () {
            nextVideo.css('display', 'none');
            progressBar.css('display', 'block');
        });
    }


    bindEventsSeasons(){

        let self = this;
        let btnSeasons = $('.player-seasons');
        let boxSeasons = $('.seasons');
        let boxEpisodes = $('.episodes');
        let progressBar = $('.player-progress');
        let trSeasons = $('.tr-seasons');
        let listSeasons = $('.list-season');
        let btnReturnSeason = $('.btnReturnSeason');
        let seasonCurrent = $('.season-current');
        let groupEpisodes = $('.group-episodes');

       /* let first = true;
        if(groupEpisodes[0].childNodes.length <= 0 && first === true){

            let season = 1;
            let current = 1;
            seasonCurrent.text('Temporada ' + current);

            self.getEpisodes(season, function(data){

                $.each(data, function(i, val){

                    let link = $('<a>').attr('href', '#').addClass('list-group-item list-group-item-action list-episode');

                    link.bind('click', function(ev){

                        ev.preventDefault();

                        let href = window.location.href;
                        let index = href.indexOf("?");
                        let url = "";

                        if(index > -1){
                            url = href.substr(0, index);
                        }

                        location.href = url + '?trackId=' + val.track;
                    });

                    $('<span>').text('Episódio ' + val.episode).appendTo(link);
                    $('<i>').addClass('fas fa-angle-right').appendTo(link);
                    link.appendTo(groupEpisodes);
                });

                boxSeasons.hide();
                boxEpisodes.show();
                btnSeasons.attr('data-active', 'episode');
                first = false;
            })
        }*/

        listSeasons.bind("click", function(ev){
            ev.preventDefault();
        });

        btnSeasons.bind("mouseover", function () {

            if($(this).attr('data-active') == 'season'){
                boxSeasons.css('display', 'block');
            }else{
                boxEpisodes.css('display', 'block');
            }

            trSeasons.css('display', 'block');
            progressBar.css('display', 'none');
        });

        btnSeasons.bind("mouseleave", function () {
            boxSeasons.css('display', 'none');
            boxEpisodes.css('display', 'none');
            trSeasons.css('display', 'none');
            progressBar.css('display', 'block');
        });

        btnReturnSeason.bind("click", function(){
            boxEpisodes.css('display', 'none');
            boxSeasons.css('display', 'block');
            btnSeasons.attr('data-active', 'season');
        });

        listSeasons.bind("click",function(){

            let season = $(this).attr('data-season');
            let current = $(this).attr('data-current');

            groupEpisodes.empty();
            seasonCurrent.text('Temporada ' + current);

            self.getEpisodes(season, function(data){

                $.each(data, function(i, val){

                    let link = $('<a>').attr('href', "#").addClass('list-group-item list-group-item-action list-episode');

                    link.bind('click', function(ev){

                        ev.preventDefault();

                        let href = window.location.href;
                        let index = href.indexOf("?");
                        let url = "";

                        if(index > -1){
                            url = href.substr(0, index);
                        }

                        location.href = url + '?trackId=' + val.track;
                    });

                    $('<span>').text('Episódio ' + val.episode).appendTo(link);
                    $('<i>').addClass('fas fa-angle-right').appendTo(link);
                    link.appendTo(groupEpisodes);
                });

                boxSeasons.hide();
                boxEpisodes.show();
                btnSeasons.attr('data-active', 'episode');
            })
        });


        let href = window.location.href;
        let index = href.indexOf("=");
        let track = "";

        if(index > -1){
            track = href.substr(index+1, href.length);
        }

        this.getSeason(track, function(response){
            console.log(response);
        })
    }

    getEpisodes(season, callback){

        $.ajax({
            type : 'GET',
            url  :'/player/getEpisodes?season=' + season,
            success: function(response){

                let data = JSON.parse(response);
                callback(data.response);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
                alert("fail");
            }
        });
    }


    getSeason(episode, callback){

        $.ajax({
            type : 'GET',
            url  :'/player/getSeason?episode=' + episode,
            success: function(response){

                let data = JSON.parse(response);
                console.log(response);
                callback(data.response);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
                alert("fail");
            }
        });
    }


}
