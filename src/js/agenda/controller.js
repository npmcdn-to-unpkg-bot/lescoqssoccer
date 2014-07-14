'use strict';

angular.module('mean.agenda').controller('agendaController', ['$scope', '$routeParams', '$location', 'Global', 'UserEvent', function ($scope, $routeParams, $location, Global, UserEvent) {

    $scope.global = Global;
    $scope.selectedEvent;
    $scope.selectedDate;
    $scope.onCreation = false;

    $scope.eventTypes = [
      {name:'Resto'},
      {name:'Vacances'},
      {name:'Soirée'},
      {name:'Week-end'},
      {name:'Autres'}
    ];
    $scope.selectedType = $scope.eventTypes[2];

    // Agenda
    $scope.loadEvent = function(){
      $scope.events = [];
      UserEvent.query(function(userEvents) {
        angular.forEach(userEvents,function(userEvent, key){
          $scope.events.push(userEvent);
        });
      });
    };

    /* alert on eventClick */
    $scope.alertEventOnClick = function(date, allDay, jsEvent, view ){
      $scope.selectedEvent = undefined;
      $scope.add(date);
    };

    $scope.alertOnEventClick = function(event, allDay, jsEvent, view ){
        $scope.selectedEvent = event;
    };

    /* alert on Drop */
    $scope.alertOnDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
        $scope.update = event;
    };

    /* alert on Resize */
    $scope.alertOnResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ){
        $scope.update = event;
    };

    /* add custom event*/
    $scope.add = function(start) {
      $scope.selectedDate = start;
      var $modalScope = angular.element('#modal').scope();
      $modalScope.open('modal.html', 'UserEventController');
    };

    $scope.update = function(userEvent){
      if (userEvent) {
        userEvent.$update(function() {
          for (var i in $scope.events) {
            if ($scope.events[i].uuid === userEvent._id) {
                $scope.events[i] = userEvent;
            }
          }
        });
      } else {
        alert("Erreur dans la mise à jour de l'évènement");
      }
    };

    /* remove event */
    $scope.remove = function(index) {

      var userEvent = $scope.events[index];
      if (userEvent) {
          userEvent.$remove(function(){
            $scope.events.splice(index,1);
          });
      } else {
          alert("Erreur dans la suppression de l'évènement");
      }
    };

    $scope.changeLang = function(language) {
      if(language === 'french'){
        $scope.uiConfig.calendar.firstDay = 1;
        $scope.uiConfig.calendar.monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
        $scope.uiConfig.calendar.monthNamesShort = ['Jan','Fev','Mar','Avr','Mai','Jui','Juil','Aou','Sep','Oct','Nov','Déc'];
        $scope.uiConfig.calendar.dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
        $scope.uiConfig.calendar.dayNamesShort = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
        $scope.uiConfig.calendar.buttonText = {
            prev: "<span class='fc-text-arrow'>&lsaquo;</span>",
            next: "<span class='fc-text-arrow'>&rsaquo;</span>",
            prevYear: "<span class='fc-text-arrow'>&laquo;</span>",
            nextYear: "<span class='fc-text-arrow'>&raquo;</span>",
            today: 'Aujourd\'hui',
            month: 'Mois',
            week: 'Semaine',
            day: 'Jour'
        };
      }
    };

    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 300,
        editable: true,
        header:{
          left: 'month agendaWeek agendaDay',
          center: 'title',
          right: 'prev,next'
        },
          buttonText: {
          add: '<div id="modal" class="btn btn-success" ng-controller="Modal"><button class="btn btn-default" ng-click="open(\'modal.html\', \'UserEventController\')">Ajouter un évènement</button></div>'
        },
        dayClick: $scope.alertEventOnClick,
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };

    /* event sources array*/
    $scope.loadEvent();
    $scope.eventSources = [$scope.events];
    $scope.changeLang('french');
    
    $scope.map = {
      control: {
        refresh:true
      },
      showTraffic: true,
      showBicycling: true,
      center: {
        latitude: 45.188529000000000000,
        longitude: 5.724523999999974000
      },
      options: {
        streetViewControl: true,
        panControl: true,
        maxZoom: 20,
        minZoom: 3
      },
      zoom: 8,
      dragging: false,
      bounds: {},
      markers: [
        {
          id: 1,
          latitude: 45,
          longitude: -74,
          showWindow: false,
          title: 'Marker 2'
        },
        {
          id: 2,
          latitude: 15,
          longitude: 30,
          showWindow: false,
          title: 'Marker 2'
        },
        {
          id: 3,
          icon: 'assets/images/plane.png',
          latitude: 37,
          longitude: -122,
          showWindow: false,
          title: 'Plane'
        }
      ],
      doUgly: true, //great name :)
      events: {
        click: function (mapModel, eventName, originalEventArgs) {

          var e = originalEventArgs[0];

          if (!$scope.map.clickedMarker) {
            $scope.map.clickedMarker = {
              title: 'You clicked here',
              latitude: e.latLng.lat(),
              longitude: e.latLng.lng()
            };
          } else {
            var marker = {
              latitude: e.latLng.lat(),
              longitude: e.latLng.lng()
            };
            $scope.map.clickedMarker = marker;
          }

          //scope apply required because this event handler is outside of the angular domain
          $scope.$apply();
        },
        dragend: function () {
          self = this;
        }
      },
      templatedInfoWindow: {
        coords: {
          latitude: 48.654686,
          longitude: -75.937500
        },
        options: {
          disableAutoPan: true
        },
        show: true,
        templateUrl: 'assets/templates/info.html',
        templateParameter: {
          message: 'passed in from the opener'
        }
      }
    };

    $scope.map1 = {
      control: {},
      version: "uknown",
      showTraffic: true,
      showBicycling: true,
      center: {
        latitude: 45.188529000000000000,
        longitude: 5.724523999999974000
      },
      options: {
        streetViewControl: true,
        panControl: true,
        maxZoom: 20,
        minZoom: 3
      },
      zoom: 8,
      dragging: false,
      bounds: {},
      markers: [
      ],
      doUgly: true, //great name :)
      events: {
        click: function (mapModel, eventName, originalEventArgs) {

          var e = originalEventArgs[0];

          if (!$scope.map.clickedMarker) {
            $scope.map.clickedMarker = {
              title: 'You clicked here',
              latitude: e.latLng.lat(),
              longitude: e.latLng.lng()
            };
          } else {
            var marker = {
              latitude: e.latLng.lat(),
              longitude: e.latLng.lng()
            };
            $scope.map.clickedMarker = marker;
          }

          //scope apply required because this event handler is outside of the angular domain
          $scope.$apply();
        },
        dragend: function() {
          self = this;
        }
      }
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
        alert(lat, lng);
        if ($scope.lat != lat || $scope.lon != lon) {
            $scope.map1.center = { lat: lat, lon: lon };
            if (!$scope.$$phase) $scope.$apply("loc");
        }
    };

    $scope.showCreationForm = function() {
      if($scope.selected) $scope.selected.selected = false;
      $scope.onCreation = true;
      $scope.onEdition = false;
    };

    $scope.showEditionForm = function() {
      $scope.editingArticle = _.clone($scope.selected);
      $scope.onEdition = true;
      $scope.onCreation = false;
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

}]);