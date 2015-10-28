(function(window, angular, moment, undefined) {

  'use strict';

  var ionicSimpleDatepicker = angular.module('ionic-simple-datepicker', [ 'ionic' ]);

  ionicSimpleDatepicker.factory('simpleDatepickerPopover', [ '$rootScope', '$q', '$timeout', '$ionicPopover', function($rootScope, $q, $timeout, $ionicPopover) {

    var DEFAULT_POPOVER_ANIMATION = 'slide-in-up';
    var NOOP = function() {};

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
        var onSelectCallback = NOOP;

        var deferred = $q.defer();

        _popover = $ionicPopover.fromTemplate(
          '<ion-popover-view class="simple-datepicker-popover"><ion-content scroll="false"><simple-datepicker from="from" to="to" initial="initial" on-selected="_onSelected(current)"></simple-datepicker></ion-content></ion-popover-view>', options
        );

        // event callbacks

        _popover.scope.$on('$destroy', function() {
          _popover.remove();
        });

        _popover.scope.$on('popover.hidden', function() {
          deferred.resolve({ current: selectedDate });
        });

        // pass options to scope

        if (dOptions) {

          if (dOptions.initial && moment(dOptions.initial).isValid()) {
            _popover.scope.initial = dOptions.initial;
          }

          if (dOptions.format && angular.isString(dOptions.format)) {
            _popover.scope.format = dOptions.format;
          }

          if (dOptions.from && moment(dOptions.from).isValid()) {
            _popover.scope.from = dOptions.from;
          }

          if (dOptions.to && moment(dOptions.to).isValid()) {
            _popover.scope.to = dOptions.to;
          }

          if (dOptions.onSelected && angular.isFunction(dOptions.onSelected)) {
            onSelectCallback = dOptions.onSelected;
          }

        }

        _popover.scope._onSelected = function(dNewSelection) {
          selectedDate = dNewSelection;
          onSelectCallback({ current: dNewSelection });
        };

        // show it

        _popover.show($event);

        return deferred.promise;

      }

    };

    return simpleDatepickerPopover;

  }]);

  ionicSimpleDatepicker.directive('simpleDatepicker', [ function() {

    var DEFAULT_MOMENT_FORMAT = 'YYYY-MM-DD';
    var DAYS_PER_WEEK = 7;

    return {

      restrict: 'E',

      template: '<div class="simple-datepicker"><div class="simple-datepicker__month-picker"><div class="button-bar"><a class="button" ng-click="previousMonth()">Prev</a><a class="button" ng-click="nextMonth()">Next</a></div></div><div class="simple-datepicker__month"><h1 ng-bind="currentMonth()"></h1></div><div class="simple-datepicker__calendar"><div class="simple-datepicker__calendar__date-header" ng-bind="weekday" ng-repeat="weekday in weekdays track by $index"></div><div class="simple-datepicker__calendar__date" ng-repeat="day in days track by $index" ng-class="{ \'simple-datepicker__calendar__date--not-current-month\': ! day.isInCurrentMonth, \'simple-datepicker__calendar__date--not-in-timeframe\': ! day.isInTimeframe, \'simple-datepicker__calendar__date--selected\': day.date == current }" ng-bind="day.label" ng-click="select(day)"></div></div></div>',

      scope: {

        from: '=',
        to: '=',
        initial: '=',
        format: '=',

        onSelected: '&'

      },

      link: function($scope) {

        var i;

        $scope.days = [];
        $scope.weekdays = [];

        for (i = 0; i < DAYS_PER_WEEK; i++) {
          $scope.weekdays.push(moment().weekday(i).format('dd'));
        }

        $scope.select = function(eDay) {
          $scope.current = eDay.date;
        };

        $scope.previousMonth = function() {
          $scope.focus = moment($scope.focus).subtract(1, 'month').format();
        };

        $scope.nextMonth = function() {
          $scope.focus = moment($scope.focus).add(1, 'month').format();
        };

        $scope.currentMonth = function() {
          return moment($scope.focus).format('MMMM YY');
        };

        // watchers

        $scope.$watch('format', function(dFormat) {
          if (! dFormat) {
            $scope.format = DEFAULT_MOMENT_FORMAT;
          }
        });

        $scope.$watch('initial', function(dInitial) {

          if (! dInitial || (dInitial && ! moment(dInitial).isValid())) {
            $scope.current = moment().format('YYYY-MM-DD');
          } else {
            $scope.current = moment(dInitial, $scope.format).format('YYYY-MM-DD');
          }

          $scope.focus = $scope.current;

        });

        $scope.$watch('current', function(dCurrent) {
          $scope.onSelected({ current: moment(dCurrent).format() });
        });

        $scope.$watch('focus', function(dFocus) {

          var data, isAfter, isBefore, days, day, formatted, splitted, currentMonth;

          days = [];

          day = moment(dFocus).startOf('month').day(0);
          currentMonth = moment(dFocus).format('MM');

          i = 0;

          while (moment(day).isBefore(moment(dFocus).endOf('month'))) {

            day = moment(dFocus).startOf('month').day(i);
            formatted = day.format('YYYY-MM-DD');
            splitted = formatted.split('-');

            data = {
              date: formatted,
              label: splitted[2],
              isInCurrentMonth: splitted[1] === currentMonth
            };

            isAfter = $scope.from ? day.isAfter($scope.from) : true;
            isBefore = $scope.to ? day.isBefore($scope.to) : true;

            data.isInTimeframe = isAfter && isBefore;

            days.push(data);

            i++;

          }

          $scope.days = days;

        });

      }

    };

  }]);

})(window, window.angular, window.moment);
