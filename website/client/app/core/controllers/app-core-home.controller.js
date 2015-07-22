(function() {
    'use strict';

    angular
        .module('app.core')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['HomeService'];

    /* @ngInject */
    function HomeCtrl(HomeService){
        var vm = this;
        
        vm.title = 'Myron B. Thompson Academy';
        vm.landing = true;
        vm.setLanding = setLanding;
        vm.showNav = showNav;

        
        function setLanding(value){
            HomeService.setLanding(!vm.landing);
        }
        
        function showNav(){
            vm.landing = !vm.landing;
        }
    }
})();