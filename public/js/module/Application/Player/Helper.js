
let Player_Helper = new (function () {

    let _video = null;
    let _viewPort = null;
    let _videoNotification = null;
    let _videoRelated = null;
    let _videoError = null;
    let _volumeSlider = null;
    let _progressSlider = null;
    let _progressTime = null;
    let _controlsContainer = null;
    let _progressContainer = null;
    let _progressAux = null;
    let _progressBuffer = null;
    let _volumeContainer = null;
    let _boxNextEpisode = null;
    let _episodeTitle = null;
    let _controlEpisodes = null;
    let _loader = null;
    let _btnReturn = null;
    let _btnPlay = null;
    let _btnNext = null;
    let _btnVolume = null;
    let _btnEpisodes = null;
    let _btnReport = null;
    let _btnForward = null;
    let _btnSkip = null;
    let _btnFullScreen = null;
    let _btnSkipSeconds = null;
    let _btnBackSeconds = null;
    let _toolTipSkipSeconds = null;
    let _toolTipBackSeconds = null;

    let _timeoutSkip;
    let _timeoutNext;
    let _timeoutCount;
    let _iddleInterval = null;
    let _interval = 0;
    let _skipOpening = false;
    let _slideProgress = false;
    let _screenType = null;
    let _fullScreen = false;
    let _orientation = null;
    let _finishAnime = false;
    let _lastEpisode = false;
    let _first = true;
    let _draggin = false;


    function _setVideo(video){
        _video = video;
    }

    function _assignElements(){
        _viewPort = $('.video-viewport');
        _videoNotification = $('.video-notification');
        _videoRelated = $('.video-related');
        _videoError = $('.video-error');
        _controlsContainer = $('.video-controls');
        _progressContainer = $('.video-progress');
        _volumeSlider = $('#volume-slider');
        _progressSlider = $('#progress-slider');
        _progressAux = $('#progress-aux');
        _progressBuffer = $('#progress-buffer');
        _volumeContainer = $('.control-volume-slider');
        _boxNextEpisode =  $('.control-next-episode');
        _episodeTitle = $('.control-title');
        _controlEpisodes = $('.control-episodes');
        _loader = $('#loader-wrapper');
        _btnReturn = $('#btnReturn');
        _btnPlay = $('#btnPlay');
        _btnNext = $('#btnNextEpisode');
        _btnSkip = $('#btnSkip');
        _btnVolume = $('#btnVolume');
        _btnEpisodes = $('#btnEpisodes');
        _btnReport = $('#btnReport');
        _btnForward = $('#btnForward');
        _btnFullScreen = $('#btnFullScreen');
        _btnSkipSeconds = $('#btnSkipSeconds');
        _btnBackSeconds = $('#btnBackSeconds');
        _toolTipSkipSeconds = $('#tooltip-skip-secs');
        _toolTipBackSeconds = $('#tooltip-back-secs');

        if(_getScreenType() !== 'mobile'){

            function moveElements(){
                let top = parseInt(_controlsContainer.css('top'));
                _progressContainer.css('top', top - 20);
                _btnSkipSeconds.css('top', top + 6);
                _btnBackSeconds.css('top', top + 6);
            }

            function showElements(){

                if(_loader.css('display') === 'none'){
                    _progressContainer.css('display', 'block');
                    _btnSkipSeconds.css('display', 'block');
                    _btnBackSeconds.css('display', 'block');
                }
            }

            function hideElements(){
                _progressContainer.css('display', 'none');
                _btnSkipSeconds.css('display', 'none');
                _btnBackSeconds.css('display', 'none');
            }

            _controlsContainer.draggable({
                axis: 'y',
                start: function(ev){
                    hideElements();
                    _draggin = true;
                },
                stop:function(ev){
                    moveElements();
                    showElements();
                    _draggin = false;
                }
            });
        }
    }

    function _assignScreen(){

        let isMobile = false; //initiate as false
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
            isMobile = true;
        }

        if (/Mobi/.test(navigator.userAgent)) {
            isMobile = true;
        }

        if (/Mobi|Android/i.test(navigator.userAgent)) {
            isMobile = true;
        }

        if(isMobile){
            _screenType = 'mobile';
        }else{
            _screenType = 'desk';
        }
    }

    function _getVideo(){
        return _video;
    }

    function _getElement(name){
        return $(name);
    }

    function _play(el, key){
        if(key)
            _showNotification('fas fa-play', 'play');

        _video.play();
        $(el).find('i').attr('class', 'fas fa-pause');
    }

    function _pause(el, key){
        if(key)
            _showNotification('fas fa-pause', 'pause');

        _video.pause();
        $(el).find('i').attr('class', 'fas fa-play');
    }

    function _mute(el, parent = true){

        _volumeSlider.attr('data-volume',  _volumeSlider.slider('value'));
        _volumeSlider.slider('option', 'value', 0);
        _video.muted = true;

        if(!parent){
            $(el).attr('class', 'fas fa-volume-mute');
        }else{
            $(el).find('i').attr('class', 'fas fa-volume-mute');
        }
    }

    function _unMute(el, parent = true){

        _video.muted = false;
        _volumeSlider.slider('option', 'value', _volumeSlider.attr('data-volume'));

        if(!parent){
            $(el).attr('class', 'fas fa-volume-up');
        }else{
            $(el).find('i').attr('class', 'fas fa-volume-up');
        }
    }

    function _showNotification(className, action){

        let icon = _videoNotification.find('i');
        icon.removeAttr('class');
        icon.addClass(className);

        _videoNotification.removeAttr('class');
        _videoNotification.addClass('video-notification ' + action);
        _videoNotification.css('display', 'block');
        _videoNotification.fadeTo( 500 , 0, function() {
            _videoNotification.css({
                'display' : 'none',
                'opacity' : '0.5'
            });
        });
    }

    function _volumeUp(el, key){

        let volume = _volumeSlider.slider('option', 'value') + 10;

        if(volume > 100){
            volume = 100;
        }
        if(volume < 100){

            if(key)
                _showNotification('fas fa-volume-up', 'up');

            _volumeSlider.slider('option', 'value', volume);
            _video.volume = volume / 100;

            _video.muted = false;
            $(el).find('i').attr('class', 'fas fa-volume-up');
        }
    }

    function _volumeDown(el, key){

        let volume = _volumeSlider.slider('option', 'value') - 10;

        if(volume <= 0){
            volume = 0;
            $(el).find('i').attr('class', 'fas fa-volume-mute');
            _video.muted = true;
        }

        if(volume > 0){

            if(key)
                _showNotification('fas fa-volume-down', 'down');

            _volumeSlider.slider('option', 'value', volume);
            _video.volume = volume / 100;
        }
    }

    function _createSliders(){

        _createVolumeSlider();
        _createProgressSlider();
    }

    function _createVolumeSlider(){

        if(!_volumeSlider[0]){

            _volumeSlider = $('<div>')
                .attr({
                    'id' : 'volume-slider',
                    'data-volume' : '50'
                })
                .appendTo(_volumeContainer);

            $('<span>')
                .appendTo(_volumeContainer);

            _volumeSlider.slider({
                orientation: "vertical",
                range: "max",
                min: 0,
                max: 100,
                step: 1,
                value: 50,
                slide : function(event, ui){

                    let btnVolume = _getElement('#btnVolume');

                    _video.volume = ui.value / 100;

                    if (_video.volume > 0) {
                        _unMute(btnVolume);
                    }else{
                        _mute(btnVolume);
                    }
                }
            });
        }
    }

    function _createProgressSlider(){

        if(!_progressSlider[0]){

            _progressSlider = $('<div>').attr({'id' : 'progress-slider'}).appendTo(_progressContainer);
            _progressTime = $('<span>').attr('id' , 'progress-time').appendTo(_progressContainer);

            _progressSlider.slider({
                orientation: "horizontal",
                range: "max",
                min: 0,
                max: 100,
                step: 0.01,
                value: 0,
                start : function(){
                    _slideProgress = true;
                },
                stop : function(){
                    _slideProgress = true;
                },
                slide : function(event, ui){
                    _slideProgress = true;
                }
            });
        }
    }

    function _getTime(time){

        let mins = Math.floor(time / 60);
        let secs = Math.floor(time % 60);
        let minutes = mins < 10 ? '0' + mins : mins;
        let seconds = secs < 10? '0' + secs : secs;
        return minutes + ':' + seconds;
    }

    function _showVolume(){

        _hideMenusControl();
        _volumeContainer.css('display', 'block');
    }

    function _hideVolume(el, x, y){

        if(!el){
            return false;
        }

        let rect = el.getBoundingClientRect();
        let verify = false;

        if(y <= rect.top && (x >= rect.left && x <= rect.right)){
            verify = true;
        }

        if(verify){

            _hideProgressBar();

            _volumeContainer.bind('mouseleave', function(){
                $(this).css('display', 'none');
                _showProgressBar();
            });

        }else{
            _volumeContainer.css('display', 'none');
            _showProgressBar();
        }
    }

    function _playNextEpisode(play = false, button = false){

        _video.pause();
        _first = true;

        let nextEpisode = Player_Anime.getNextEpisode(true);

        if(nextEpisode){

            _showLoader();
            _hideControls();

            Player_Anime.getVideo(nextEpisode, function(videoEpisode){

                Player_Helper.getUrlVideo(videoEpisode, function(url){

                    _video.src = url;
                    _video.load();

                    if(play){
                        _btnPlay.find('i').attr('class', 'fas fa-pause');
                        _video.play();
                    }else{
                        _btnPlay.find('i').attr('class', 'fas fa-play');
                    }

                    _hideLoader();
                });
            });
        }else{
            if(!button){
                _showRelatedAnimes();
            }else{
                alert("Este é o último episódio.");
            }
        }
    }

    function _showRelatedAnimes(){

        _finishAnime = true;

        _progressContainer.css('display', 'none');
        _controlsContainer.css('display', 'none');

        let anime = Player_Anime.getData();

        Player_Anime.getRelatedAnimes(anime.track, function(data){

            let animes = data.related_animes;

            $.each(animes, function(key, anime){

                let video = createContainerVideo(anime);

                $(video).parent().bind('mouseenter', function(){
                    _video.muted = true;
                    $(this).find('video')[0].play();
                });

                $(video).parent().bind('mouseleave', function(){
                    _video.muted = false;
                    $(this).find('video')[0].pause();
                });

                $(video).parent().bind('click', function(){
                    window.location.href = 'http://' + document.location.host + '/' + $(this).attr('data-route');
                });
            });

            _videoRelated.css('display', 'block');
        });

        function createContainerVideo(anime){

            let container = $('<div>')
                .attr('data-route', anime.route)
                .addClass('container-video')
                .appendTo(_videoRelated);

            $('<h1>')
                .text('Assista também:')
                .appendTo(container);

            let video = $('<video loop>')
                .appendTo(container);

            let info = $('<div>')
                .addClass('info')
                .appendTo(container);

            $('<h5>')
                .text(anime.title)
                .appendTo(info);

            let inner = $('<div>')
                .addClass('info-inner')
                .appendTo(info);


            $('<p>')
                .text(anime.description)
                .appendTo(inner);

            video[0].src = anime.trailer;
            video[0].volume = 0.5;
            video[0].load();

            return video[0];
        }
    }

    function _playCurrentEpisode(play = false){

        _first = true;
        _video.pause();
        _showLoader();
        _hideControls();

        let currentEpisode = Player_Anime.getCurrentEpisode();

        Player_Anime.getVideo(currentEpisode, function(videoEpisode){

            Player_Helper.getUrlVideo(videoEpisode, function(url){

                _video = document.getElementById('video');
                _video.src = url;
                _video.load();

                if(play){
                    _btnPlay.find('i').attr('class', 'fas fa-pause');
                    _video.play();
                }else{
                    _btnPlay.find('i').attr('class', 'fas fa-play');
                }

                _hideLoader();
            });
        });
    }

    function _showNextEpisode(){

        let nextEpisode = Player_Anime.getNextEpisode();

        if(nextEpisode){
            _hideMenusControl();
            _boxNextEpisode.css('display', 'block');
        }
    }

    function _hideNextEpisode(el, x, y){

        let rect = el.getBoundingClientRect();

        if(y <= rect.top && x >= rect.left){

            _hideProgressBar();

            _boxNextEpisode.bind('mouseleave', function(){
                $(this).css('display', 'none');
                _showProgressBar();
            });
        }else{
            _boxNextEpisode.css('display', 'none');
            _showProgressBar();
        }
    }

    function _hideMenusControl(){
        _progressContainer.css('display', 'none');
        _controlEpisodes.css('display', 'none');
        _boxNextEpisode.css('display', 'none');
        _volumeContainer.css('display', 'none');

    }

    function _showEpisodes(){

        _hideMenusControl();
        _controlEpisodes.css('display', 'block');
        _listEpisodes();

    }

    function _hideEpisodes(el, x, y){

        if(el){

            let timeout = null;

            function hide(){
                _showProgressBar();
                _controlEpisodes.css('display', 'none');
            }

            let rect = el.getBoundingClientRect();

            if(y <= rect.top+10 && (x >= rect.left && x-10 <= rect.right)){

                _controlEpisodes.bind('mouseover', function(){
                    clearTimeout(timeout);
                    clearIddleInterval();
                });

                _controlEpisodes.bind('mouseleave', function(){

                    timeout = setTimeout(function(){
                        hide();
                    }, 300);

                    clearIddleInterval(true);
                });

                _btnEpisodes.bind('mouseover', function(){
                    clearIddleInterval();
                });

                _btnEpisodes.bind('mouseleave', function(){
                    clearIddleInterval(true);
                });

            }else{
                hide();
            }



        }else{
            _controlEpisodes.css('display', 'none');
            _showProgressBar();
        }
    }

    function _returnListAnimes(){
        location.href = 'http://' + document.location.host;
    }

    function _setCurrentData(callback){

        let anime = Player_Anime.getData();
        let episode = Player_Anime.getCurrentEpisode();
        let nextEpisode = Player_Anime.getNextEpisode();

        _episodeTitle.empty();
        _boxNextEpisode.empty();

        let title = $('<h4>')
            .addClass('title-control')
            .text(anime.title)
            .appendTo(_episodeTitle);

        let subTitle = $('<span>')
            .addClass('subtitle-control')
            .text(episode.title)
            .appendTo(_episodeTitle);

        if(!nextEpisode) {
            _lastEpisode = true;
        }else{

            _lastEpisode = false;

            let circle = $('<div>')
                .addClass('dot next-episode')
                .appendTo(_boxNextEpisode);

            $('<i>')
                .addClass('fas fa-play')
                .appendTo(circle);

            $('<h4>').text('Próximo Episódio').appendTo(_boxNextEpisode);
            $('<img>').attr('src', nextEpisode.thumb).appendTo(_boxNextEpisode);
            $('<h5>').text(nextEpisode.title).appendTo(_boxNextEpisode);
            $('<em>').text(nextEpisode.description).appendTo(_boxNextEpisode);
            $('<span>').appendTo(_boxNextEpisode);

            _boxNextEpisode.unbind('click');
            _boxNextEpisode.bind('click', function(){
                Player_Helper.playNextEpisode();
            });
        }

        if(title[0].offsetWidth){
            subTitle.css('left', title[0].offsetWidth + 'px');
        }

        if(typeof(callback) === 'function'){
              callback();
        }

    }

    function _toggleFullScreen(elem) {

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

    function _fullScreenVideo(){

        if (!document.fullscreenElement && !document.webkitIsFullScreen) {

            _viewPort.removeClass('fullscreen');
            _controlsContainer.removeClass('fullscreen');
            _progressContainer.removeClass('fullscreen');
            _btnBackSeconds.removeClass('fullscreen');
            _btnSkipSeconds.removeClass('fullscreen');
            _videoError.removeClass('fullscreen');
            _videoRelated.removeClass('fullscreen');
            _btnNext.removeClass('fullscreen');
            $(_video).removeClass('fullscreen');
            _fullScreen = false;

        }else{

            if(_btnNext.css('display') !== 'none'){
                _btnNext.addClass('fullscreen');
                $(_video).addClass('fullscreen');
            }

            _viewPort.addClass('fullscreen');
            _controlsContainer.addClass('fullscreen');
            _progressContainer.addClass('fullscreen');
            _btnBackSeconds.addClass('fullscreen');
            _btnSkipSeconds.addClass('fullscreen');
            _videoError.addClass('fullscreen');
            _videoRelated.addClass('fullscreen');
            _fullScreen = true;

        }

    }

    function _createVideoActions(){
        _createActionSkip();
        _createActionNext();
    }

    function _destroyVideoActions(){

        clearTimeout(_timeoutSkip);
        clearTimeout(_timeoutNext);
        clearTimeout(_timeoutCount);
    }

    function _removeTimeoutCount(){

        if(_timeoutCount){

            clearTimeout(_timeoutCount);
            _maximizeVideo();
            _btnNext.css('display', 'none');

            if(_first){
                _video.play();
            }

            _first = false;
        }
    }

    function _bindActionEvents(){

        _btnNext.unbind('click');
        _btnNext.bind('click', function(){
            clearTimeout(_timeoutCount);
            _maximizeVideo();
            _video.pause();
            _playNextEpisode(true);
            $(this).css('display', 'none');
        })
    }

    function _skipVideo(){
        _video.currentTime =  Player_Anime.getCurrentEpisode().open_end;
        _skipOpening = true;
    }

    function _createActionSkip(){

        let episode = Player_Anime.getCurrentEpisode();
        let startTime = episode.open_start;
        let endTime = episode.open_end;
        let endEpisode = episode.end_start;
        let btnSkip = $('#btnSkip');
        _timeoutSkip = 0;

        checkTime();

        function checkTime() {

            if (_video.currentTime >= startTime) {

                if (_video.currentTime < endTime) {

                    btnSkip.fadeIn("slow", function () {
                        btnSkip.css('display', 'block');
                    });

                    if(_skipOpening && !_video.paused) {

                        if (!_slideProgress) {

                            _video.currentTime = endTime;

                            setTimeout(function(){
                                btnSkip.css('display', 'none');
                            }, 3000);
                        }else{
                            btnSkip.css('display', 'block');
                        }
                    }

                    clearTimeout(_timeoutSkip);
                }

                if (_video.currentTime >= endTime) {
                    _bindActionEvents();
                    btnSkip.css('display', 'none');

                    _slideProgress = false;

                } else {
                    _timeoutSkip = setTimeout(checkTime, 500);
                }

            } else {
                _timeoutSkip = setTimeout(checkTime, 500);
                btnSkip.css('display', 'none');
            }
        }
    }

    function _createActionNext(){

        let episode = Player_Anime.getCurrentEpisode();
        let endTime = episode.end_start;
        _timeoutNext = 0;

        checkTime();
        function checkTime() {

            if (_video.currentTime >= endTime && !_video.paused) {

                clearTimeout(_timeoutNext);
                _bindActionEvents();

                if(!_lastEpisode){
                    _minimizeVideo();
                    countSeconds();
                }else{
                    _minimizeVideo();
                    _showRelatedAnimes();
                    $(_video).unbind('click');
                    $(_video).bind('click', function(){
                        _maximizeVideo();
                        _finishAnime = false;
                        _showControls();
                        _videoRelated.css('display', 'none');
                        _video.play();
                        $(_video).unbind('click');
                        if(_screenType !== 'mobile'){
                            $(_video).bind('click', function(){
                                _video.paused ? Player_Helper.play(_btnPlay, true) : Player_Helper.pause(_btnPlay, true);
                            });
                        }
                    });
                }

            }else{
                _timeoutNext = setTimeout(checkTime, 1000);
            }
        }
    }

    function countSeconds(){

        let timeStart = $('#next-episode-time');
        let time = 6;

        _timeoutCount = 0;

        timeStart.text(time + ' segundos');

        _btnNext.fadeIn('slow', function(){
            _btnNext.css('display', 'block');
        });

        _timeoutCount = setTimeout(count, 1000);

        function count(){

            time-= 1;
            timeStart.text(time + ' segundos');

            if(time > 0){
                _timeoutCount = setTimeout(count, 1000);
            }else{
                if(_timeoutCount >= 12){
                    clearTimeout(_timeoutCount);
                   _maximizeVideo();
                    _btnNext.css('display', 'none');
                    _video.pause();
                    _playNextEpisode(true);
                }
            }
        }
    }

    function _minimizeVideo(){

        if(_screenType === 'mobile'){

            if(_orientation === 'landscape'){

                $(_video).css({
                    'transition' : 'all .4s ease-in-out'
                });

                _viewPort.css({
                    'transition' : 'all .4s ease-in-out',
                    'width' : '230px',
                    'height' : '100px',
                    'left' : '18%',
                    'top' : '19%'
                })

            }else{

                $(_video).css({
                    'transition' : 'all .4s ease-in-out',
                    'width' : '200px',
                    'height' : '100px',
                    'margin-left' : '0',
                    'margin-top' : '8%',
                    'border' : '2px solid #fff',
                    'cursor' : 'pointer',
                    'opacity' : '0.7'
                });

                _viewPort.css({
                    'transition' : 'all .4s ease-in-out',
                    'width' : '50px',
                    'height' : '50px',
                    'top' : '5%',
                    'margin-left' : '10%'
                })
            }
        }else{

            $(_video).css({
                'transition' : 'all .4s ease-in-out',
                'width' : '400px',
                'margin-top' : '10%',
                'margin-left' : '10%',
                'border' : '2px solid #fff',
                'cursor' : 'pointer',
                'opacity' : '0.7'
            });

            if(_fullScreen){
                _btnNext.addClass('fullscreen');
                $(_video).addClass('fullscreen');
            }
        }

       // $(_video).unbind('mouseover');
        $(_video).bind('mouseover', function(){
            $(this).css('opacity', '0.9');
        });

        //$(_video).unbind('mouseleave');
        $(_video).bind('mouseleave', function(){
            $(this).css('opacity', '0.7');
        })
    }

    function _maximizeVideo(){

       // $(_viewPort).removeAttr('style');
        $(_video).removeAttr('style');
        $(_video).css({
            'width' : '100%',
            'transition' : 'all .4s ease-in-out',
        });

        $(_video).removeClass('fullscreen');

        $(_video).unbind( 'mouseover' );
        $(_video).unbind( 'mouseleave' );
    }

    function _updateProgressBar(x, y){

        let maxduration = _video.duration;
        let currentPos = _video.currentTime; //Get currenttime
        let position = x - _progressContainer.offset().left;
        let percentage = 100 * position / _progressContainer.width();

        if(!isNaN(percentage)){

            let percentAux = 100 * currentPos / maxduration; //in %

            if (percentage > 100) {
                percentage = 100;
            }
            if (percentage < 0) {
                percentage = 0;
            }

            _progressSlider.slider( "option", "value", Math.round(percentAux));
            _video.currentTime = maxduration * percentage / 100;
            _progressAux.css({'width' : percentage+ 0.5 + '%'});
        }



        // _updateBuffer(position);
    }

    function _manageProgressBar(){

        if(_controlsContainer.css('display') !== 'none'){

            let percentage = _getProgressPercentage();
            _progressAux.css({'width' : parseInt(percentage + 0.5) + '%'});
            _progressSlider.slider( "option", "value", percentage);

            if(_progressTime){
                _progressTime.text(_getTime(_video.currentTime));
            }
        }
    }


    function _manageProgressBuffer(x){

        if(_controlsContainer.css('display') !== 'none'){

            let buffer = _getBufferPercentage();

            _progressBuffer.css({'width' : parseInt(buffer.width) + '%'});
            _progressBuffer.css({'margin-left' : parseInt(buffer.left) + '%'});

        }
    }

    function _listSeasons(){

        let seasons = Player_Anime.getSeasons();
        let currentSeason = Player_Anime.getCurrentSeason();
        let containerHead = _controlEpisodes.find('.head');
        let containerBody = _controlEpisodes.find('.body');


        containerBody.empty();
        containerHead.empty();

        $('<h4>')
            .text('Temporadas')
            .appendTo(containerHead);

        $.each(seasons, function (key, value) {

            let season = $('<div>')
                .addClass('season')
                .on('click', function(){
                    _listEpisodes(value.season);
                })
                .appendTo(containerBody);

            if(value.id === currentSeason.id){
                season.removeAttr('class');
                season.addClass('season active');
            }

            $('<h5>')
                .text('Temporada ' + value.season)
                .appendTo(season);

            $('<i>')
                .addClass('fas fa-arrow-right')
                .appendTo(season);
        });
    }

    function _getEpisodeInfo(el){

        el.parent().find('.episode').each(function(){
           // $(this).css('background-color', 'transparent');
            //$(this).css('border-bottom', '2px solid #191919');
            $(this).removeClass('active');

            if(_screenType === 'mobile'){
                $(this).find('.progress').css('display', 'none');
                $(this).find('.aux-progress').css('display', 'none');
            }
        });

       // el.css('border-bottom', 'none');
       // el.css('background-color', 'rgb(111, 45, 48)');
        el.addClass('active');

        let episode = el.attr('data-episode');
        let info = null;

        el.parent().find('.episode-info').each(function(){
            if($(this).attr('data-episode') === episode){
                info = $(this);
            }else{
                $(this).css('display', 'none');
            }
        });

        return info;
    }

    function _getListEpisode(orientation){

        let body = _controlEpisodes.find('.body');
        let episode = null;
        let target = null;
        let index = 1;

        body.find('.episode').each(function(){
            if($(this).hasClass('active')){
                episode = $(this);
                index = parseInt($(this).attr('data-episode'));
                index = orientation === 'up' ? index-=1 : index+=1;
            }
        });

        if(index){
            body.find('.episode').each(function(){
                let dataEpisode = $(this).attr('data-episode');
                if(parseInt(dataEpisode) === parseInt(index)){
                    target = $(this);
                }
            });
        }

        if(target){
            target.trigger('click');
        }
    }

    function _listEpisodes(season) {

        let currentSeason = null;

        if(season){
            currentSeason = Player_Anime.getSeason(season);
        }else{
            currentSeason = Player_Anime.getCurrentSeason();
        }

        let currentEpisode = Player_Anime.getCurrentEpisode();
        let episodes = Player_Anime.getEpisodes(currentSeason);

        let containerHead = _controlEpisodes.find('.head');
        let containerBody = _controlEpisodes.find('.body');

        containerBody.empty();
        containerHead.empty();

        $('<i>')
            .addClass('fas fa-arrow-left')
            .on('click', function(){
                _listSeasons();
            })
            .appendTo(containerHead);

        $('<i>')
            .addClass('fas fa-sort-down')
            .on('click', function(){
                _getListEpisode('down');
            })
            .appendTo(containerHead);


        $('<i>')
            .addClass('fas fa-sort-up')
            .on('click', function(){
                _getListEpisode('up');
            })
            .appendTo(containerHead);

        $('<h5>')
            .text('Temporada ' + currentSeason.season)
            .appendTo(containerHead);

        $.each(episodes, function (key, value) {

            let episode = $('<div>')
                .addClass('episode')
                .attr('data-episode', value.episode)
                .on('click', function(ev){

                    if(_screenType === 'mobile' && _orientation !== 'landscape'){
                       // $(this).parent().scrollTop($(this)[0].offsetTop);
                    }

                    if(_screenType === 'desk'){
                        $(this).parent().scrollTop($(this)[0].offsetTop);
                    }

                    let info = _getEpisodeInfo($(this));

                    if(info.css('display') === 'none'){

                        containerBody.find('.episode-info').css('display', 'none');

                        info.css('display', 'block');

                        if(_screenType === 'mobile'){
                            $(this).find('.progress').css('display', 'block');
                            $(this).find('.aux-progress').css('display', 'block');
                        }

                    }
                })
                .appendTo(containerBody);

            let episodeInfo = $('<div>')
                .addClass('episode-info')
                .attr('data-episode', value.episode)
                .on('click', function(ev){

                    Player_Anime.setEpisodeProgress();
                    _setCurrentSeason(currentSeason.season);
                    _setCurrentEpisode($(this).attr('data-episode'));
                    _listEpisodes();
                    _playCurrentEpisode();
                    _controlEpisodes.css('display', 'none');

                })
                .appendTo(containerBody);

            $('<img>')
                .attr('src', value.thumb)
                .appendTo(episodeInfo);

            let circle = $('<span>')
                .appendTo(episodeInfo);

            $('<i>')
                .addClass('fas fa-play')
                .appendTo(circle);

            $('<p>')
                .text(value.description)
                .appendTo(episodeInfo);

            if(value.id === currentEpisode.id) {
                let info = _getEpisodeInfo(episode);
                info.css('display', 'block');
                episode.addClass('active');
                containerBody.scrollTop(episode[0].offsetTop);
            }

            $('<h5>')
                .text(value.title)
                .appendTo(episode);

            let progressWidth = 0;
            if(value.progress > 0){
                progressWidth = 130 * parseInt(value.progress) / 100;
            }

            let auxProgress = $('<div>')
                .addClass('aux-progress')
                .css({
                    'width' : progressWidth + 'px'
                })
                .appendTo(episodeInfo);

            let progress = $('<div>')
                .addClass('progress')
                .appendTo(episodeInfo);

            if(_screenType === 'mobile' && value.id !== currentEpisode.id){
                auxProgress.css('display', 'none');
                progress.css('display', 'none');
            }
        });

        let span = _controlEpisodes.find('span');

        if(!span[0]){
            $('<span>')
                .appendTo(_controlEpisodes);
        }

    }

    function _getProgressPercentage(){

        let currentTime = _video.currentTime;
        let duration = _video.duration;

        return 100 * (currentTime / duration);
    }

    function _getBufferPercentage(){

        let position = parseInt(_progressAux.css('width'));
        let percentage = parseInt(100 * position / parseInt(_progressContainer.width()));


        let duration = _video.duration;
        let buffer = _video.buffered;
        let length = buffer.length - 1;
        let start = null;
        let end = null;
        let diff = 5000;

        for(let i = 0; i < length; i++){

            let s = 100 * (buffer.start(i) / buffer.end(i));
            let p = s - percentage;

            if(p < diff){
                diff = p;
                start = buffer.start(i);
                end =  buffer.end(i);
            }
        }

        return {
            left : 100 * (start / duration),
            width : 100 * ((end-start) / duration)
        };
    }

    function _setCurrentEpisode(index){

        let currentSeason = Player_Anime.getCurrentSeason();
        let episode = Player_Anime.getEpisode(currentSeason, index);

        Player_Anime.setCurrentEpisode(episode);
    }

    function _setCurrentSeason(index){

        let season = Player_Anime.getSeason(index);
        Player_Anime.setCurrentSeason(season);
    }

    function _checkTitle(){

        let title = $('.title-control');
        let subTitle = $('.subtitle-control');

        if(title[0] !== undefined && subTitle[0] !== undefined){
            if(title[0].offsetWidth){
                subTitle.css('left', title[0].offsetWidth + 'px');
            }
        }
    }

    function _showControls(){

        if(!_draggin && _loader.css('display') === 'none'){

            if(!_finishAnime){
                _controlsContainer.css('display', 'block');
                _btnReturn.css('display', 'block');
                _btnSkipSeconds.css('display', 'block');
                _btnBackSeconds.css('display', 'block');
                _showProgressBar();
            }
        }
    }

    function _hideControls(){
        _progressContainer.css('display', 'none');
        _controlsContainer.css('display', 'none');
        _btnReturn.css('display', 'none');
        _btnSkipSeconds.css('display', 'none');
        _btnBackSeconds.css('display', 'none');
        _volumeContainer.css('display', 'none');
        _controlEpisodes.css('display', 'none');
        _boxNextEpisode.css('display', 'none');
    }

    function _manageControls() {

        clearInterval(_interval);
        clearInterval(_iddleInterval);

        _interval = 0;
        _iddleInterval = setInterval(timerIncrement, 500);

        _viewPort.mousemove(function () {

            _interval = 0;

            if(_controlsContainer.css('display') === 'none'){
                _showControls();
                _checkTitle();
            }
        });

        _viewPort.keypress(function (event) {
            _interval = 0;
            if(!_finishAnime){
                _showControls();
            }
        });

        let elements = {

            _controlsContainer,
            _controlEpisodes,
            _progressContainer,
            _volumeContainer,
            _btnPlay,
            _btnNext,
            _btnVolume,
            _btnEpisodes,
            _btnReport,
            _btnForward,
            _btnFullScreen,
            _btnReturn,
            _btnSkipSeconds,
            _btnBackSeconds
        };

        $.each(elements, function (key, element) {

            element.bind("mouseover", function () {
                clearIddleInterval();
            });

            element.bind("mouseleave", function () {
                clearIddleInterval(true);
            });
        });
    }

    function clearIddleInterval(setNew){
        _interval = 0;
        clearInterval(_iddleInterval);
        if(setNew) _iddleInterval = setInterval(timerIncrement, 500);
    }

    function timerIncrement() {
        _interval = _interval + 500;
        if (_interval > 1500 && !_video.paused) {
            _hideControls();
        }
    }

    function _checkControls(){

        checkTime();

        function checkTime() {

            if (_video.currentTime >= 2) {
                _manageControls();
            } else {
                setTimeout(checkTime, 500);
            }
        }
    }

    function _showLoader(){
        _loader.css('display', 'block');
    }

    function _hideLoader(){
        _loader.css('display', 'none');
    }

    function _showTooltip(tooltip){

        if(tooltip !== 'skip-secs' && tooltip !== 'back-secs' && tooltip !== 'return'){
            _hideMenusControl();
        }
        $('#tooltip-' + tooltip).css('display', 'block');
    }

    function _hideTooltip(tooltip){
        $('#tooltip-' + tooltip).css('display', 'none');
    }

    function _skipSeconds(key){

        if(key)
            _showNotification('fas fa-angle-double-right', 'skip');

        _video.currentTime = _video.currentTime + 5;
    }

    function _backSeconds(key){

        if(key)
            _showNotification('fas fa-angle-double-left', 'back');

        _video.currentTime = _video.currentTime - 5;
    }

    function _setStartTime(callback){

        let currentEpisode = Player_Anime.getCurrentEpisode();
        let progress =  currentEpisode.progress;
        let maxduration = _video.duration; //Get video duration
        _video.currentTime = (maxduration * progress) / 100;

        let currentPos = _video.currentTime;
        let percentAux = 100 * currentPos / maxduration; //in %

        _progressSlider.slider( "option", "value", Math.round(percentAux));
        _progressAux.css({'width' : percentAux+ 0.5 + '%'});


        if(currentEpisode === 1){
           // _skipOpening = false;
        }

        if(_skipOpening && percentAux < 20){

            if(currentEpisode.resume_start){
                _video.currentTime = currentEpisode.resume_start;
            }else{
                _video.currentTime = currentEpisode.open_end;
            }
        }

        if(percentAux < 70){
            Player_Helper.createVideoActions();
        }else{
            _destroyVideoActions();
        }

        if(typeof(callback) === 'function'){
            callback();
        }
    }

    function _hideProgressBar(){
        _progressContainer.css('display', 'none');
    }

    function _showProgressBar(){

        let show = true;

        if(!_draggin && _loader.css('display') === 'none'){

            let volume = $('.control-volume-slider').css('display');
            let episodes = $('.control-episodes').css('display');
            let nextEpisode = $('.control-next-episode').css('display');

            if(volume != 'none'){
                show = false;
            }

            if(episodes != 'none'){
                show = false;
            }

            if(nextEpisode != 'none'){
                show = false;
            }

            if(_draggin){
                show = false;
            }
        }else{
            show = false;
        }

        if(show && !_finishAnime){
            _progressContainer.css('display', 'block');
        }
    }

    function _showAlertReport(){

        let body = $('body');
        let alert = body.find('.alert');

        if(!alert[0]){
            alert = $('<div>')
                .addClass('alert alert-success')
                .text('Obrigado pela informação! Vamos corrigir o problema.')
                .attr('role', 'alert')
                .appendTo(body)
        }else{
            alert.css('opacity', '1');
        }

        setTimeout(function(){
            alert.fadeTo('slow', 0);
        }, 2000);
    }

    function _clearConsole(){

        if (typeof console._commandLineAPI !== 'undefined') {
            console.API = console._commandLineAPI;
        } else if (typeof console._inspectorCommandLineAPI !== 'undefined') {
            console.API = console._inspectorCommandLineAPI;
        } else if (typeof console.clear !== 'undefined') {
            console.API = console;
        }

        console.API.clear();
    }

    function _setOrientation(orientation){

        let elements = [_viewPort, _controlsContainer, _progressContainer, _btnSkipSeconds, _btnBackSeconds,_toolTipSkipSeconds,_toolTipBackSeconds,
            _btnPlay, _btnVolume, _btnEpisodes, _btnForward, _volumeContainer, _controlEpisodes, _boxNextEpisode, _btnSkip, _btnNext,
            _episodeTitle, _btnFullScreen, _btnReport, _btnEpisodes, _btnForward, _btnReturn, _videoError];

        _orientation = orientation;

        if(orientation === 'landscape'){
            $.each(elements, function(key, element){
                element.addClass(orientation);
            });
        }else{
            $.each(elements, function(key, element){
                element.removeClass('landscape');
            });
        }
    }

    function _getScreenType(){
        return _screenType;
    }

    function _showError(){

        let img = _videoError.find('img');

        if(!img[0]){
            img = $('<img>')
                .attr('src', '/img/Anime/utils/video_not_found.png')
                .appendTo(_videoError);
        }

        $(_video).css('display', 'none');
        img.css('display', 'block');
        _showControls();
        _controlsContainer.css('display', 'block');
    }

    function _hideError(){
        _videoError.find('img').css('display', 'none');
        $(_video).css('display', 'block');
    }

    function _getToken(videoEpisode){

        if(videoEpisode.token){
            let date = new Date();
            let token = encodeURIComponent(window.btoa(String(videoEpisode.url)));
            let time = date.toLocaleString('pt-br');
            return  '/anime/getVideoAnime?t=' + token + ';' + window.btoa(String(time));
        }else{
            return videoEpisode.url;
        }
    }

    function _getUrlVideo(video, callback){

        if(!video.token){
            return callback(video.url);
        }else{
            $.ajax({
                type: 'GET',
                url: Player_Helper.getToken(video),
                success: function (response) {
                    callback(response);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            });
        }
    }

    function _resetOpening(){
        _skipOpening = false;
    }

    return {
        setVideo: _setVideo,
        getVideo: _getVideo,
        play : _play,
        pause: _pause,
        mute: _mute,
        unMute : _unMute,
        volumeUp : _volumeUp,
        volumeDown : _volumeDown,
        showVolume : _showVolume,
        hideVolume : _hideVolume,
        playNextEpisode: _playNextEpisode,
        showNextEpisode : _showNextEpisode,
        hideNextEpisode : _hideNextEpisode,
        setCurrentData : _setCurrentData,
        toggleFullScreen: _toggleFullScreen,
        fullScreenVideo : _fullScreenVideo,
        returnListAnimes : _returnListAnimes,
        createVideoActions: _createVideoActions,
        skipVideo : _skipVideo,
        createSliders : _createSliders,
        manageProgressBar : _manageProgressBar,
        manageProgressBuffer : _manageProgressBuffer,
        assignElements : _assignElements,
        assignScreen : _assignScreen,
        updateProgressBar : _updateProgressBar,
        createActionSkip  : _createActionSkip,
        listEpisodes : _listEpisodes,
        showEpisodes : _showEpisodes,
        hideEpisodes : _hideEpisodes,
        showControls : _showControls,
        hideControls: _hideControls,
        checkControls : _checkControls,
        showLoader : _showLoader,
        hideLoader : _hideLoader,
        showTooltip: _showTooltip,
        hideTooltip : _hideTooltip,
        skipSeconds : _skipSeconds,
        backSeconds : _backSeconds,
        getProgressPercentage : _getProgressPercentage,
        setStartTime : _setStartTime,
        hideProgressBar : _hideProgressBar,
        showProgressBar : _showProgressBar,
        showAlertReport : _showAlertReport,
        clearConsole : _clearConsole,
        setOrientation : _setOrientation,
        getScreenType : _getScreenType,
        removeTimeoutCount : _removeTimeoutCount,
        showError : _showError,
        hideError : _hideError,
        getToken : _getToken,
        getUrlVideo : _getUrlVideo,
        resetOpening : _resetOpening
    }

});