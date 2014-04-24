'use strict';

angular.module('mean.agenda').controller('UserEventController', ['$scope', '$modalInstance', '$routeParams', '$location', 'Global', 'UserEvent', function ($scope, $modalInstance, $routeParams, $location, Global, UserEvent) {
    $scope.global = Global;
    $scope.userEvents = [];

    $scope.create = function(userEvent) {

        userEvent.uuid = guid();
        userEvent.$save(function(response) { 
            $scope.userEvents.push(response.userEvent);
        });
    };

    $scope.remove = function(userEvent) {
        if (userEvent) {
            userEvent.$remove();

            for (var i in $scope.userEvents) {
                if ($scope.userEvents[i] === userEvent) {
                    $scope.userEvents.splice(i, 1);
                }
            }
        }
        else {
            $scope.userEvents.$remove();
            $location.path('userEvent');
        }
    };

    $scope.update = function(userEvent) {
        if (userEvent) {

            for (var i in $scope.userEvents) {
                if ($scope.userEvents[i].uuid === userEvent.uuid) {
                    $scope.userEvents[i] = userEvent;
                }
            }

            userEvent.$update(function() {
                $location.path('userEvent/' + userEvent._id);
            });
        }
    };

    $scope.find = function() {
        UserEvent.query(function(userEvent) {
            $scope.userEvents = userEvent;
        });
    };

    $scope.findOne = function() {
        UserEvent.get({
            userEventId: $routeParams.userEventId
        }, function(userEvent) {
            $scope.userEvent = userEvent;
        });
    };

    /***
    Modal buttons
    ***/
    $scope.ok = function () {
        this.create();
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    /***
    Date picker management
    ***/
    $scope.initialize = function() {
        var startDate = angular.element('#directives-calendar').scope().startDate;
        if(startDate){
            $scope.startDate = startDate;
            $scope.endDate = startDate;
        } else {
            $scope.startDate = new Date();
            $scope.endDate = new Date();
        }
    };

    $scope.clear = function () {
        $scope.startDate = null;
        $scope.endDate = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = ( $scope.minDate ) ? null : new Date();
    };

    $scope.open = function($event, datepicker) {
        $event.preventDefault();
        $event.stopPropagation();

        if(datepicker === 'startDate'){
            $scope.openedStartDate = ( $scope.openedStartDate ) ? false : true;
            $scope.openedEndDate = false;
        }
        else {
            $scope.openedEndDate = ( $scope.openedEndDate ) ? false : true;
            $scope.openedStartDate = false;
        }
    };

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
    };

    $scope.initialize();
    $scope.toggleMin();
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
    $scope.format = $scope.formats[0];
}]);