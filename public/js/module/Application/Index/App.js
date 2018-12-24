class App{

    start(){

        let self = this;

        App_Helper.assignElements();
        App_Helper.showLoader();
        App_Helper.listCurrentAnimes(function(){
            App_Helper.listAnimes(function(){
                App_Helper.hideLoader();
                App_Helper.prepareSearch();
            });
        });

        self.bindEvents();
        App_Helper.showBackgroundImages();
    }

    bindEvents(){

        let self = this;

        let btnHome = $('#btnHome');
        let btnAnimes = $('#btnAnimes');

        let search = App_Helper.getSearch();
        let params = {};

        search.input.bind('click',function(e){

            let text = $(this).val();

            if(!text){
                if(!App_Helper.hasSearch()){
                 //   let select = App_Helper.getFilterSelects(0);
                   // select.val('A'.charCodeAt(0)).trigger('change');
                    App_Helper.listSearchAnimes();
                }
            }
        });

        search.icon.bind('click',function(e){

            params = {};
            params.text = $('.search-input').val();
            params.search_all = 'true';

            if(params.text !== ''){
                App_Helper.listSearchAnimes(params);
            }else{

                App_Helper.showLoader(function(){
                    App_Helper.hideWrapper();
                    App_Helper.hideSearch();
                    App_Helper.showCarousel();
                    App_Helper.hideLoader();
                });
            }
        });

        search.input.bind('keydown',function(e){

            if(e.keyCode === 13){

                $(this).attr('data-key-enter', 'true');

                let text = $(this).val();

                App_Helper.clearFilters(function(){
                    params = {};
                    params.text = text;
                    params.search_all = 'false';

                    if(params.text !== ''){
                        App_Helper.listSearchAnimes(params);
                    }else{
                        App_Helper.hideSearchAnimes();
                    }
                });
            }else{
                $(this).attr('data-key-enter', 'false');
            }
        });

        search.input.bind('keyup',function(e){

            if(e.keyCode !== 13){
                App_Helper.showAutoCompleteTags($(this));
            }
        });

        search.return.bind('click', function(){
            App_Helper.hideSearchAnimes();
        });

        btnHome.bind('click', function(){
            App_Helper.hideSearchAnimes();
        });

        btnAnimes.bind('click', function(){
            App_Helper.listSearchAnimes();

        });
    }

}