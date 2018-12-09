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

        self.bindCarouselEvents();
    }

    bindCarouselEvents(){
    }

}