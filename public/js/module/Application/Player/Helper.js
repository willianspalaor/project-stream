let Helper = new (function () {

    let _video = null;
    let _viewPort = null;
    let _volumeSlider = null;
    let _progressSlider = null;
    let _progressTime = null;
    let _controlsContainer = null;
    let _progressContainer = null;
    let _progressAux = null;
    let _volumeContainer = null;
    let _boxNextEpisode = null;
    let _boxPreviousEpisode = null;
    let _episodeTitle = null;
    let _controlEpisodes = null;
    let _btnReturn = null;
    let _btnPlay = null;
    let _btnNext = null;
    let _btnSkipSeconds = null;
    let _btnBackSeconds = null;
    let _loader = null;

    function _setVideo(video){
        _video = video;
    }

    function _assignElements(){
        _viewPort = $('.video-viewport');
        _controlsContainer = $('.video-controls');
        _progressContainer = $('.video-progress');
        _volumeSlider = $('#volume-slider');
        _progressSlider = $('#progress-slider');
        _progressAux = $('#progress-aux');
        _volumeContainer = $('.control-volume-slider');
        _boxNextEpisode =  $('.control-next-episode');
        _boxPreviousEpisode =  $('.control-previous-episode');
        _episodeTitle = $('.control-title');
        _controlEpisodes = $('.control-episodes');
        _btnReturn = $('#btnReturn');
        _btnPlay = $('#btnPlay');
        _btnNext = $('#btnNextEpisode');
        _btnSkipSeconds = $('#btnSkipSeconds');
        _btnBackSeconds = $('#btnBackSeconds');
        _loader = $('#loader-wrapper');
    }

    function _getVideo(){
        return _video;
    }

    function _getElement(name){
        return $(name);
    }

    function _play(el){
        _video.play();
        $(el).find('i').attr('class', 'fas fa-pause');
    }

    function _pause(el){

        _video.pause();
        $(el).find('i').attr('class', 'fas fa-play');
    }

    function _mute(el){

        _volumeSlider.attr('data-volume',  _volumeSlider.slider('value'));
        _volumeSlider.slider('option', 'value', 0);
        _video.muted = true;
        $(el).find('i').attr('class', 'fas fa-volume-mute');
    }

    function _unMute(el){

        _video.muted = false;
        _volumeSlider.slider('option', 'value', _volumeSlider.attr('data-volume'));
        $(el).find('i').attr('class', 'fas fa-volume-up');
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
                slide : function(event, ui){

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
        _progressContainer.css('display', 'none');
        _volumeContainer.css('display', 'block');
    }

    function _hideVolume(el, x, y){

        let rect = el.getBoundingClientRect();

        if(y <= rect.top && (x >= rect.left && x <= rect.right)){

            _progressContainer.css('display', 'none');

            _volumeContainer.bind('mouseleave', function(){
                $(this).css('display', 'none');
                _progressContainer.css('display', 'block');
            });
        }else{
            _volumeContainer.css('display', 'none');
            _progressContainer.css('display', 'block');
        }
    }

    function _playNextEpisode(){

        _unbindControls();
        _hideControls();

        let nextEpisode = Anime.getNextEpisode();
        let videoEpisode = Anime.getVideo(nextEpisode, 1);

        Anime.setCurrentEpisode(nextEpisode);

        _progressSlider.slider( "option", "value", 0);
        _progressAux.css({'width' :'0'});
        _video.src = videoEpisode.url;
        _video.load();
        _video.play();
    }

    function _playPreviousEpisode(){

        _unbindControls();
        _hideControls();

        let previousEpisode = Anime.getPreviousEpisode();
        let videoEpisode = Anime.getVideo(previousEpisode, 1);

        Anime.setCurrentEpisode(previousEpisode);

        _progressSlider.slider( "option", "value", 0);
        _progressAux.css({'width' :'0'});
        _video.src = videoEpisode.url;
        _video.load();
        _video.play();
    }

    function _playCurrentEpisode(){

        Helper.hideControls();

        let currentEpisode = Anime.getCurrentEpisode();
        let videoEpisode = Anime.getVideo(currentEpisode, 1);

        _video = document.getElementById('video');
        _video.src = videoEpisode.url;
        _video.load();
        _video.play();
    }

    function _showPreviousEpisode(){

        let previousEpisode = Anime.getPreviousEpisode();

        if(previousEpisode){
            _progressContainer.css('display', 'none');
            _boxPreviousEpisode.css('display', 'block');
        }
    }

    function _hidePreviousEpisode(el, x, y){

        let rect = el.getBoundingClientRect();

        if(y <= rect.top && (x >= rect.left)){

            _progressContainer.css('display', 'none');

            _boxPreviousEpisode.bind('mouseleave', function(){
                $(this).css('display', 'none');
                _progressContainer.css('display', 'block');
            });
        }else{
            _boxPreviousEpisode.css('display', 'none');
            _progressContainer.css('display', 'block');
        }
    }

    function _showNextEpisode(){

        let nextEpisode = Anime.getNextEpisode();

        if(nextEpisode){
            _progressContainer.css('display', 'none');
            _boxNextEpisode.css('display', 'block');
        }
    }

    function _hideNextEpisode(el, x, y){

        let rect = el.getBoundingClientRect();

        if(y <= rect.top && (x >= rect.left)){

            _progressContainer.css('display', 'none');

            _boxNextEpisode.bind('mouseleave', function(){
                $(this).css('display', 'none');
                _progressContainer.css('display', 'block');
            });
        }else{
            _boxNextEpisode.css('display', 'none');
            _progressContainer.css('display', 'block');
        }
    }

    function _showEpisodes(){
        _progressContainer.css('display', 'none');
        _controlEpisodes.css('display', 'block');
    }

    function _hideEpisodes(el, x, y){

        let rect = el.getBoundingClientRect();

        if(y <= rect.top && (x >= rect.left)){

            _progressContainer.css('display', 'none');

            _controlEpisodes.bind('mouseleave', function(){
                $(this).css('display', 'none');
                _progressContainer.css('display', 'block');
            });
        }else{
            _controlEpisodes.css('display', 'none');
            _progressContainer.css('display', 'block');
        }
    }

    function _returnListAnimes(){
        location.href = 'http://project-stream.localhost/';
    }

    function _setCurrentData(){

        let anime = Anime.getData();
        let episode = Anime.getCurrentEpisode();
        let nextEpisode = Anime.getNextEpisode();
        let previousEpisode = Anime.getPreviousEpisode();

        _episodeTitle.empty();
        _boxNextEpisode.empty();

        $('<h4>').text(anime.title).appendTo(_episodeTitle);
        $('<span>').text(episode.title).appendTo(_episodeTitle);

        if(nextEpisode) {
            $('<h4>').text('Próximo Episódio').appendTo(_boxNextEpisode);
            $('<img>').attr('src', anime.img).appendTo(_boxNextEpisode);
            $('<h5>').text(nextEpisode.title).appendTo(_boxNextEpisode);
            $('<em>').text(nextEpisode.description).appendTo(_boxNextEpisode);
            $('<span>').appendTo(_boxNextEpisode);
        }

        if(previousEpisode) {
            $('<h4>').text('Episódio Anterior').appendTo(_boxPreviousEpisode);
            $('<img>').attr('src', anime.img).appendTo(_boxPreviousEpisode);
            $('<h5>').text(previousEpisode.title).appendTo(_boxPreviousEpisode);
            $('<em>').text(previousEpisode.description).appendTo(_boxPreviousEpisode);
            $('<span>').appendTo(_boxPreviousEpisode);
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

            _viewPort.css({
                'margin' : '60px 180px 0 180px',
                'position' : 'relative'
            });

            if(_btnNext.css('display') != 'none'){

                _btnNext.css({
                    'margin-top' : '11.5%'
                });

                $(_video).css({
                    'margin-left' : '10%',
                    'transition' : 'none'
                });
            }

        }else{

            _viewPort.css({
                'margin' : '0',
                'position' : 'relative'
            });

            if(_btnNext.css('display') != 'none'){

                $(_video).css({
                    'margin-left' : '20%',
                    'transition' : 'none'
                });

                _btnNext.css({
                    'margin-top' : '10%',
                    'right' : '20%'
                });
            }


        }
    }

    function _createVideoActions(){
        _createActionSkip();
        _createActionNext();
    }

    function _skipVideo(){
        _video.currentTime =  Anime.getCurrentEpisode().open_end;
    }

    function _createActionSkip(){

        let episode = Anime.getCurrentEpisode();
        let startTime = episode.open_start;
        let endTime = episode.open_end;
        let btnSkip = $('#btnSkip');

        checkTime();

        function checkTime() {

            if (_video.currentTime >= startTime) {

                if (_video.currentTime < endTime) {
                    btnSkip.fadeIn("slow", function () {
                        btnSkip.css('display', 'block');
                    });
                }
                if (_video.currentTime >= endTime) {
                    btnSkip.css('display', 'none');
                } else {
                    setTimeout(checkTime, 1000);
                }

            } else {
                setTimeout(checkTime, 1000);
                btnSkip.css('display', 'none');
            }
        }
    }

    function _createActionNext(){

        let episode = Anime.getCurrentEpisode();
        let endTime = episode.end_start;
        let timeStart = $('#next-episode-time');
        let time = 12;

        checkTimeEnding();

        function checkTimeEnding() {

            if(endTime){

                if (_video.currentTime >= endTime) {

                    checkSecsEnding();

                    _btnNext.fadeIn('slow', function(){
                        _btnNext.css('display', 'block');
                    });

                    _minimizeVideo();

                } else {

                    if(_btnNext && _btnNext.css('display') != 'none'){
                        _maximizeVideo();
                        _btnNext.css('display', 'none');
                    }

                    setTimeout(checkTimeEnding, 1000);
                }
            }
        }

        function checkSecsEnding(){

            let timeout = setTimeout(checkTime, 1000);

            $(_video).bind('click', function(){
                clearTimeout(timeout);
                _maximizeVideo();
                _btnNext.css('display', 'none');
            });

            _btnPlay.bind('click', function(){
                if(_video.paused){
                    clearTimeout(timeout);
                }else{
                    timeout = setTimeout(checkTime, 1000)
                }
            });

            _progressSlider.slider({
                slide : function(event, ui){
                    clearTimeout(timeout);
                    _maximizeVideo();
                    _btnNext.css('display', 'none');
                }
            });

            function checkTime(){

                if(time <= 0){
                    _btnNext.css('display', 'none');
                    _maximizeVideo();
                    _playNextEpisode();
                }else{
                    time -= 1;
                    timeStart.text(time + ' segundos');
                    timeout = setTimeout(checkTime, 1000);
                }
            }
        }
    }

    function _minimizeVideo(){

       $(_video).css({
           'transition' : 'all .4s ease-in-out',
           'width' : '400px',
           'margin-left' : '10%',
           'margin-top' : '10%',
           'border' : '2px solid #fff',
           'cursor' : 'pointer',
           'opacity' : '0.7'
       });

       $(_video).bind('mouseover', function(){
           $(this).css('opacity', '0.9');
       });

        $(_video).bind('mouseleave', function(){
            $(this).css('opacity', '0.7');
        })
    }

    function _maximizeVideo(){

        $(_video).removeAttr('style');
        $(_video).css({
            'width' : '100%',
            'transition' : 'all .4s ease-in-out'
        });

        $(_video).unbind( 'mouseover' );
        $(_video).unbind( 'mouseleave' );
    }

    function _updateProgressBar(x){

        let maxduration = _video.duration;
        let currentPos = _video.currentTime; //Get currenttime
        let position = x - _progressContainer.offset().left;
        let percentage = 100 * position / _progressContainer.width();
        let percentAux = 100 * currentPos / maxduration; //in %

        if (percentage > 100) {
            percentage = 100;
        }
        if (percentage < 0) {
            percentage = 0;
        }
        _progressSlider.slider( "option", "value", Math.round(percentAux));
        _progressAux.css({'width' : percentage+ 0.5 + '%'});
        _video.currentTime = maxduration * percentage / 100;
    }

    function _manageProgressBar(){

        let currentTime = _video.currentTime; //Get currenttime
        let maxduration = _video.duration; //Get video duration
        let percentage = 100 * currentTime / maxduration; //in %
        _progressAux.css({'width' : parseInt(percentage + 0.5) + '%'});
        _progressSlider.slider( "option", "value", percentage);

        if(_progressTime){
            _progressTime.text(_getTime(_video.currentTime));
        }
    }

    function _listSeasons(){

        let seasons = Anime.getSeasons();
        let currentSeason = Anime.getCurrentSeason();
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

                    _setCurrentSeason(value.season);

                    if(!$(this).hasClass('active')){
                        _setCurrentEpisode(1);
                    }

                    _listEpisodes();
                })
                .appendTo(containerBody);

            if(value.season === currentSeason.season){
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
    function _listEpisodes() {

        let currentSeason = Anime.getCurrentSeason();
        let currentEpisode = Anime.getCurrentEpisode();
        let episodes = Anime.getEpisodes(currentSeason);
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

        $('<h5>')
            .text('Temporada ' + currentSeason.season)
            .appendTo(containerHead);

        $.each(episodes, function (key, value) {

            let episode = $('<div>')
                .addClass('episode')
                .on('click', function(){
                    _setCurrentEpisode(value.episode);
                    _listEpisodes();
                    _playCurrentEpisode();
                })
                .appendTo(containerBody);

            console.log(currentSeason);
            if(value.episode === currentEpisode.episode){
                episode.removeAttr('class');
                episode.addClass('episode active');
            }

            $('<h5>')
                .text('Episódio ' + value.episode)
                .appendTo(episode);

            $('<div>')
                .addClass('aux-progress')
                .attr({
                    'data-toggle': 'tooltip',
                    'data-placement': 'top',
                    'title': '50%'
                })
                .appendTo(episode);

            $('<div>')
                .addClass('progress')
                .attr({
                    'data-toggle': 'tooltip',
                    'data-placement': 'top',
                    'title': '50%'
                })
                .appendTo(episode);

            $('<i>')
                .addClass('fas fa-play-circle')
                .appendTo(episode);
        });


        $('<span>')
            .appendTo(_controlEpisodes);
    }

    function _getProgressPercentage(){

        let maxduration = _video.duration;
        let currentPos = _video.currentTime; //Get currenttime
        let percentage = 100 / (maxduration / currentPos);

        if (percentage > 100) {
            percentage = 100;
        }
        if (percentage < 0) {
            percentage = 0;
        }

        return percentage;
    }

    function _setCurrentEpisode(index){

        let currentSeason = Anime.getCurrentSeason();
        let episode = Anime.getEpisode(currentSeason, index);

        Anime.setCurrentEpisode(episode);
    }

    function _setCurrentSeason(index){

        let season = Anime.getSeason(index);
        Anime.setCurrentSeason(season);
    }

    function _showControls(){
        _controlsContainer.css('display', 'block');
        _progressContainer.css('display', 'block');
        _btnReturn.css('display', 'block');
        _btnSkipSeconds.css('display', 'block');
        _btnBackSeconds.css('display', 'block');
    }

    function _hideControls(){
        _controlsContainer.css('display', 'none');
        _progressContainer.css('display', 'none');
        _btnReturn.css('display', 'none');
        _btnSkipSeconds.css('display', 'none');
        _btnBackSeconds.css('display', 'none');
    }

    function _manageControls() {

        let interval = 0;
        let idleInterval = setInterval(timerIncrement, 500);

        _viewPort.mousemove(function () {
            interval = 0;
            _showControls();
        });

        _viewPort.keypress(function (event) {
            interval = 0;
            _showControls();
        });

        _controlsContainer.bind("mouseover", function () {
            clearIddleInterval();
        });

        _controlsContainer.bind("mouseleave", function () {
            clearIddleInterval(true);
        });

        _progressContainer.bind("mouseover", function () {
            clearIddleInterval();
        });

        _progressContainer.bind("mouseleave", function () {
            clearIddleInterval(true);
        });

        _btnReturn.bind("mouseover", function () {
            clearIddleInterval();
        });

        _btnReturn.bind("mouseleave", function () {
            clearIddleInterval(true);
        });

        _btnSkipSeconds.bind("mouseover", function () {
            clearIddleInterval();
        });

        _btnBackSeconds.bind("mouseleave", function () {
            clearIddleInterval(true);
        });

        function clearIddleInterval(setNew){
            interval = 0;
            clearInterval(idleInterval);
            if(setNew) idleInterval = setInterval(timerIncrement, 500);
        }

        function timerIncrement() {
            interval = interval + 500;
            if (interval > 1500 && !_video.paused) {
                _hideControls();
            }
        }
    }

    function _unbindControls(){

        _viewPort.unbind('mouseove');
        _viewPort.unbind('keypress');
        _controlsContainer.unbind('mouseover');
        _controlsContainer.unbind('mouseleave');
        _progressContainer.unbind('mouseover');
        _progressContainer.unbind('mouseleave');
        _btnReturn.unbind('mouseover');
        _btnReturn.unbind('mouseleave');
    }

    function _checkControls(){

        checkTime();

        function checkTime() {

            if (_video.currentTime >= 6) {
                _manageControls();
            } else {
                setTimeout(checkTime, 1000);
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
        $('#tooltip-' + tooltip).css('display', 'block');
    }

    function _hideTooltip(tooltip){
        $('#tooltip-' + tooltip).css('display', 'none');
    }

    function _skipSeconds(){
        _video.currentTime = _video.currentTime + 5;
    }

    function _backSeconds(){
        _video.currentTime = _video.currentTime - 5;
    }

    return {
        setVideo: _setVideo,
        getVideo: _getVideo,
        play : _play,
        pause: _pause,
        mute: _mute,
        unMute : _unMute,
        showVolume : _showVolume,
        hideVolume : _hideVolume,
        playNextEpisode: _playNextEpisode,
        showNextEpisode : _showNextEpisode,
        hideNextEpisode : _hideNextEpisode,
        playPreviousEpisode : _playPreviousEpisode,
        showPreviousEpisode : _showPreviousEpisode,
        hidePreviousEpisode : _hidePreviousEpisode,
        setCurrentData : _setCurrentData,
        toggleFullScreen: _toggleFullScreen,
        fullScreenVideo : _fullScreenVideo,
        returnListAnimes : _returnListAnimes,
        createVideoActions: _createVideoActions,
        skipVideo : _skipVideo,
        createSliders : _createSliders,
        manageProgressBar : _manageProgressBar,
        assignElements : _assignElements,
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
        getProgressPercentage : _getProgressPercentage
    }

});