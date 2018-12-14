
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
    let _sidebarNav = null;
    let _sidebarWrapper = null;
    let _wrapperContent = null;

    function _assignElements(){

        _carousel = $('#carousel-animes');
        _loader = $('#loader-wrapper');
        _sidebarWrapper = $('#sidebar-wrapper');
        _wrapperContent = $('#page-content-wrapper');
        _containerCarousel = $('#container-carousel');
        _container = $('.container-fluid');
        _column = $('.col-xs-12');
        _carouselInner = $('.carousel-inner');
        _navbar = $('.navbar');
        _searchBar = $('.search-bar');
        _searchInput = $('.search-input');
        _searchFilter = $('.search-filter');
        _containerSearch = $('.container-search');
        _sidebarNav = $('.sidebar-nav');


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
        App_Helper.showWrapper();
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
            .attr({
                'data-route' : data.route,
                'data-track' : data.track,
                'data-id' : data.id
            })
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

        $('<div>')
            .addClass('overlay')
            .appendTo(card);

        $('<video muted>')
            .attr({
                'src' : '/videos/trailers/boruto_next_generations.mp4',
                'type' : 'video/mp4'
            }).appendTo(card);


        _createCardInfo(card, data);
        _createCardButtons(card, data);
        _bindCardEvents(card);
    }

    function _createCardInfo(el, data){

        let info = $('<div>')
            .addClass('info')
            .appendTo(el);

        $('<h6>')
            .text(data.title)
            .addClass('title')
            .appendTo(info);

        let status = $('<h6>')
            .addClass('status')
            .appendTo(info);

        $('<h6>')
            .addClass('seasons')
            .text(data.seasons + ' Temporadas')
            .appendTo(info);

        $('<p>')
            .addClass('description')
            .text(data.description)
            .appendTo(info);


        info.bind('click', function(){
            window.location.href = $(this).parent().attr('data-route');
        });

        _setStatus(status, data.status);
    }

    function _createCardButtons(el){

        let buttons = $('<div>')
            .addClass('icons')
            .appendTo(el);

        let btnPlay = $('<div>')
            .addClass('icon play')
            .on('click', function(){
                let card = $(this).parent().parent();
                window.location.href = card.attr('data-route');
            })
            .appendTo(buttons);

        $('<i>')
            .addClass('fas fa-play')
            .appendTo(btnPlay);

        let btnVolume = $('<div>')
            .addClass('icon volume')
            .on('click', function(){
                _setCardVolume($(this));
            })
            .appendTo(buttons);

        $('<i>')
            .addClass('fas fa-volume-mute')
            .appendTo(btnVolume);

        let btnThumbUp = $('<div>')
            .addClass('icon thumb-up')
            .on('click', function(){
                _setAnimeThumb($(this), 'up');
            })
            .appendTo(buttons);

        $('<i>')
            .addClass('fas fa-thumbs-up')
            .appendTo(btnThumbUp);

        let btnThumbDown = $('<div>')
            .addClass('icon thumb-down')
            .on('click', function(){
                _setAnimeThumb($(this), 'down');
            })
            .appendTo(buttons);

        $('<i>')
            .addClass('fas fa-thumbs-down')
            .appendTo(btnThumbDown);

        let btnPlus = $('<div>')
            .addClass('icon plus')
            .on('click', function(){
                _setClientList($(this));
            })
            .appendTo(buttons);

        $('<i>')
            .addClass('fas fa-plus')
            .appendTo(btnPlus);
    }

    function _setCardVolume(el){

        let icons = el.parent();
        let icon = el.find('i');
        let card = icons.parent();
        let video = card.find('video');

        icon.removeClass();

        if(video[0].muted){
            icon.addClass('fas fa-volume-up');
            video[0].muted = false;
        }else{
            icon.addClass('fas fa-volume-mute');
            video[0].muted = true;
        }
    }

    function _setAnimeThumb(el, thumb){

        let card = el.parent().parent();
        let track = card.attr('data-track');
        let thumbs = 0;

        App_Anime.getAnime(track, function(data){

            if(thumb === 'up'){
                if(data.anime.thumb_up){
                    thumbs = data.anime.thumb_up;
                }
                data.anime.thumb_up = parseInt(thumbs) + 1;
            }else{
                if(data.anime.thumb_down){
                    thumbs = data.anime.thumb_down;
                }
                data.anime.thumb_down = parseInt(thumbs)+ 1;
            }

            App_Anime.saveAnime(data.anime, function(teste){
                console.log(teste);
            })
        });
    }

    function _setClientList(el){

        let card = el.parent().parent();
        let id = card.attr('data-id');

        App_Anime.saveClientList(id, function(data){
            console.log(data);
        })
    }

    function _bindCardEvents(el){

        let enter = false;
        let timeoutVideo = null;
        let timeoutInfo = null;
        let timeoutMove = null;

        el.bind('mouseenter', function(){

            enter = true;

            let element = $(this);
            let video = element.find('video');

            _checkCards(element, true);
            element.find('.overlay').css('display', 'block');
            element.find('.info, .icons').css('opacity', '1');

            timeoutVideo = setTimeout(function(){

                if(enter){

                    element.find('img').css('display', 'none');
                    video.css('opacity', '1');

                    video[0].load();
                    video[0].play();

                    timeoutInfo = setTimeout(function(){
                        element.find('.info, .icons').css('opacity', '0');
                    }, 3000);
                }

            }, 3000);

        });

        el.bind('mouseleave', function(){

            enter = false;
            clearTimeout(timeoutVideo);

            let element = $(this);
            let video = element.find('video');

            _checkCards(element, false);

            element.find('img').css('display', 'block');
            element.find('.overlay').css('display', 'none');
            element.find('.info, .icons').css('opacity', '0');
            video.css('opacity', '0');

             video[0].pause();
        });


        el.bind('mousemove', function(){

            clearTimeout(timeoutMove);
            let element = $(this);

            element.find('.info, .icons').css('opacity', '1');

            timeoutMove = setTimeout(function(){

                clearTimeout(timeoutInfo);

                timeoutInfo = setTimeout(function(){
                    element.find('.info, .icons').css('opacity', '0');
                }, 3000);

            }, 50);
        });

    }

    function _checkCards(el, show){

        let active = false;
        let container = el.parent().parent();

        if(show){
            el.parent().addClass('active');
        }else{
            el.parent().removeClass('active');
        }

        container.find('li').each(function() {

            let li = $(this);

            if(!li.hasClass('active')){
                if(show){
                    if(active){
                        li.css('transform', 'translate(80px, 0)');
                    }else{
                        li.css('transform', 'translate(-80px, 0)');
                    }
                }else{
                    li.removeAttr('style');
                }

            }else{
                active = true;
            }
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
                    el.css('color', '#36ff3e').text('Anime em andamento');
                    break;
            case 2 :

                el.css('color', '#ffa80a').text('Anime completo');
                break;

            case 3 :
                el.css('color', '#ff3636').text('Anime cancelado');
                break;
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
            .addClass('fa fa-chevron-left')
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
            .addClass('fa fa-chevron-right')
            .appendTo(a);

    }

    function _clickBtnControls(el){

        let ul = $(el).parent().parent();

        _hideControls(ul);

        setTimeout(function(){
            _showControls(ul);
        }, 600);
    }

    function _showLoader(callback){
        _loader.css('display', 'block');

        if(typeof(callback) === 'function'){
            callback();
        }
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

    function _showWrapper(){
        _sidebarWrapper.css('display', 'block');
        _wrapperContent.css('display', 'block');
    }

    function _hideWrapper(){
        _sidebarWrapper.css('display', 'none');
        _wrapperContent.css('display', 'none');
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

    function _prepareSearch(){

        App_Anime.getCategories(function(categories) {

            $.each(categories.categorias, function (key, value) {

                let li = $('<li>')
                    .appendTo(_sidebarNav);

                $('<a>')
                    .attr('href', '#')
                    .text(value.title)
                    .appendTo(li);
            });
        });
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
        showWrapper : _showWrapper,
        hideWrapper : _hideWrapper,
        hideSearch : _hideSearch,
        getSearch : _getSearch,
        prepareSearch : _prepareSearch

    }

});