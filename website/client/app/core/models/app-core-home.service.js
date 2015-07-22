(function () {
    'use strict';
    angular
        .module('app.core')
        .factory('HomeService', HomeService);

    HomeService.$inject = [];

    /* @ngInject */
    function  HomeService(){
        
        var HomeInfo = {};
        var UserInfo = {};
        
        HomeInfo.landing = true;
        
        var exports = {
            setLanding: setLanding,
            getLanding: getLanding
        };
        

        return exports;

        ////////////////

        function setLanding(val) {
            if(val === true || val === false){
                HomeInfo.landing = val;
            }else{
                HomeInfo.landing = false;
            } 
        }
        
        function getLanding(){
            return HomeInfo.landing;
        }
    }
})();