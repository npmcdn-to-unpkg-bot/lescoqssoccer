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
}]);