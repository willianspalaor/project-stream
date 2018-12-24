
let App_Helper = new (function () {

    let _content = null;
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
    let _searchReturn = null;
    let _searchIcon = null;
    let _containerSearch = null;
    let _sidebarTop = null;
    let _sidebarTopWrapper = null;
    let _sidebarLeft = null;
    let _sidebarLeftWrapper = null;
    let _sidebarRight = null;
    let _sidebarRightWrapper = null;
    let _filterSelects = [];
    let _filterParams = {};
    let _searchTimeout = null;
    let _filtersClear = false;

    function _assignElements(){

        _content = $('.content');
        _carousel = $('#carousel-animes');
        _loader = $('#loader-wrapper');
        _sidebarTopWrapper = $('#sidebar-top-wrapper');
        _sidebarRightWrapper = $('#sidebar-right-wrapper');
        _sidebarLeftWrapper = $('#sidebar-left-wrapper');
        _containerCarousel = $('#container-carousel');
        _carouselInner = $('#carousel-inner');
        _sidebarTop = $('#sidebar-top');
        _sidebarRight = $('#sidebar-right');
        _sidebarLeft = $('#sidebar-left');
        _container = $('.container-fluid');
        _column = $('.col-xs-12');
        _navbar = $('.navbar');
        _searchBar = $('.search-bar');
        _searchInput = $('.search-input');
        _searchReturn = $('.search-return');
        _searchIcon = $('.search-icon');
        _containerSearch = $('.container-search');

        _carouselId = _carousel.attr('id');
    }

    function _listCurrentAnimes(callback){

        App_Anime.getCurrentAnimes(function(data){

            let i = 0;
            let item = null;
            let first = true;

            if(Object.keys(data.current_animes).length > 0) {

                _carousel.parent().css('display', 'block');

                $.each(data.current_animes, function (key, value) {

                    if ((i % 6) === 0) {
                        item = _createCarouselItem(first);
                        first = false;
                    }

                    _createCarouselList(item, value);
                    i++;
                });

                if (i > 6) {
                    _createCarouselControl();
                }
            }else{
                _carousel.parent().css('display', 'none');
            }

            if(typeof(callback) === 'function'){
                callback(data);
            }
        });
    }

    function _listAnimes(callback){


        App_Anime.getCategories(function(data){

            let index = 1;

            function getCategorie(i){
                return data.categories['category' + i];
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

                    if(Object.keys(data.animes).length > 0) {

                        let i = 0;
                        let item = null;
                        let first = true;

                        _createCarousel(category);

                        $.each(data.animes, function (key, value) {

                            if ((i % 6) === 0) {
                                item = _createCarouselItem(first);
                                first = false;
                            }
                            _createCarouselList(item, value);
                            i++;
                        });

                        if (i > 6) {
                            _createCarouselControl();
                        }
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

    function _listSearchAnimes(params, callback = null, showloader = true){

        App_Helper.hideCarousel();
        App_Helper.showSearch();
        App_Helper.showWrapper();

        $('.search-return').css('display', 'block');

        if(showloader)
            App_Helper.showLoader();

        _containerSearch.empty();

        App_Anime.getAnimes(params, function(data){

            if(Object.keys(data.animes).length <= 0){
                App_Helper.hideLoader();
                //_showMessageNotFound();
                return false;
            }else{
                _hideMessageNotFound();
            }

            let i = 0;
            let index = 1;
            let item = null;
            let category = {};
            let first = true;

            function createCarousel(index){

                category.key = 'search' + index;
                category.title = '';

                _createCarousel(category, _containerSearch);
            }

            $.each(data.animes, function (key, value) {

                if((i % 5) === 0){
                    createCarousel(index);
                    first = true;
                    index++;
                }

                if(first){
                    item = _createCarouselItem(true);
                    first = false;
                }

                _createCarouselList(item, value);
                i++;
            });


            App_Helper.hideLoader();

            if(typeof(callback) === 'function'){
                callback(data);
            }
        });
    }

    function _createSelectedFilters(filter, text){

        let selectedFilters = _content.find('.selected-filters');

        if(!selectedFilters[0]){
            selectedFilters = $('<div>')
                .addClass('selected-filters')
                .appendTo(_content);
        }

        selectedFilters.css('display', 'block');

        if(filter){

            let span = null;

            selectedFilters.find('span').each(function(key, value) {
                if($(value).attr('data-filter') === filter){
                    span = $(value);
                }
            });

            if(!span){

                $('<span>')
                    .html('<i class="fas fa-filter" />' + text)
                    .attr('data-filter', filter)
                    .appendTo(selectedFilters);
            }else{
                span.html('<i class="fas fa-filter" />' + text)
            }
        }
    }

    function _removeSelectedFilters(filter){

        let selectedFilters = _content.find('.selected-filters');
        if(selectedFilters[0]){


            selectedFilters.find('span').each(function(key, value) {
                if($(value).attr('data-filter') === filter){
                    $(value).remove();
                }
            });

            let count = 0;
            selectedFilters.find('span').each(function(key, value) {
                count++;
            });

            if(count === 0){
                selectedFilters.css('display', 'none');
            }
        }
    }

    function _hideMessageNotFound(){
        _containerSearch.find('.img-not-found').css('display', 'none');
    }
    function _showMessageNotFound(){

        let img = _containerSearch.find('.img-not-found');

        if(!img[0]){
            $('<img>')
                .addClass('img-not-found')
                .attr('src', 'img/Anime/utils/anime_not_found.png')
                .css('opacity', '0.5')
                .appendTo(_containerSearch);
        }

        img.css('display', 'block');

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
                'src' : data.trailer,
                'type' : 'video/mp4'
            }).appendTo(card);


        _createCardInfo(card, data);
        _createCardButtons(card, data);
        _bindCardEvents(card);
    }

    function _createCardInfo(el, data){

        let seasons = parseInt(data.seasons);
        seasons = seasons > 1 ? seasons + ' Temporadas' : seasons + ' Temporada';

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
            .text(seasons)
            .appendTo(info);

        $('<p>')
            .addClass('description')
            .text(data.description)
            .appendTo(info);

        $('<i>')
            .addClass('info');

        info.bind('click', function(){
            window.location.href = $(this).parent().attr('data-route');
        });

        info.bind('mouseenter', function(){

            let card = $(this).parent();
            let icons = card.find('.icons');
            let play = icons.find('.play').find('i');

            play.css('color', '#b74c4c');
        });

        info.bind('mouseleave', function(){

            let card = $(this).parent();
            let icons = card.find('.icons');
            let play = icons.find('.play').find('i');

            play.css('color', '#fff');
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

        /*let btnPlus = $('<div>')
            .addClass('icon plus')
            .on('click', function(){
                _setClientList($(this));
            })
            .appendTo(buttons);

        $('<i>')
            .addClass('fas fa-plus')
            .appendTo(btnPlus);

        /*let btnMoreInfo = $('<div>')
            .addClass('icon more-info')
            .on('click', function(){
                _showAnimeInfo($(this));
            })
            .appendTo(buttons);

        $('<i>')
            .addClass('fas fa-angle-down')
            .appendTo(btnMoreInfo);*/
    }

    function _showAnimeInfo(el){

        let card = el.parent().parent();
        let li = card.parent();
        let ul = li.parent();
        let inner = ul.parent().parent();
        let column = inner.parent().parent();
        let info = column.find('.carousel-info');


        info.css('display', 'block');
        li.css('border', '4px solid #fff');
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
            video[0].volume = 0.6;
        }else{
            icon.addClass('fas fa-volume-mute');
            video[0].muted = true;
        }
    }

    function _setAnimeThumb(el, thumb){

        let card = el.parent().parent();
        let icon = el.find('i');
        let track = card.attr('data-track');
        let thumbs = 0;

        App_Anime.getAnime(track, function(data){

            if(thumb === 'up'){
                if(data.anime.thumb_up){
                    thumbs = data.anime.thumb_up;
                }
                data.anime.thumb_up = parseInt(thumbs) + 1;

                icon.css('color', '#7ee27d;');

            }else{
                if(data.anime.thumb_down){
                    thumbs = data.anime.thumb_down;
                }
                data.anime.thumb_down = parseInt(thumbs)+ 1;

                icon.css('color', '#da6b6bcc;');
            }

            App_Anime.saveAnime(data.anime);
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

        let time = null;
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

            if(!el.attr('data-first')){
                time = 3000;
                el.attr('data-first', 'true');
            }else{
                time = 1500;
            }

            timeoutVideo = setTimeout(function(){

                if(enter){

                    element.find('img').css('display', 'none');
                    video.css('opacity', '1');

                   // video[0].load();
                    video[0].play();

                    timeoutInfo = setTimeout(function(){
                        element.find('.info, .icons').css('opacity', '0');
                    }, time);
                }

            }, time);

        });

        el.bind('mouseleave', function(){

            enter = false;
            clearTimeout(timeoutVideo);

            let element = $(this);
            let video = element.find('video');


            _checkCards(element, false);

            //element.parent().removeAttr('style');
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


    function _filterCategories(categories){

        let keys = ['fantasia', 'comedia', 'acao', 'romance', 'aventura', 'ficcao_cientifica'];
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

    function _createCarousel(category, container = null){

        if(!container)
            container = _containerCarousel;

        _carouselId = 'carousel-' + category.key;

        _column = $('<div>')
            .addClass('col-xs-12')
            .appendTo(container);

        let carousel = $('<div>')
            .addClass('carousel slide')
            .attr('id', _carouselId)
            .appendTo(_column);

       /* $('<div>')
            .addClass('carousel-info')
            .appendTo(_column);*/

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

        return container;
    }

    function _createCarouselItem(first, container = null){

        if(!container)
            container = _carouselInner;

        let item = $('<div>')
            .addClass('item')
            .appendTo(container);

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

        $('body').css('overflow-y', 'hidden');
        _loader.css('display', 'block');

        if(typeof(callback) === 'function'){
            callback();
        }
    }

    function _hideLoader(){
        $('body').css('overflow-y', 'visible');
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
        _sidebarTopWrapper.css('display', 'block');
        _sidebarRightWrapper.css('display', 'block');
        _sidebarLeftWrapper.css('display', 'block');
    }

    function _hideWrapper(){
        _sidebarTopWrapper.css('display', 'none');
        _sidebarRightWrapper.css('display', 'none');
        _sidebarLeftWrapper.css('display', 'none');
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
            return : _searchReturn,
            bar : _searchBar,
            icon : _searchIcon
        };
    }

    function _prepareSearch(){

        _createMenuCategories();
        _createMenuFilters();
        //_createMenuFilters();
    }

    function _createMenuCategories(){

        App_Anime.getCategories(function(data) {

            let categories = _filterCategories(data.categories);


            $.each(categories, function (key, value) {

                let li = $('<li>')
                    .on('click', function(){
                        $(this).parent().find('li').removeClass('active');
                        $(this).addClass('active');
                    })
                    .appendTo(_sidebarTop);

                $('<a>')
                    .attr({
                        'data-id' : value.id,
                        'href' : '#'
                    })
                    .on('click', function(){
                        App_Helper.clearFilters(function(){
                            _listSearchAnimes({category :  $(this).attr('data-id')});
                        });
                    })
                    .text(value.title)
                    .appendTo(li);
            });
        });
    }

    function _createMenuFilters(){

        let filters = ['Ordem Alfabética', 'Ano de Lançamento', 'Categoria', 'Autor', 'Gênero'];
        _filterSelects = [];

        $.each(filters, function (key, value) {

            let li = $('<li>')
                .on('click', function () {
                    _removeMenuActive();
                    $(this).addClass('active');
                })
                .appendTo(_sidebarLeft);

            $('<a>')
                .attr({
                    'href': '#',
                    'tabindex': '-1'
                })
                .text(value)
                .appendTo(li);

            let select = $('<select>')
                .attr({
                    'type': 'select',
                    'data-filter': value
                })
                .addClass('form-control')
                .appendTo(li);

            $('<i>')
                .addClass('fas fa-trash-alt')
                .click(function(){
                    let select = $(this).parent().find('select');
                    select.select2('val', 'none');
                    $(this).css('color', '#c3bfbf')
                })
                .appendTo(li);

            _filterSelects.push(select);
            _createFilterOptions(select, value);
        });
    }

    function _createFilterOptions(select, value){

        let placeholder = '';

        $('<option>')
            .val('')
            .text('')
            .appendTo(select);

        if(value === 'Ano de Lançamento'){
            for (let i = 1990; i <= (new Date()).getFullYear(); i++){

                $('<option>')
                    .val(i)
                    .text(i)
                    .appendTo(select);
            }

            placeholder = "Selecionar Ano";
        }

        if(value === 'Ordem Alfabética'){

            for (let i = 65; i <= 90; i++){
                $('<option>')
                    .val(i)
                    .text(String.fromCharCode(i))
                    .appendTo(select);
            }

            placeholder = "Selecionar Letra";
        }

        if(value === 'Categoria'){

            App_Anime.getCategories(function(data){

                $.each(data.categories, function(key, value){
                    $('<option>')
                        .val(value.id)
                        .text(value.title)
                        .appendTo(select);

                })
            });

            placeholder = "Selecionar Categoria";
        }

        if(value === 'Gênero'){

            App_Anime.getGenres(function(data){

                $.each(data.genres, function(key, value){
                    $('<option>')
                        .val(value.id)
                        .text(value.title)
                        .appendTo(select);

                })
            });

            placeholder = "Selecionar Gênero";
        }

        if(value === 'Autor'){

            App_Anime.getAuthors(function(data){
                $.each(data.authors, function(key, value){
                    $('<option>')
                        .val(value.id)
                        .text(value.name)
                        .appendTo(select);

                })
            });

            placeholder = "Selecionar Autor";
        }

        if(value === 'Ordem Alfabética'){
            let select2 = select.parent().find('.select2');
            select2.bind('click', function(){
                let select = $(this).parent().find('select');
                if(select.attr('data-filter') === 'Ordem Alfabética'){
                    $('.select2-search__field')
                        .attr('maxlength', 1)
                        .css('text-transform', 'uppercase');
                }
            });
        }

        select.select2({placeholder: placeholder});
        _bindFilterChanges(select);
    }

    function _bindFilterChanges(select){

        _filterParams = {};

        select.change(function(ev){

            let selectedOption = ev.currentTarget.selectedOptions[0];
            let text = '';

            if(selectedOption){
                text = selectedOption.innerText;
            }

            let filter = $(this).attr('data-filter');

            if($(this).val() != null) {
                $(this).parent().find('.fa-trash-alt').css('color', '#0e900c');
            }

            switch(filter){

                case 'Ordem Alfabética' :

                    if($(this).val() != null){
                        _filterParams.first_word = String.fromCharCode($(this).val());
                        _createSelectedFilters(filter, 'Ordem: '+ text);
                    }else{
                        delete _filterParams.first_word;
                        _removeSelectedFilters(filter);
                    }
                    break;

                case 'Ano de Lançamento' :

                    if($(this).val() != null){
                        _filterParams.year = $(this).val();
                        _createSelectedFilters(filter, 'Ano: '+ text);
                    }else{
                        delete _filterParams.year;
                        _removeSelectedFilters(filter);
                    }
                    break;

                case 'Categoria' :

                    if($(this).val() != null){
                        _filterParams.category = $(this).val();
                        _createSelectedFilters(filter, 'Categoria: '+  text);
                    }else{
                        delete _filterParams.category;
                        _removeSelectedFilters(filter);
                    }
                    break;

                case 'Autor' :

                    if($(this).val() != null){
                        _filterParams.author = $(this).val();
                        _createSelectedFilters(filter, 'Autor: '+ text);
                    }else{
                        delete _filterParams.author;
                        _removeSelectedFilters(filter);
                    }
                    break;

                case 'Gênero' :

                    if($(this).val() != null){
                        _filterParams.genre = $(this).val();
                        _createSelectedFilters(filter, 'Gênero: '+ text);
                    }else{
                        delete _filterParams.genre;
                        _removeSelectedFilters(filter);
                    }
                    break;
            }

            if(!_filtersClear){
                _listSearchAnimes(_filterParams);
                $('.search-input').val('');
            }
        })
    }

    function _getFilterSelects(index){
        if(index === 0 || index) {
            return _filterSelects[index];
        } else {
            return _filterSelects;
        }
    }

    function _removeMenuActive(){
        _sidebarTop.find('li').removeClass('active');
    }

    function _hasSearch(){

        if(_containerSearch.css('visibility') === 'visible'){
            return true;
        }else{
            return false;
        }
    }

    function _hideSearchAnimes(){

        App_Helper.showLoader(function(){

            App_Helper.hideWrapper();
            App_Helper.hideSearch();
            App_Helper.showCarousel();

            $('.search-return').css('display', 'none');
            $('.selected-filters').css('display', 'none');
            $('#search-anime').val('');

            setTimeout(function(){
                App_Helper.hideLoader();
            }, 300);
        });
    }

    function _showBackgroundImages(){

        let images = [
            'img/Anime/wallpaper/dragon_ball_super.jpg',
            'img/Anime/wallpaper/one_piece.jpg',
            'img/Anime/wallpaper/fairy_tail.jpg',
            'img/Anime/wallpaper/naruto_2.jpg',
            'img/Anime/wallpaper/bleach.jpg',
            'img/Anime/wallpaper/black_clover.jpg',
            'img/Anime/wallpaper/naruto_shippuden.jpg'
        ];

        let image = $('.img-wall-anime');
        let index = Math.floor((Math.random() * images.length) + 1);

        function getImage(){

            let src = images[index];

            if(!src){
                index = 0;
                src = images[index];
                index++;
            }else{
                index++;
            }

            return {src, index};
        }

        showImage();

        function showImage(){
            let img = getImage();
            image.attr('src', img.src);
            setTimeout(showImage, 120000);
        }
    }

    function _clearFilters(callback){

        _filtersClear = true;

        $.each(_filterSelects, function(key, value){
            value.val('none').trigger('change');
        });

        _filterParams = {};

        if(typeof(callback) === 'function'){
            callback();
            _filtersClear = false;
        }
    }

    function _showAutoCompleteTags(input){

         clearTimeout(_searchTimeout);

        let tags = [];

        _searchTimeout = setTimeout(function(){

            if(input.val()){
                App_Anime.getAnimes({text : input.val()}, function(data){

                    $.each(data.animes, function(index, value){
                        tags.push(value.title);
                    });

                    _searchInput.autocomplete({
                        source: tags,
                         minLength: 1,
                        select: function( event, ui ) {

                            if(input.attr('data-key-enter') !== 'true'){
                                _listSearchAnimes({text : ui.item.value});
                            }

                        }
                    });
                    _searchInput.autocomplete("search");
                    _searchInput.attr('autocomplete', 'nope');
                });
            }
        }, 150);
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
        prepareSearch : _prepareSearch,
        removeMenuActive : _removeMenuActive,
        hasSearch : _hasSearch,
        hideSearchAnimes : _hideSearchAnimes,
        showBackgroundImages : _showBackgroundImages,
        getFilterSelects : _getFilterSelects,
        clearFilters : _clearFilters,
        showAutoCompleteTags : _showAutoCompleteTags

    }

});