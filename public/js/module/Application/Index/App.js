class App{

    start(){

        let self = this;

        App_Helper.assignElements();
        App_Helper.showLoader();
        App_Helper.listCurrentAnimes(function(){
            App_Helper.listAnimes(function(){
                App_Helper.hideLoader();
            });
        });

        self.bindEvents();
    }

    bindEvents(){

        let self = this;
        let search = App_Helper.getSearch();
        let timeout = null;
        let params = {};

        search.input.bind('keyup',function(e){

            clearTimeout(timeout);
            params.text = $(this).val();

            if(params.text !== ''){

                timeout = setTimeout(function(){
                    App_Helper.listSearchAnimes(params);
                }, 300);

            }else{

                App_Helper.showCarousel();
                App_Helper.hideSearch();
            }


        });



       /* search.select2({
            placeholder: "Select a State",
            allowClear: true
        });*/
    }

}