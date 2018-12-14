let App_Anime = new (function () {

    function _getAnime(track, callback){

        $.ajax({
            type : 'POST',
            url  :'/anime/getAnime?trackId=' + track,
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

    function _getAnimes(params = null, callback){

        $.ajax({
            type : 'POST',
            url  :'/anime/getAnimes',
            data : params,
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

    function _getAnimesByCategory(id_category, callback){

        $.ajax({
            type : 'GET',
            url  :'/anime/getAnimesByCategory?category=' + id_category,
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

    function _getCurrentAnimes(callback){

        $.ajax({
            type : 'GET',
            url  :'/anime/getCurrentAnimes',
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

    function _getCategories(callback){

        $.ajax({
            type : 'GET',
            url  : '/anime/getAnimeCategories',
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

    function _saveAnime(data, callback){

        $.ajax({
            type : 'POST',
            url  :'/anime/saveAnime',
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

    function _saveClientList(idAnime, callback){

        $.ajax({
            type : 'POST',
            url  :'/anime/saveClientList',
            data: {'id_anime' : idAnime},
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
        getAnime : _getAnime,
        getAnimes : _getAnimes,
        getAnimesByCategory : _getAnimesByCategory,
        getCurrentAnimes : _getCurrentAnimes,
        getCategories : _getCategories,
        saveAnime : _saveAnime,
        saveClientList : _saveClientList

    }

});