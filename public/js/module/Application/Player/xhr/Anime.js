let Player_Anime = new (function () {

    let data = null;
    let currentSeason = null;
    let currentEpisode = null;

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

    function _getPreviousEpisode(){
        let previousEpisode = parseInt(currentEpisode.episode) - 1;
        return _getEpisode(currentSeason, previousEpisode);
    }

    function _getNextEpisode(){
        let nextEpisode = parseInt(currentEpisode.episode) + 1;
        return _getEpisode(currentSeason, nextEpisode);
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

    function _getVideo(episode, index ){
        return episode.videos['video ' + index];
    }

    function _getNumberVideos(episode){
        return Object.keys(episode.videos).length;
    }

    function _getAnime(track, callback){

        $.ajax({
            type : 'GET',
            url  :'/anime/getPlayerAnime?trackId=' + track,
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

    function _saveCache(data){

        $.ajax({
            type : 'POST',
            url  :'/anime/saveCache',
            data: data,
            success: function(response){

                let data = JSON.parse(response);
                console.log(data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        });
    }

    function _saveClientAnime(data, callback){

        $.ajax({
            type : 'POST',
            url  :'/anime/saveClientAnime',
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

    function _saveClientEpisode(data, callback){

        data.id_anime =  _getData().id;

        $.ajax({
            type : 'POST',
            url  :'/anime/saveClientEpisode',
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

    return {
        setData : _setData,
        getData : _getData,
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
        getNextEpisode : _getNextEpisode,
        getPreviousEpisode : _getPreviousEpisode,
        saveCache : _saveCache,
        saveClientEpisode : _saveClientEpisode,
        getClientData : _getClientData,
        setEpisodeProgress : _setEpisodeProgress,
        setCurrentData : _setCurrentData
    }

});