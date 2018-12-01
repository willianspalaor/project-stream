let Anime = new (function () {

    let data = null;
    let currentSeason = null;
    let currentEpisode = null;

    function _setData(trackAnime, callback){

        _getAnime(trackAnime, function(response){

            data = response.anime;

            if(typeof(callback) === 'function'){
                callback();
            }
        });
    }

    function _getData(){
        return data;
    }

    function _setCurrentSeason(season){
        currentSeason = season;
    }

    function _getCurrentSeason(){
        return currentSeason;
    }

    function _setCurrentEpisode(episode){

        currentEpisode = episode;

        let data = {
            percentage : '30%',
            trackAnime : 'c4ca4238a0b923820dcc509a6f75849b',
            trackEpisode : 'c4ca4238a0b923820dcc509a6f75849b'
        };

        Anime.saveCache(data)
    }

    function _getCurrentEpisode(){
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
            url  :'/player/getAnime?trackId=' + track,
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
            url  :'/player/saveCache',
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

    return {
        setData : _setData,
        getData : _getData,
        getSeasons: _getSeasons,
        getSeason: _getSeason,
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
        saveCache : _saveCache
    }

});