(function(window, angular, undefined) {

  'use strict';

  var ionicSimpleDatepicker = angular.module('ionic-simple-datepicker', [ 'ionic' ]);

  ionicSimpleDatepicker.factory('simpleDatepickerPopover', [ '$rootScope', '$q', '$timeout', '$ionicPopover', function($rootScope, $q, $timeout, $ionicPopover) {

    var DEFAULT_POPOVER_ANIMATION = 'slide-in-up';

    var simpleDatepickerPopover;

    // private

    var _popover;

    // public

    simpleDatepickerPopover = {

      show: function($event, dOptions) {

        var options = {
          animation: dOptions && dOptions.animation || DEFAULT_POPOVER_ANIMATION,
          scope: dOptions && dOptions.scope && dOptions.scope.$new() || $rootScope.$new(true)
        };

        var selectedDate;

        var deferred = $q.defer();

        _popover = $ionicPopover.fromTemplate(
          '<ion-popover-view><ion-header-bar></ion-header-bar><ion-content scroll="false"><simple-datepicker from="from" to="to" current="current" on-selected="_onSelected(current)"></simple-datepicker></ion-content></ion-popover-view>', options
        );

        // event callbacks

        _popover.scope.$on('$destroy', function() {
          _popover.remove();
        });

        _popover.scope.$on('popover.hidden', function() {
          deferred.resolve(selectedDate);
        });

        _popover.scope._onSelected = function(dNewSelection) {
          selectedDate = dNewSelection;
        };

        // show it

        _popover.show($event);

        return deferred.promise;

      }

    };

    return simpleDatepickerPopover;

  }]);

  ionicSimpleDatepicker.directive('simpleDatepicker', [ function() {

    var DEFAULT_FROM = 'bla';
    var DEFAULT_TO = 'lala';
    var DEFAULT_CURRENT = 'lulu';

    return {

      restrict: 'E',

      template: '<div class="simple-datepicker"><h1 ng-bind="current"></h1></div>',

      scope: {

        from: '=',
        to: '=',
        current: '=',

        onSelected: '&'

      },

      link: function($scope, $elem, $attrs) {

        $scope.$watch('from', function(dFrom) {
          if (! dFrom) {
            $scope.from = DEFAULT_FROM;
          }
        });

        $scope.$watch('to', function(dTo) {
          if (! dTo) {
            $scope.to = DEFAULT_TO;
          }
        });

        $scope.$watch('current', function(dCurrent) {

          if (! dCurrent) {
            $scope.current = DEFAULT_CURRENT;
          }

          $scope.onSelected({ current: $scope.current });

        });

      }

    };

  }]);

})(window, window.angular);
