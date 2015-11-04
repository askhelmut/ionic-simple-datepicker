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

  $scope.selectedDate = '2015-11-15';

  $scope.selectDate = function($event) {

    var options = {

      initial: $scope.selectedDate,

      from: '2015-11-10',
      to: '2015-12-15',

      activeDays: [ '2015-11-14', '2015-11-15', '2015-11-18', '2015-12-10' ],

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
