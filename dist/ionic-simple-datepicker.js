/*! ionic-simple-datepicker.js v0.0.1 04-11-2015 */
(function(window, angular, moment, undefined) {
  "use strict";
  var ionicSimpleDatepicker = angular.module("ionic-simple-datepicker", [ "ionic" ]);
  ionicSimpleDatepicker.factory("simpleDatepickerPopover", [ "$rootScope", "$q", "$timeout", "$ionicPopover", function($rootScope, $q, $timeout, $ionicPopover) {
    var DEFAULT_POPOVER_ANIMATION = "slide-in-up";
    var NOOP = function() {};
    var simpleDatepickerPopover;
    var _popover;
    simpleDatepickerPopover = {
      show: function($event, dOptions) {
        var options = {
          animation: dOptions && dOptions.animation || DEFAULT_POPOVER_ANIMATION,
          scope: dOptions && dOptions.scope && dOptions.scope.$new() || $rootScope.$new(true)
        };
        var selectedDate;
        var onSelectCallback = NOOP;
        var deferred = $q.defer();
        _popover = $ionicPopover.fromTemplate('<ion-popover-view class="simple-datepicker-popover"><ion-content scroll="false"><simple-datepicker from="from" to="to" initial="initial" active-days="activeDays" on-selected="_onSelected(current)" on-close="_onClose(current)" labels="labels"></simple-datepicker></ion-content></ion-popover-view>', options);
        _popover.scope.$on("$destroy", function() {
          _popover.remove();
        });
        _popover.scope.$on("popover.hidden", function() {
          deferred.resolve({
            current: selectedDate
          });
        });
        if (dOptions) {
          if (dOptions.initial && moment(dOptions.initial).isValid()) {
            _popover.scope.initial = dOptions.initial;
            selectedDate = moment(dOptions.initial).format();
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
          if (dOptions.activeDays && angular.isArray(dOptions.activeDays) && dOptions.activeDays.length > 0) {
            _popover.scope.activeDays = dOptions.activeDays;
          }
          if (dOptions.labels && angular.isObject(dOptions.labels)) {
            _popover.scope.labels = dOptions.labels;
          }
        }
        _popover.scope._onSelected = function(dNewSelection) {
          if (selectedDate !== dNewSelection) {
            onSelectCallback({
              current: dNewSelection
            });
            selectedDate = dNewSelection;
          }
        };
        _popover.scope._onClose = function(dNewSelection) {
          selectedDate = dNewSelection;
          _popover.hide();
        };
        _popover.show($event);
        return deferred.promise;
      }
    };
    return simpleDatepickerPopover;
  } ]);
  ionicSimpleDatepicker.directive("simpleDatepicker", [ function() {
    var DEFAULT_MOMENT_FORMAT = "YYYY-MM-DD";
    var DAYS_PER_WEEK = 7;
    var DEFAULT_PREV_LABEL = "<";
    var DEFAULT_NEXT_LABEL = ">";
    var DEFAULT_CLOSE_LABEL = "X";
    return {
      restrict: "E",
      template: '<div class="simple-datepicker"><div class="simple-datepicker__month-picker"><div class="button-bar"><button class="button" ng-click="goToPreviousMonth()" ng-disabled="! hasPrevMonth()" ng-bind="prevButtonLabel"></button><button class="button" ng-click="goToNextMonth()" ng-disabled="! hasNextMonth()" ng-bind="nextButtonLabel"></button></div></div><div class="simple-datepicker__month"><h1 ng-bind="getCurrentMonth()"></h1></div><div class="simple-datepicker__calendar"><div class="simple-datepicker__calendar__date-header" ng-bind="weekday" ng-repeat="weekday in weekdays track by $index"></div><div class="simple-datepicker__calendar__date" ng-repeat="day in days track by $index" ng-class="{ \'simple-datepicker__calendar__date--not-current-month\': ! day.isInCurrentMonth, \'simple-datepicker__calendar__date--not-in-timeframe\': ! day.isInTimeframe, \'simple-datepicker__calendar__date--selected\': day.date == current, \'simple-datepicker__calendar__date--not-active\': ! day.active }" ng-bind="day.label" ng-click="setSelectedDay(day)"></div></div><div class="simple-datepicker__footer"><button class="button button-full simple-datepicker__footer__close" ng-bind="closeButtonLabel" ng-click="close()"></button></div></div>',
      scope: {
        initial: "=",
        from: "=",
        to: "=",
        format: "=",
        labels: "=",
        activeDays: "=",
        onSelected: "&",
        onClose: "&"
      },
      link: function($scope) {
        var i;
        $scope.days = [];
        $scope.weekdays = [];
        $scope.prevButtonLabel = DEFAULT_PREV_LABEL;
        $scope.nextButtonLabel = DEFAULT_NEXT_LABEL;
        $scope.closeButtonLabel = DEFAULT_CLOSE_LABEL;
        for (i = 0; i < DAYS_PER_WEEK; i++) {
          $scope.weekdays.push(moment().weekday(i).format("dd"));
        }
        $scope.setSelectedDay = function(eDay) {
          if (eDay.active) {
            $scope.current = eDay.date;
          }
        };
        $scope.goToPreviousMonth = function() {
          $scope.focus = moment($scope.focus).subtract(1, "month").format();
        };
        $scope.goToNextMonth = function() {
          $scope.focus = moment($scope.focus).add(1, "month").format();
        };
        $scope.hasPrevMonth = function() {
          return $scope.from ? moment($scope.focus).startOf("month").isAfter($scope.from) : true;
        };
        $scope.hasNextMonth = function() {
          return $scope.to ? moment($scope.focus).endOf("month").isBefore($scope.to) : true;
        };
        $scope.getCurrentMonth = function() {
          return moment($scope.focus).format("MMMM YY");
        };
        $scope.close = function() {
          $scope.onClose({
            current: moment($scope.current).format()
          });
        };
        $scope.$watch("labels", function(dLabels) {
          if (dLabels) {
            $scope.prevButtonLabel = dLabels.prevButton || DEFAULT_PREV_LABEL;
            $scope.nextButtonLabel = dLabels.nextButton || DEFAULT_NEXT_LABEL;
            $scope.closeButtonLabel = dLabels.closeButton || DEFAULT_CLOSE_LABEL;
          }
        });
        $scope.$watch("format", function(dFormat) {
          if (!dFormat) {
            $scope.format = DEFAULT_MOMENT_FORMAT;
          }
        });
        $scope.$watch("initial", function(dInitial) {
          if (!dInitial || dInitial && !moment(dInitial).isValid()) {
            $scope.current = moment().format("YYYY-MM-DD");
          } else {
            $scope.current = moment(dInitial, $scope.format).format("YYYY-MM-DD");
          }
          $scope.focus = $scope.current;
        });
        $scope.$watch("current", function(dCurrent) {
          $scope.onSelected({
            current: moment(dCurrent).format()
          });
        });
        $scope.$watch("activeDays", function(dActiveDays) {
          if (!dActiveDays) {
            $scope.activeDays = null;
          } else {
            $scope.activeDays = dActiveDays;
          }
        });
        $scope.$watch("focus", function(dFocus) {
          var data, isAfter, isBefore, days, day, formatted, splitted, currentMonth;
          days = [];
          day = moment(dFocus).startOf("month").day(0);
          currentMonth = moment(dFocus).format("MM");
          i = 0;
          while (moment(day).isBefore(moment(dFocus).endOf("month"))) {
            day = moment(dFocus).startOf("month").day(i);
            formatted = day.format("YYYY-MM-DD");
            splitted = formatted.split("-");
            data = {
              date: formatted,
              label: splitted[2],
              isInCurrentMonth: splitted[1] === currentMonth,
              active: !$scope.activeDays || $scope.activeDays.indexOf(formatted) > -1
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
  } ]);
})(window, window.angular, window.moment);