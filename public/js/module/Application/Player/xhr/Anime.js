let Player_Anime = new (function () {

    let data = null;
    let currentSeason = null;
    let currentEpisode = null;
    let currentAnime = null;

    function _setData(trackAnime, callback){

        _getAnime(trackAnime, function(response){

            data = response.anime;

            if(typeof(callback) === 'function'){
                callback(data);
            }
        });
    }

    function _getData(){
        return data;
    }

    function _setCurrentData(){

        data.client_anime.current_season = currentSeason.season;
        data.client_anime.current_episode = currentEpisode.episode;
        data.client_anime.last_activity = new Date().toLocaleString();

        _saveClientAnime(data.client_anime);
    }

    function _setCurrentSeason(season){
        currentSeason = season;
    }

    function _getCurrentSeason(first = false){

        if(first){
            return data.client_anime.current_season;
        }

        return currentSeason;
    }

    function _setCurrentEpisode(episode)
    {
        _setEpisodeProgress(function(){
            currentEpisode = episode;
        });
    }

    function _getCurrentEpisode(first = false){

        if(first){
            return data.client_anime.current_episode;
        }

        return currentEpisode;
    }

    function _getCurrentAnime(){
        return data;
    }

    function _getPreviousEpisode(){
        let previousEpisode = parseInt(currentEpisode.episode) - 1;
        return _getEpisode(currentSeason, previousEpisode);
    }

    function _getNextEpisode(change = false){

        let nextEpisode = parseInt(currentEpisode.episode) + 1;
        let episode = currentSeason.episodes['episode ' + nextEpisode];

        if(!episode){

            let nextSeason = _getNextSeason();

            if(nextSeason){

                let episode = nextSeason.episodes['episode ' + 1];

                if(change){
                    _setCurrentSeason(nextSeason);
                    _setCurrentEpisode(episode);
                }

                return episode;
            }
        }else{

            if(change){
                _setCurrentEpisode(episode);
            }
        }

        return episode;

        //return _getEpisode(currentSeason, nextEpisode);
    }

    function _getNextSeason(){

        let nextSeason = parseInt(currentSeason.season) + 1;
        return _getSeason(nextSeason);
    }

    function _getSeasons(){
        return data.seasons;
    }

    function _getSeason(index){
        return data.seasons['season ' + index];
    }

    function _getSeasonById(id){

        let season = null;

        $.each(data.seasons, function( index, value ) {
            if(parseInt(value.id) === parseInt(id)){
                season = value;
                return false;
            }
        });

        return season;
    }

    function _getNumberSeasons(){
        return Object.keys(data.seasons).length;
    }

    function _getEpisodes(season){
        return season.episodes;
    }

    function _getEpisode(season, index){
        return season.episodes['episode ' + index];
    }

    function _getNumberEpisodes(season){
        return Object.keys(season.episodes).length;
    }

    function _getVideos(episode){
        return episode.videos;
    }

    function _getVideo(episode, callback, index = null, checkUrl = true){

        let videos_not_working = [];

        if(index){
            return episode.videos['video ' + index];
        }

        index = 1;
        let videos = episode.videos;
        let video = getVideo(index);
        let found = false;

        function getVideo(){
            return videos['video ' + index];
        }

        return callback(video);

        if(!checkUrl){
             return callback(video);
        }

        checkVideo();

         function checkVideo(){

             _checkUrlVideo(video.url, function(is_working, changeStatus = true){

                 if(is_working){
                     callback(video);
                     found = true;

                     if(changeStatus){
                         _saveVideoStatus(videos_not_working);
                     }
                 }else{

                     Player_Helper.clearConsole();

                     if(!found){

                         videos_not_working.push(video);
                         video = getVideo(index);
                         index++;

                         if(video){
                             checkVideo();
                         }
                     }
                 }
             });
         }
    }

    function _getNumberVideos(episode){
        return Object.keys(episode.videos).length;
    }

    function _getAnime(track, callback){

        $.ajax({
            type : 'GET',
            url  :'/anime/getPlayerAnime?trackId=' + track,
            success: function(response){

                if(typeof(callback) === 'function'){
                    callback(JSON.parse(response));
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        });
    }

    function _saveCache(data){

        $.ajax({
            type : 'POST',
            url  :'/anime/saveCache',
            data: data,
            success: function(response){

                let data = JSON.parse(response);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        });
    }

    function _saveClientAnime(dataClient, callback){

        $.ajax({
            type : 'POST',
            url  :'/anime/saveClientAnime',
            data: dataClient,
            success: function(response){

                if(typeof(callback) === 'function'){
                    callback(JSON.parse(response));
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        });

    }

    function _saveClientEpisode(dataEpisode, callback){

        dataEpisode.id_anime =  _getData().id;

        $.ajax({
            type : 'POST',
            url  :'/anime/saveClientEpisode',
            data: dataEpisode,
            success: function(response){

                if(typeof(callback) === 'function'){
                    callback(JSON.parse(response));
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        });
    }

    function _getClientData(track, callback){

        $.ajax({
            type : 'GET',
            url  :'/anime/getClientData?trackId=' + track,
            success: function(response){

                let data = JSON.parse(response);

                if(typeof(callback) === 'function'){
                    callback(data);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        });
    }

    function _setEpisodeProgress(callback){

        let percentage = Player_Helper.getProgressPercentage();

        if(currentEpisode && percentage !== 0){
            currentEpisode.progress = percentage;
            _saveClientEpisode(currentEpisode);
        }

        if(typeof(callback) === 'function'){
            callback();
        }
    }

    function _sendEpisodeReport(callback){

        let episode = Player_Anime.getCurrentEpisode();
        let anime = Player_Anime.getCurrentAnime();

        let data = {
            'id_episode' : episode.id,
            'id_anime' : anime.id
        };

        $.ajax({
            type : 'POST',
            url  :'/anime/saveEpisodeReport',
            data: data,
            success: function(response){

                let data = JSON.parse(response);

                if(typeof(callback) === 'function'){
                    callback(data);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        });
    }

    function _checkUrlVideo(url, callback) {

        let xhr = new XMLHttpRequest();

        xhr.open("GET", url, true);

        xhr.onreadystatechange = function (oEvent) {

            if (xhr.status === 200) {
                callback(true);
                xhr.abort();
            } else {
                callback(false);
            }
        };

        xhr.addEventListener("error", function(){
            callback(true, false);
        });

        xhr.send(null);


      /*  $.ajax({
            type : 'GET',
            url  :url,
            dataType: 'jsonp',
            success: function(response){
                callback(true);
                alert('success');
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('error');
                callback(false);
            }
        });*/
    }

    function _saveVideoStatus(videos, callback){

        if(videos.length > 0){

            let data = {};
            for ( let index in videos ) {
                data[index] = videos[index].id;
            }
            $.ajax({
                type : 'POST',
                url  :'/anime/saveVideoStatus',
                data: data,
                success: function(response){

                    let data = JSON.parse(response);

                    if(typeof(callback) === 'function'){
                        callback(data);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            });
        }
    }

    function _getRelatedAnimes(track, callback){

        $.ajax({
            type : 'GET',
            url  :'/anime/getRelatedAnimes?trackId=' + track,
            success: function(response){

                let data = JSON.parse(response);

                if(typeof(callback) === 'function'){
                    callback(data);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        });
    }


    return {
        setData : _setData,
        getData : _getData,
        getAnime : _getAnime,
        getSeasons: _getSeasons,
        getSeason: _getSeason,
        getSeasonById : _getSeasonById,
        getNumberSeasons :_getNumberSeasons,
        getEpisodes : _getEpisodes,
        getEpisode: _getEpisode,
        getNumberEpisodes :_getNumberEpisodes,
        getVideos : _getVideos,
        getVideo: _getVideo,
        getNumberVideos :_getNumberVideos,
        setCurrentSeason : _setCurrentSeason,
        getCurrentSeason : _getCurrentSeason,
        setCurrentEpisode : _setCurrentEpisode,
        getCurrentEpisode : _getCurrentEpisode,
        getCurrentAnime : _getCurrentAnime,
        getNextEpisode : _getNextEpisode,
        getPreviousEpisode : _getPreviousEpisode,
        saveCache : _saveCache,
        saveClientEpisode : _saveClientEpisode,
        getClientData : _getClientData,
        setEpisodeProgress : _setEpisodeProgress,
        setCurrentData : _setCurrentData,
        sendEpisodeReport : _sendEpisodeReport,
        getRelatedAnimes : _getRelatedAnimes
    }

});