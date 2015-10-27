/* global angular */

'use strict';

var app = angular.module('app', [ 'ionic', 'ui.router' ]);

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('index', {
      abstract: true,
      url: '/',
      templateUrl: 'tabs.html'
    })

    .state('index.home', {
      url: 'home',
      views: {
        'home-tab': {
          templateUrl: 'home.html'
        }
      }
    })

    .state('index.test', {
      url: 'test',
      views: {
        'test-tab': {
          templateUrl: 'test.html'
        }
      }
    }

  );

  $urlRouterProvider.otherwise('/home');

});

app.controller('AppCtrl', ['$scope', function($scope) {

  $scope.test = 42;

}]);

app.controller('HomeCtrl', ['$scope', function($scope) {

  $scope.test = 42;

}]);
