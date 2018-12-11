
let App_Helper = new (function () {

    let _container = null;
    let _containerCarousel = null;
    let _column = null;
    let _carousel = null;
    let _carouselInner = null;
    let _carouselId = null;
    let _loader = null;
    let _navbar = null;
    let _searchBar = null;
    let _searchInput = null;
    let _searchFilter = null;
    let _containerSearch = null;

    function _assignElements(){

        _container = $('.container-fluid');
        _containerCarousel = $('#container-carousel');
        _carousel = $('#carousel-animes');
        _loader = $('#loader-wrapper');
        _column = $('.col-xs-12');
        _carouselInner = $('.carousel-inner');
        _navbar = $('.navbar');
        _searchBar = $('.search-bar');
        _searchInput = $('.search-input');
        _searchFilter = $('.search-filter');
        _containerSearch = $('.container-search');

        _carouselId = _carousel.attr('id');
    }

    function _listCurrentAnimes(callback){

        App_Anime.getCurrentAnimes(function(data){

            let i = 0;
            let item = null;
            let first = true;

            if(Object.keys(data.current_animes).length <= 0){
                return false;
            }

            $.each(data.current_animes, function (key, value) {

                if((i % 5) === 0){
                    item = _createCarouselItem(first);
                    first = false;
                }

                _createCarouselList(item, value);
                i++;
            });

            if(i > 5){
                _createCarouselControl();
            }

            if(typeof(callback) === 'function'){
                callback(data);
            }
        });
    }

    function _listAnimes(callback){


        App_Anime.getCategories(function(categories){

            let index = 1;

            function getCategorie(i){
                return categories.categorias['categoria' + i];
            }

            function getAnimes(callback){

                let category = getCategorie(index);

                if(!category){

                    if(typeof(callback) === 'function'){
                        callback();
                    }

                    return false;
                }

                App_Anime.getAnimesByCategory(category.id, function(data){

                    if(Object.keys(data.animes).length <= 0){
                        return false;
                    }

                    let i = 0;
                    let item = null;
                    let first = true;

                    _createCarousel(category);

                    $.each(data.animes, function (key, value) {

                        if((i % 6) === 0){
                            item = _createCarouselItem(first);
                            first = false;
                        }
                        _createCarouselList(item, value);
                        i++;
                    });

                    if(i > 6){
                        _createCarouselControl();
                    }

                    index = index+1;
                    getAnimes(callback);
                });
            }

            getAnimes(function(){

                if(typeof(callback) === 'function'){
                    callback();
                }
            });
        });
    }

    function _listSearchAnimes(params){

        App_Helper.hideCarousel();
        App_Helper.showSearch();
        App_Helper.showLoader();

        _containerSearch.empty();

        App_Anime.getAnimes(params, function(data){

            if(Object.keys(data.animes).length <= 0){

                $('<img>')
                    .attr('src', 'img/Anime/utils/anime_not_found.png')
                    .css('opacity', '0.5')
                    .appendTo(_containerSearch);

                App_Helper.hideLoader();
                return false;
            }


            $.each(data.animes, function (key, value) {
                _createCarouselList(_containerSearch, value);
            });

            App_Helper.hideLoader();

        });
    }

    function _createCard(el, data){

        let card = $('<div>')
            .addClass('card')
            .attr('data-route', data.route)
            .appendTo(el);

        let thumb = $('<div>')
            .addClass('thumbnail')
            .appendTo(card);

        let link = $('<a>')
            .attr('href', data.route)
            .appendTo(thumb);

        $('<img>')
            .attr({
                'src' : data.img
            })
            .appendTo(link);

        let info = $('<div>')
            .addClass('card-info')
            .appendTo(card);

        let title = $('<h5>')
            .appendTo(info);

        $('<span>')
            .text(data.title)
            .appendTo(title);

        $('<span>')
            .text('Gênero: ' + data.genre)
            .appendTo(info);

        let episodes = $('<span>')
            .appendTo(info);

        let status = $('<div>')
            .addClass('status')
            .appendTo(title);

        let categories = $('<span>')
            .appendTo(info);

        _setEpisodes(episodes, data);
        _setStatus(status, data.status);
        _setCategories(categories, data.categories);

        card.bind('mouseover', function(){
            info.css('opacity', '0.9');
        });

        card.bind('mouseleave', function(){
            info.css('opacity', '0');
        });

        card.bind('click', function(){
            window.location.href = $(this).data('route');
        });
    }

    function _showControls(el, parent = false){

        if(parent)
            el.find('.control-box').css('display', 'block');
        else
            el.css('display', 'block');
    }

    function _hideControls(el, parent = false){

        if(parent)
            el.find('.control-box').css('display', 'none');
        else
            el.css('display', 'none');
    }

    function _setEpisodes(el, data){

        let episodes = data.episodes;

       /* if(episodes){

            if(parseInt(data.status) === 1){

                let digits = episodes.toString().length;

                let ch = '';
                for(let i = 0; i < digits; i++){
                    ch += '?';
                }

                episodes += '  -  ' + ch;
            }else{
                episodes += '  -  ' + data.episodes;
            }
        }*/

        el.text('Episódios: ' + episodes);
    }

    function _setCategories(el, categories){

        let text = '';
        let first = true;

        categories = _filterCategories(categories);

        $.each(categories, function (key, value) {

            if(first)
                text = value.title;
            else
                text += ' / ' + value.title;

            first = false;
        });

        el.text('Categorias: ' + text);
    }

    function _filterCategories(categories){

        let keys = ['fantasy', 'comedy', 'adventure', 'romance'];
        let data = [];

        $.each(categories, function (index, value) {
            if(keys.indexOf(value.key) !== -1){
                data[index] = value;
            }
        });

        categories = {};
        Object.assign(categories, data);
        return categories;
    }

    function _setStatus(el, status){

        switch(parseInt(status)){

            case 1 :

                el.css('background-color', '#39e80d');
                el.attr({
                    'data-toggle' : 'tooltip',
                    'title' : 'Anime em andamento'
                });
                break;

            case 2 :

                el.css('background-color', '#ffa80a');
                el.attr({
                    'data-toggle' : 'tooltip',
                    'title' : 'Anime completo'
                });
                break;

            case 3 :
                el.css('background-color', '#5f5b54')
                el.attr({
                    'data-toggle' : 'tooltip',
                    'title' : 'Anime encerrado'
                });
        }
    }


    function _createCarousel(category){

        _carouselId = 'carousel-' + category.key;

        _column = $('<div>')
            .addClass('col-xs-12')
            .appendTo(_containerCarousel);

        let carousel = $('<div>')
            .addClass('carousel slide')
            .attr('id', _carouselId)
            .appendTo(_column);

        let header = $('<div>')
            .addClass('carousel-header')
            .appendTo(carousel);

        $('<h4>')
            .text(category.title)
            .appendTo(header);

        _carouselInner = $('<div>')
            .addClass('carousel-inner')
            .appendTo(carousel);

        _column.bind('mouseenter', function(){
            _showControls($(this).find('nav'), true);
        });

        _column.bind('mouseleave', function(e){
            _hideControls($(this).find('nav'), true);
        });

        carousel.carousel({
            interval: false
        });
    }

    function _createCarouselItem(first){

        let item = $('<div>')
            .addClass('item')
            .appendTo(_carouselInner);

        let ul = $('<ul>')
            .addClass('thumbnails')
            .appendTo(item);

        if(first)
            item.addClass('active');

        return ul;
    }

    function _createCarouselList(el, data){

        let li = $('<li>')
            .addClass('col-sm-3')
            .appendTo(el);

        _createCard(li, data);
    }

    function _createCarouselControl(){

        let nav = $('<nav>')
            .appendTo(_column);

        let ul = $('<ul>')
            .addClass('control-box pager')
            .attr('data-page', '1')
            .appendTo(nav);

        _createBtnPrev(ul);
        _createBtnNext(ul);
    }

    function _createBtnPrev(ul){

        let li = $('<li>')
            .appendTo(ul);

        let a = $('<a>')
            .addClass('carousel-controls prev')
            .attr({
                'data-slide' : 'prev',
                'href' :   '#' + _carouselId
            })
            .on('click', function(){
                _clickBtnControls(this);
            })
            .appendTo(li);

        $('<i>')
            .addClass('glyphicon glyphicon-chevron-left')
            .appendTo(a);

    }

    function _createBtnNext(ul){

        let li = $('<li>')
            .appendTo(ul);

        let a = $('<a>')
            .addClass('carousel-controls next')
            .attr({
                'data-slide' : 'next',
                'href' :   '#' + _carouselId
            })
            .on('click', function(){
                _clickBtnControls(this);
            })
            .appendTo(li);

        $('<i>')
            .addClass('glyphicon glyphicon-chevron-right')
            .appendTo(a);

    }

    function _clickBtnControls(el){

        let ul = $(el).parent().parent();

        _hideControls(ul);

        setTimeout(function(){
            _showControls(ul);
        }, 600);
    }

    function _showLoader(){
        _loader.css('display', 'block');
    }

    function _hideLoader(){
        _loader.css('display', 'none');
    }

    function _showCarousel(){

        _containerCarousel.css({
            'visibility' : 'visible',
            'opacity' : '1',
            'display' : 'block'
        });

    }
    function _hideCarousel(){

        _containerCarousel.css({
            'visibility' : 'hidden',
            'opacity' : '0',
            'display' : 'table-column'
        });
    }

    function _showSearch(){

        _containerSearch.css({
            'visibility' : 'visible',
            'opacity' : '1',
            'display' : 'block'
        });

    }
    function _hideSearch(){

        _containerSearch.css({
            'visibility' : 'hidden',
            'opacity' : '0',
            'display' : 'table-column'
        });

    }

    function _getSearch(){

        return{
            input : _searchInput,
            filter : _searchFilter,
            bar : _searchBar
        };
    }

    return {
        assignElements: _assignElements,
        listAnimes : _listAnimes,
        listCurrentAnimes : _listCurrentAnimes,
        listSearchAnimes : _listSearchAnimes,
        showLoader : _showLoader,
        hideLoader : _hideLoader,
        showCarousel: _showCarousel,
        hideCarousel : _hideCarousel,
        showSearch: _showSearch,
        hideSearch : _hideSearch,
        getSearch : _getSearch

    }

});