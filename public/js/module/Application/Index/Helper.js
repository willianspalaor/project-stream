
let App_Helper = new (function () {

    let _container = null;
    let _column = null;
    let _carousel = null;
    let _carouselInner = null;
    let _carouselId = null;
    let _loader = null;
    let _navbar = null;

    function _assignElements(){

        _container = $('#container-carousel');
        _carousel = $('#carousel-animes');
        _loader = $('#loader-wrapper');
        _column = $('.col-xs-12');
        _carouselInner = $('.carousel-inner');
        _navbar = $('.navbar');

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

                if((i % 4) === 0){
                    item = _createCarouselItem(first);
                    first = false;
                }

                _createCarouselList(item, value);
                i++;
            });

            if(i > 4){
                _createCarouselControl();
            }

            if(typeof(callback) === 'function'){
                callback(data);
            }
        });
    }

    function _listAnimes(callback){

        App_Anime.getCategories(function(categories){

            $.each(categories.categorias, function (index, categoria) {

                App_Anime.getAnimesByCategory(categoria.id, function(data){

                    if(Object.keys(data.animes).length <= 0){
                        return false;
                    }

                    let i = 0;
                    let item = null;
                    let first = true;

                    _createCarousel(categoria);

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
                });

            });

            if(typeof(callback) === 'function'){
                callback();
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

    function _createCarousel(category){

        _carouselId = 'carousel-' + category.key;

        _column = $('<div>')
            .addClass('col-xs-12')
            .appendTo(_container);

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
            console.log('leave');
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

        let card = $('<div>')
            .addClass('card')
            .appendTo(li);

        let thumbnail = $('<div>')
            .addClass('thumbnail')
            .appendTo(card);

        let link = $('<a>')
            .attr('href', data.route)
            .appendTo(thumbnail);

        $('<img>')
            .attr('src', data.img)
            .appendTo(link);
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


    return {
        assignElements: _assignElements,
        listAnimes : _listAnimes,
        listCurrentAnimes : _listCurrentAnimes,
        showLoader : _showLoader,
        hideLoader : _hideLoader

    }

});