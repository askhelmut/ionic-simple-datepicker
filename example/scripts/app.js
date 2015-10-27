/* global angular */

'use strict';

var app = angular.module('app', [ 'ionic', 'ui.router', 'ionic-simple-datepicker' ]);

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

app.controller('HomeCtrl', ['$scope', 'simpleDatepickerPopover', function($scope, simpleDatepickerPopover) {

  $scope.selectDate = function($event) {
    simpleDatepickerPopover.show($event).then(function(dDate) {
      console.log(dDate)
    });
  };

}]);
