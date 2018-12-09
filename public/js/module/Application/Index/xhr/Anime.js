let App_Anime = new (function () {

    function _getAnimes(callback){

        $.ajax({
            type : 'GET',
            url  :'/anime/getAnimes',
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
            url  :'/anime/getAnimeCategories',
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
        getAnimes : _getAnimes,
        getAnimesByCategory : _getAnimesByCategory,
        getCurrentAnimes : _getCurrentAnimes,
        getCategories : _getCategories

    }

});