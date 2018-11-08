
class Player{

    start(){

        var self = this;
        let body = $('body');
        body.css('background-color', '#000');
        let navbar = $("#navbar-anime");
        let container = $(".container");
        let video =  $("#video-anime")[0];

        container.css({
            "width": "100%",
            "padding": "0",
            "margin" : "0"
        });

       // body.css('background-color', '#383838');
        navbar.hide();
        video.play();
        $(video).blur();
        //video.muted = false;

        video.onloadedmetadata = function(){

            $('.video-controllers').css('display','block');
            $('.video-progress').css('display', 'block');
            $('.video-return').css('display', 'block');

            self.bindEvents(video);
            self.skipOpening(video);
            self.manageControllers(0);
            self.manageProgress(video);
        };
    }

    manageControllers(interval) {

        let idleInterval = setInterval(timerIncrement, 1000); // 1 seg
        let controllers = $('.video-controllers');
        let progressBar = $('.video-progress')
        let video = $('#video-anime');

        video.mousemove(function( event ) {
            interval = 0;
            controllers.attr('class', 'video-controllers');
            progressBar.attr('class', 'progress video-progress');
            if(document.webkitIsFullScreen == true){
              //  $(video).css({'position': 'absolute', 'width': '100%', 'height': 'auto', 'left': '0', 'top' : 'unset', 'bottom': '100px'});
            }

        });

        video.keypress(function( event ) {
            interval = 0;
            controllers.attr('class', 'video-controllers');
            progressBar.attr('class', 'progress video-progress');
            if(document.webkitIsFullScreen == true){
              //  $(video).css({'position': 'absolute', 'width': '100%', 'height': 'auto', 'left': '0', 'top' : 'unset', 'bottom': '100px'});
            }

        });

        controllers.bind("mouseover", function () {
            clearInterval(idleInterval);
        });

        controllers.bind("mouseleave", function () {
            clearInterval(idleInterval);
            idleInterval = setInterval(timerIncrement, 1000);
        });

        progressBar.bind("mouseover", function () {
            clearInterval(idleInterval);
        });

        progressBar.bind("mouseleave", function () {
            clearInterval(idleInterval);
            idleInterval = setInterval(timerIncrement, 1000);
        });

        function timerIncrement() {
            interval = interval + 1;
            if (interval > 3) { // 3 seg

                if(document.webkitIsFullScreen == true){
                    controllers.attr('class', 'video-controllers hide');
                    progressBar.attr('class', 'progress video-progress hide');
                  //  $(video).css({'position': 'absolute', 'width': '-webkit-fill-available', 'left': 0, 'top': 0});
                }
               // video.css({'position': 'absolute', 'width': '-webkit-fill-available', 'left': 0, 'top': 0});
            }
        }
    }

    manageProgress(video){

        var self = this;


        video.ontimeupdate = function(){
            var currentPos = video.currentTime; //Get currenttime
            var maxduration = video.duration; //Get video duration
            var percentage = 100 * currentPos / maxduration; //in %
            $('.progress-bar').css('width', percentage+'%');
        };

        var timeDrag = false;   /* Drag status */
        $('.video-progress').mousedown(function(e) {
            timeDrag = true;
            updatebar(e.pageX);
            self.skipOpening(video);
        });

        $(document).mouseup(function(e) {
            if(timeDrag) {
                timeDrag = false;
                updatebar(e.pageX);
            }
        });
        $(document).mousemove(function(e) {
            if(timeDrag) {
                updatebar(e.pageX);
            }
        });

        var updatebar = function(x) {
            var progress = $('.video-progress');
            var maxduration = video.duration; //Video duraiton
            var position = x - progress.offset().left; //Click pos
            var percentage = 100 * position / progress.width();

            //Check within range
            if(percentage > 100) {
                percentage = 100;
            }
            if(percentage < 0) {
                percentage = 0;
            }

            //Update progress bar and video currenttime
            $('.progress-bar').css('width', percentage+'%');
            video.currentTime = maxduration * percentage / 100;
        };
    }

    bindEvents(video){

        let self = this;

        $("#btnReturn").bind("click", function(){
            location.href = 'http://project-stream.localhost/';
        });

        $("#btnSkip").bind("click", function(){
            video.currentTime = parseInt($(video).attr('data-end'));;
        });

        $("#btnPlay").bind("click", function(){
            if(video.paused){
                video.play();
                $('.icon-play').attr('class', 'fas fa-pause icon-play');
            } else {
                video.pause();
                $('.icon-play').attr('class', 'fas fa-play icon-play');
            }
        });

        $("#btnMute").bind("click", function(){

            if(video.muted){
                video.muted = false;
                $('.icon-mute').attr('class', 'fas fa-volume-up icon-mute');
            } else {
                video.muted = true;
                $('.icon-mute').attr('class', 'fas fa-volume-mute icon-mute');
            }
        });

        $("#btnFullScreen").bind("click", function(){
            self.toggleFullScreen(document.body);
        });

        document.addEventListener('fullscreenchange', changeHandler);
        document.addEventListener('webkitfullscreenchange', changeHandler);
        document.addEventListener('mozfullscreenchange', changeHandler);
        document.addEventListener('MSFullscreenChange', changeHandler);

        function changeHandler() {
            if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
                $(video).css({'position': 'absolute', 'width': '80%', 'height': 'auto', 'left': '10%', 'top': '1%'});
            }else{
                $(video).css({'position': 'absolute', 'width': '-webkit-fill-available', 'left': 0, 'top': 0});
            }
        }
    }

    skipOpening(video){

        let startTime = parseInt($(video).attr('data-start'));
        let endTime = parseInt($(video).attr('data-end'));

        checkTime();

        function checkTime() {

            let videoSkip = $('.video-skip');

            if (video.currentTime >= startTime) {

                if(video.currentTime < endTime){
                    videoSkip.fadeIn( "slow", function() {
                        videoSkip.show();
                        videoSkip.css('opacity', 0.7);
                    });
                }
                if(video.currentTime >= endTime ){
                    videoSkip.fadeTo( "fast", 0 );
                }else{
                    setTimeout(checkTime, 100);
                }

            } else {
                setTimeout(checkTime, 100);
                videoSkip.hide();
                videoSkip.css('opacity', 0);
            }
        }
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
};
