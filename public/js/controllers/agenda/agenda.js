'use strict';

angular.module('mean.agenda').controller('agendaController', ['$scope', '$routeParams', '$location', 'Global', 'UserEvent', function ($scope, $routeParams, $location, Global, UserEvent) {

    $scope.global = Global;
    $scope.selectedEvent;
    $scope.selectedDate;
    $scope.display = "calendar";
    $scope.onCreation = false;

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

    /* Change View */
    $scope.changeView = function(view,calendar) {
      calendar.fullCalendar('changeView',view);
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
          left: 'add',
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
    
    $scope.map = {control: {},
      version: "uknown",
      heatLayerCallback: function (layer) {
        //set the heat layers backend data
        var mockHeatLayer = new MockHeatLayer(layer);
      },
      showTraffic: true,
      showBicycling: true,
      showWeather: false,
      showHeat: false,
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
      markers2: [
        {
          id: 1,
          icon: 'assets/images/blue_marker.png',
          latitude: 46,
          longitude: -77,
          showWindow: false,
          title: '[46,-77]'
        },
        {
          id: 2,
          icon: 'assets/images/blue_marker.png',
          latitude: 33,
          longitude: -77,
          showWindow: false,
          title: '[33,-77]'
        },
        {
          id: 3,
          icon: 'assets/images/blue_marker.png',
          latitude: 35,
          longitude: -125,
          showWindow: false,
          title: '[35,-125]'
        }
      ],
      mexiIdKey: 'mid',
      mexiMarkers: [
        {
          mid: 1,
          latitude: 29.302567,
          longitude: -106.248779
        },
        {
          mid: 2,
          latitude: 30.369913,
          longitude: -109.434814
        },
        {
          mid: 3,
          latitude: 26.739478,
          longitude: -108.61084
        }
      ],
      clickMarkers: [
        {id: 1, "latitude": 50.948968, "longitude": 6.944781}
        ,
        {id: 2, "latitude": 50.94129, "longitude": 6.95817}
        ,
        {id: 3, "latitude": 50.9175, "longitude": 6.943611}
      ],
      dynamicMarkers: [],
      randomMarkers: [],
      doClusterRandomMarkers: true,
      doUgly: true, //great name :)
      clusterOptions: {title: 'Hi I am a Cluster!', gridSize: 60, ignoreHidden: true, minimumClusterSize: 2,
        imageExtension: 'png', imagePath: 'assets/images/cluster', imageSizes: [72]},
      clickedMarker: {
        title: 'You clicked here',
        latitude: null,
        longitude: null
      },
      events: {
        tilesloaded: function (map, eventName, originalEventArgs) {
        },
        click: function (mapModel, eventName, originalEventArgs) {
          // 'this' is the directive's scope
          console.log("user defined event: " + eventName, mapModel, originalEventArgs);

          var e = originalEventArgs[0];

          if (!$scope.map.clickedMarker) {
            $scope.map.clickedMarker = {
              title: 'You clicked here',
              latitude: e.latLng.lat(),
              longitude: e.latLng.lng()
            };
          }
          else {
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
      infoWindow: {
        coords: {
          latitude: 36.270850,
          longitude: -44.296875
        },
        options: {
          disableAutoPan: true
        },
        show: false
      },
      infoWindowWithCustomClass: {
        coords: {
          latitude: 36.270850,
          longitude: -44.296875
        },
        options: {
          boxClass: 'custom-info-window'
        },
        show: true
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
      },
      circles: [
        {
          id: 1,
          center: {
            latitude: 44,
            longitude: -108
          },
          radius: 500000,
          stroke: {
            color: '#08B21F',
            weight: 2,
            opacity: 1
          },
          fill: {
            color: '#08B21F',
            opacity: 0.5
          },
          geodesic: true, // optional: defaults to false
          draggable: true, // optional: defaults to false
          clickable: true, // optional: defaults to true
          editable: true, // optional: defaults to false
          visible: true // optional: defaults to true
        }
      ],
      polygons: [
        {
          id: 1,
          path: [
            {
              latitude: 50,
              longitude: -80
            },
            {
              latitude: 30,
              longitude: -120
            },
            {
              latitude: 20,
              longitude: -95
            }
          ],
          stroke: {
            color: '#6060FB',
            weight: 3
          },
          editable: true,
          draggable: true,
          geodesic: false,
          visible: true,
          fill: {
            color: '#ff0000',
            opacity: 0.8
          }
        }
      ],
      polygons2: [
        {
          id: 1,
          path: [
            {
              latitude: 60,
              longitude: -80
            },
            {
              latitude: 40,
              longitude: -120
            },
            {
              latitude: 45,
              longitude: -95
            }
          ],
          stroke: {
            color: '#33CDDC',
            weight: 3
          },
          editable: true,
          draggable: true,
          geodesic: false,
          visible: true,
          fill: {
            color: '#33CCCC',
            opacity: 0.8
          }
        }
      ],
      polylines: [
        {
          id: 1,
          path: [
            {
              latitude: 45,
              longitude: -74
            },
            {
              latitude: 30,
              longitude: -89
            },
            {
              latitude: 37,
              longitude: -122
            },
            {
              latitude: 60,
              longitude: -95
            }
          ],
          stroke: {
            color: '#6060FB',
            weight: 3
          },
          editable: true,
          draggable: true,
          geodesic: true,
          visible: true,
          icons: [{
            icon: { 
              path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW              
            },
            offset: '25px',
            repeat: '50px'
          }]
        },
        {
          id: 2,
          path: [
            {
              latitude: 47,
              longitude: -74
            },
            {
              latitude: 32,
              longitude: -89
            },
            {
              latitude: 39,
              longitude: -122
            },
            {
              latitude: 62,
              longitude: -95
            }
          ],
          stroke: {
            color: '#6060FB',
            weight: 3
          },
          editable: true,
          draggable: true,
          geodesic: true,
          visible: true,
          icons: [{
            icon: { 
              path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW              
            },
            offset: '25px',
            repeat: '50px'
          }]
        }
      ]

    };

    $scope.map1 = {
        center: {
            latitude: 45,
            longitude: -73
        },
        zoom: 8,
        events: {
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
        if ($scope.lat != lat || $scope.lon != lon) {
            $scope.map.center = { lat: lat, lon: lon };
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