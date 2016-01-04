'use strict';

/**
 * @ngdoc overview
 * @name magnificentDemo
 * @description
 * # magnificentDemo
 *
 * Main module of the application.
 */
angular.module('magnificentDemo', [
    'ngAnimate',
    'ngRoute',
    'angular-magnificent'
  ])
.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/homePageView.html',
      controller: 'homePageController'
    })
    .otherwise({
      redirectTo: '/'
    });
}])
.run(['$rootScope', 
  function($rootScope) {}
]);
