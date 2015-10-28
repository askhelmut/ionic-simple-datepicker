/* global angular, moment */

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

  $scope.selectedDate = moment().format('YYYY-MM-DD');

  $scope.selectDate = function($event) {

    var options = {
      initial: $scope.selectedDate,
      from: moment().format('YYYY-MM-DD'),
      onSelected: function(dDate) {
        console.log('On Selected', dDate.current);
      }
    };

    simpleDatepickerPopover.show($event, options).then(function(dDate) {
      console.log('Closed Popover', dDate);
      $scope.selectedDate = moment(dDate.current).format('YYYY-MM-DD');
    });

  };

}]);
