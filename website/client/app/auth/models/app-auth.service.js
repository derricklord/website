(function () {
    'use strict';
    angular
        .module('app.auth')
        .factory('Auth', Auth);

    Auth.$inject = ['$http'];

    /* @ngInject */
    function  Auth($http){
        var exports = {
            login : login,
            logout: logout,
            signup: signup
        };
        

        return exports;

        ////////////////

        function login(user) {
            return $http({
                    method: "post",
                    url: "/auth/login",
                    data: user
                });
        }
        
        function logout(){
            console.log('Logging out');
        }
        
        function signup(){
            console.log('Signing Up');
        }
    }
})();