(function () {
    'use strict';
    angular.module('website')
        .config(function($stateProvider, $urlRouterProvider) {
          //
          // For any unmatched url, redirect to /state1
          $urlRouterProvider.otherwise("/");
          //
          // Now set up the states

          $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'app/core/views/home.html',
            })
            .state('login', {
              url: "/login",
              templateUrl: "app/auth/views/login.html",
            });
        });
})();