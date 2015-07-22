(function() {
    'use strict';

    angular
        .module('app.auth')
        .controller('AuthCtrl', AuthCtrl);

    AuthCtrl.$inject = ['$http', 'Auth', '$growl', '$state'];

    /* @ngInject */
    function AuthCtrl($http, Auth, $growl, $state){
        var vm = this;
        vm.title = 'Login Controller';
        vm.email = '';
        vm.password = '';
        vm.login = login;
        


        ////////////////

        
        function login(){
            //alert('Logging in ' + vm.email + ' with password: ' + vm.password);
            Auth.login({email: vm.email, password: vm.password})
                .success(function(data){
                    $growl.box('Login', data.token, {
                            class: 'success',
                            sticky: false,
                            timeout: 2500
                    }).open();
                
                $state.go('home');
                })
                .error(function(error){
                     $growl.box('Error', error.message, {
                            class: 'danger',
                            sticky: false,
                            timeout: 2500
                    }).open();
                });
            
            
            vm.email = '';
            vm.password = '';
        }
    }
})();