'use strict';

angular.module('mean.agenda').controller('UserEventController', ['$scope', '$modalInstance', '$routeParams', '$location', 'Global', 'UserEvent', function ($scope, $modalInstance, $routeParams, $location, Global, UserEvent) {
    $scope.global = Global;
    $scope.userEvents = [];

    $scope.create = function(userEvent) {

        var userEvent = new UserEvent({
            title: this.title,
            content: this.content,
            start: this.start,
            end: this.end
            //  , community: this.community,
            // location: this.location
        });
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
        var start = angular.element('#directives-calendar').scope().selectedDate;
        if(start){
            $scope.start = start;
            $scope.end = start;
        } else {
            $scope.start = new Date();
            $scope.end = new Date();
        }
    };

    $scope.clear = function () {
        $scope.start = null;
        $scope.end = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( $scope.openedEndDate === true && date < $scope.start );
    };

    $scope.toggleMin = function() {
        $scope.minDate = ( $scope.minDate ) ? null : new Date();
    };

    $scope.open = function($event, datepicker) {
        $event.preventDefault();
        $event.stopPropagation();

        if(datepicker === 'start'){
            $scope.openedStartDate = ( $scope.openedStartDate ) ? false : true;
            $scope.openedEndDate = false;
        } else {
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

    $scope.map = {
        center: {
            latitude: 45,
            longitude: -73
        },
        zoom: 8
    };

    $scope.geoCode = function () {
        if ($scope.search && $scope.search.length > 0) {
            if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
            this.geocoder.geocode({ 'address': $scope.search }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var loc = results[0].geometry.location;
                    $scope.search = results[0].formatted_address;
                    $scope.gotoLocation(loc.lat(), loc.lng());
                } else {
                    alert("Sorry, this search produced no results.");
                }
            });
        }
    };

    $scope.gotoCurrentLocation = function () {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var c = position.coords;
                $scope.gotoLocation(c.latitude, c.longitude);
            });
            return true;
        }
        return false;
    };
    $scope.gotoLocation = function (lat, lon) {
        if ($scope.lat != lat || $scope.lon != lon) {
            $scope.map.center = { lat: lat, lon: lon };
            if (!$scope.$$phase) $scope.$apply("loc");
        }
    };
}]);