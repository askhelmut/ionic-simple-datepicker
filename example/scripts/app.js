/* global angular */

'use strict';

var app = angular.module('app', []);

app.controller('AppCtrl', ['$scope', function($scope) {

  $scope.test = 42;

}]);
