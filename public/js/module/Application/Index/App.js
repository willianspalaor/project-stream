class App{

    start(){

        let self = this;

        App_Helper.assignElements();
        App_Helper.assignScreen();
        App_Helper.setAuthentication();
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

    bindEvents() {

        let self = this;

        let btnHome = $('#btnHome');
        let btnAnimes = $('#btnAnimes');
        let btnLogin = $('#btnNavbarLogin');
        let btnModalLogin = $("[name='btnModalLogin']");
        let alert = $('#alert-login');

        let search = App_Helper.getSearch();
        let params = {};

        search.input.bind('click', function (e) {

            let text = $(this).val();

            if (!text) {
                if (!App_Helper.hasSearch()) {
                    //   let select = App_Helper.getFilterSelects(0);
                    // select.val('A'.charCodeAt(0)).trigger('change');
                    App_Helper.listSearchAnimes();
                }
            }
        });

        search.icon.bind('click', function (e) {

            params = {};
            params.text = $('.search-input').val();
            params.search_all = 'true';

            if (params.text !== '') {
                App_Helper.listSearchAnimes(params);
            } else {

                App_Helper.showLoader(function () {
                    App_Helper.hideWrapper();
                    App_Helper.hideSearch();
                    App_Helper.showCarousel();
                    App_Helper.hideLoader();
                });
            }
        });

        search.input.bind('keydown', function (e) {

            if (e.keyCode === 13) {

                $(this).attr('data-key-enter', 'true');

                let text = $(this).val();

                App_Helper.clearFilters(function () {
                    params = {};
                    params.text = text;
                    params.search_all = 'false';

                    if (params.text !== '') {
                        App_Helper.listSearchAnimes(params);
                    } else {
                        App_Helper.hideSearchAnimes();
                    }
                });
            } else {
                $(this).attr('data-key-enter', 'false');
            }
        });

        search.input.bind('keyup', function (e) {
            if (e.keyCode !== 13) {
                App_Helper.showAutoCompleteTags($(this));
            }
        });

        search.return.bind('click', function () {
            App_Helper.hideSearchAnimes();
        });

        btnHome.bind('click', function () {
            App_Helper.hideSearchAnimes();
        });

        btnAnimes.bind('click', function () {
            App_Helper.listSearchAnimes();
        });

        if (window.matchMedia("(orientation: portrait)").matches) {
            if (App_Helper.getScreenType() === 'mobile') {
                setTimeout(function () {
                    App_Helper.setOrientation('portrait');
                }, 5000);
            }
        }

        if (window.matchMedia("(orientation: landscape)").matches) {
            if (App_Helper.getScreenType() === 'mobile') {
                setTimeout(function () {
                    App_Helper.setOrientation('landscape');
                }, 5000);
            }
        }

        $(window).on("orientationchange", function (event) {

            let orientation = null;

            switch (window.orientation) {
                case 0 :
                    orientation = 'portrait';
                    break;
                case 90 :
                    orientation = 'landscape';
                    break;
                case -90 :
                    orientation = 'landscape';
                    break;
            }

            App_Helper.setOrientation(orientation);
        });

        let timeout = null;

        btnLogin.bind('click', function () {

            let menu = $(this).parent().find('.dropdown-menu');
            let h5 = menu.find('h5');
            let item = h5.find('.dropdown-item');

            clearTimeout(timeout);

            if(($(this).attr('aria-expanded') === 'true')){
                App_Helper.showWrapperTop();
            }else{
                App_Helper.hideWrapperTop();
            }

            if (App_Helper.isAuthenticated()) {

                item.text('Sair');
                item.bind('click', function () {
                   App_Anime.logoutUser(function (response) {
                       window.location.href = 'http://' + document.location.host;
                   });
               });

            } else {
                item.text('Entrar');
                item.bind('click', function () {

                    clearTimeout(timeout);
                    App_Helper.showWrapperTop();

                    $('#modal-login').modal({
                        show: 'true'
                    });
                });
            }

            timeout = setTimeout(function(){

                App_Helper.showWrapperTop();

                if(btnLogin.attr('aria-expanded') === 'true'){
                    btnLogin.trigger('click');
                }

            }, 3000);
        });


        btnModalLogin.bind('click', function(ev){

            ev.preventDefault();

            alert.css('display', 'none');

            let usermail = $("[name='user_email']");
            let userpass = $("[name='user_pass']");

            if(usermail.val() === ''){
                alert.html('<strong>Erro! </strong> O campo usuário não pode estar em branco')
                alert.css('display', 'block');
                usermail.trigger('focus');
            }

            if(userpass.val() === ''){
                alert.html('<strong>Erro! </strong> O campo password não pode estar em branco')
                alert.css('display', 'block');
                userpass.trigger('focus');
            }

            let data = {
                'user_email':usermail.val(),
                'user_pass' : userpass.val()
            };

            App_Helper.showLoaderLogin();

            App_Anime.loginUser(data, function(response){

                if(!response.authenticated){
                    alert.html('<strong>Erro! </strong> A senha informada está incorreta')
                    alert.css('display', 'block');
                    userpass.trigger('focus');
                }else{
                    App_Helper.setAuthentication();
                    window.location.href = 'http://' + document.location.host;

                }
            });
        });
    }
}