'use strict';

angular.module('mean.agenda').controller('createController', ['$scope', '$routeParams', '$location', '$route', '$filter', 'Global', 'AgendaCollection', 'FileUploader', '$modal',
	function($scope, $routeParams, $location, $route, $filter, Global, AgendaCollection, FileUploader, $modal) {

		$scope.agendaCollection = AgendaCollection;
		$scope.view = $route.current.params.view;
		$scope.eventTypes = eventTypes;
		$scope.start = $scope.end = ($route.current && $route.current.params.startDate) ? new Date($route.current.params.startDate) : new Date();

		$scope.init = function() {

			$scope.userEvent = {
				selectedType: $scope.eventTypes[2],
				title: '',
				content: '',
				start: $scope.start,
				end: $scope.end,
				photos: [],
				location: {},
				allDay: true
			};
		};

		/* add custom event*/
		$scope.create = function() {

			$scope.userEvent.type = $scope.userEvent.selectedType.identifier;

			var promise = $scope.agendaCollection.add($scope.userEvent);
			promise.then(function(userEvent) {
				$location.path("/agenda");
			});
		};

		/***
		Date picker management
		 ***/
		$scope.open = function($event, datepicker) { //Manage opening of two datepickers
			$event.preventDefault();
			$event.stopPropagation();

			if (datepicker === 'start') {
				$scope.openedStartDate = !$scope.openedStartDate;
				$scope.openedEndDate = false;
			} else {
				$scope.openedEndDate = !$scope.openedEndDate;
				$scope.openedStartDate = false;
			}
		};

		//Update min value for end date of userEvent if startDate increase
		$scope.$watch('userEvent.start', function(newValue, oldValue) {
			if (newValue > oldValue) {
				$scope.userEvent.end = $scope.userEvent.start;
			}
		});

		//Config
		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[2];
		$scope.dateOptions = {
			'year-format': "'yy'",
			'starting-day': 1
		};

		/***
		Photos management
		 ***/
		$scope.uploader = new FileUploader({
			scope: $scope,
			url: '/upload/photo',
			autoUpload: true,
			formData: [{
				key: 'value'
			}]
		});

		$scope.uploader.onCompleteItem = function(item, response, status, headers) {
			console.info('Complete', item, response);

			$scope.userEvent.photos.push({
				path: response.path,
				name: response.name
			});
		};

		/***
		Map management
		 ***/
		$scope.map = {
			control: {},
			showTraffic: true,
			showBicycling: true,
			center: {
				latitude: 45.188529000000000000,
				longitude: 5.724523999999974000
			},
			options: {
				streetViewControl: true,
				panControl: true,
				scrollwheel: false
			},
			zoom: 8,
			markers: [{
				id: 1,
				latitude: 45.188529000000000000,
				longitude: 5.724523999999974000,
				events: {
					dragend: function(marker, eventName, model) {
						$scope.userEvent.location = {
							k: marker.getPosition().lat(),
							B: marker.getPosition().lng()
						}
					}
				},
				options: {
					draggable: true
				}
			}],
			doUgly: true
		};

		$scope.geoCode = function() {

			if (this.search && this.search.length > 0) {
				if (!this.geocoder) this.geocoder = new google.maps.Geocoder();

				this.geocoder.geocode({
					'address': this.search
				}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {

						var loc = results[0].geometry.location;
						$scope.search = results[0].formatted_address;
						$scope.userEvent.location = loc;
						$scope.gotoLocation(loc.lat(), loc.lng());

					} else {

						$modal.open({
							templateUrl: 'js/agenda/views/modal/unknownLocation.html',
							controller: 'unknowLocationCtrl'
						});
					}
				});
			}
		};

		$scope.gotoCurrentLocation = function() {
			if ("geolocation" in navigator) {
				navigator.geolocation.getCurrentPosition(function(position) {
					$scope.gotoLocation(position.coords.latitude, position.coords.longitude);
				});
				return true;
			}
			return false;
		};

		$scope.gotoLocation = function(lat, lon) {

			if ($scope.map.center.latitude !== lat || $scope.map.center.longitude !== lon) {

				$scope.map.markers[0].latitude = $scope.map.center.latitude = lat;
				$scope.map.markers[0].longitude = $scope.map.center.longitude = lon;

				if (!$scope.$$phase) {
					$scope.$apply();
				}
			}
		};
	}
]);

angular.module('mean.agenda').controller('calendarController', ['$scope', '$routeParams', '$location', '$route', '$filter', 'Global', 'AgendaCollection',
	function($scope, $routeParams, $location, $route, $filter, Global, AgendaCollection) {

		$scope.agendaCollection = AgendaCollection;
		$scope.view = "agenda";

		$scope.load = function() {

			if ($scope.agendaCollection.all.length === 0) {

				var promise = $scope.agendaCollection.load();
				promise.then(function(events) {
					$scope.agendaCollection.setEvents(events);
					angular.forEach(events, function(event) {
						$scope.events.push(event);
					});
				});

			} else {

				angular.forEach($scope.agendaCollection.all, function(event) {
					$scope.events.push(event);
				});
			}
		};

		$scope.update = function(userEvent) {

			var promise = $scope.agendaCollection.update(userEvent);
			promise.then(function(newUserEvent) {
				$location.path("/agenda");
			});
		};

		/***
		Calendar events and config
		***/
		$scope.onDateClick = function(date, allDay, jsEvent, view) {
			$location.path('/agenda/create/' + date);
		};

		$scope.onEventClick = function(event, allDay, jsEvent, view) {
			// $scope.userEvent = event;
			// $scope.userEvent.index = event.__uiCalId - 1;
			// $scope.selectedUserEvent.selectedType = $filter('getByIdentifier')($scope.eventTypes, $scope.selectedUserEvent.type);
		};

		$scope.onEventDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
			$scope.update(event);
		};

		$scope.onEventResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view) {
			$scope.update(event);
		};

		$scope.changeLang = function(language) {
			if (language === 'french') {

				var frenchConfig = {
					calendar: {
						firstDay: 1,
						monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
						monthNamesShort: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jui', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc'],
						dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
						dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
						header: {
							left: 'month agendaWeek agendaDay',
							center: 'title',
							right: 'prev,next'
						},
						buttonText: {
							prev: "<span class='fc-text-arrow'>&lsaquo;</span>",
							next: "<span class='fc-text-arrow'>&rsaquo;</span>",
							prevYear: "<span class='fc-text-arrow'>&laquo;</span>",
							nextYear: "<span class='fc-text-arrow'>&raquo;</span>",
							today: 'Aujourd\'hui',
							month: 'Mois',
							week: 'Semaine',
							day: 'Jour'
						}
					}
				};

				$scope.uiConfig.calendar = _.defaults(frenchConfig.calendar, $scope.uiConfig.calendar);
			}
		};

		$scope.uiConfig = {
			calendar: {
				height: 300,
				editable: true,
				header: {
					left: 'month agendaWeek agendaDay',
					center: 'title',
					right: 'prev,next'
				},
				dayClick: $scope.onDateClick,
				eventClick: $scope.onEventClick,
				eventDrop: $scope.onEventDrop,
				eventResize: $scope.onEventResize
			}
		};

		$scope.changeLang('french');
		$scope.events = [];
		$scope.eventSources = [$scope.events];
	}
]);

angular.module('mean.agenda').controller('mapController', ['$scope', '$routeParams', '$location', '$route', '$filter', 'Global', 'AgendaCollection',
	function($scope, $routeParams, $location, $route, $filter, Global, AgendaCollection) {

		$scope.agendaCollection = AgendaCollection;
		$scope.view = $route.current.params.view;

		// Agenda
		$scope.load = function() {

			var promise = $scope.agendaCollection.load();
			promise.then(function(events) {
				angular.forEach(events, function(event) {
					if (event.location && event.location !== "") {
						$scope.map.markers.push({
							id: event._id,
							latitude: event.location.k,
							longitude: event.location.B,
							showWindow: false,
							title: event.title,
							content: event.content,
							photos: event.photos
						});
					}
				});
			});
		};

		var styles = [{
			"featureType": "administrative",
			"elementType": "labels.text.fill",
			"stylers": [{
				"color": "#444444"
			}]
		}, {
			"featureType": "administrative.country",
			"elementType": "geometry",
			"stylers": [{
				"visibility": "on"
			}, {
				"hue": "#ff0000"
			}]
		}, {
			"featureType": "administrative.locality",
			"elementType": "labels",
			"stylers": [{
				"visibility": "on"
			}, {
				"hue": "#ff0000"
			}]
		}, {
			"featureType": "administrative.locality",
			"elementType": "labels.text",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "administrative.locality",
			"elementType": "labels.text.fill",
			"stylers": [{
				"visibility": "on"
			}, {
				"hue": "#ff0000"
			}]
		}, {
			"featureType": "administrative.locality",
			"elementType": "labels.text.stroke",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "administrative.locality",
			"elementType": "labels.icon",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "administrative.neighborhood",
			"elementType": "all",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "administrative.neighborhood",
			"elementType": "geometry",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "administrative.neighborhood",
			"elementType": "geometry.fill",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "administrative.neighborhood",
			"elementType": "geometry.stroke",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "administrative.neighborhood",
			"elementType": "labels",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "administrative.neighborhood",
			"elementType": "labels.icon",
			"stylers": [{
				"visibility": "on"
			}, {
				"hue": "#ff0000"
			}]
		}, {
			"featureType": "administrative.land_parcel",
			"elementType": "geometry",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "administrative.land_parcel",
			"elementType": "geometry.fill",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "administrative.land_parcel",
			"elementType": "geometry.stroke",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "administrative.land_parcel",
			"elementType": "labels",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "administrative.land_parcel",
			"elementType": "labels.text",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "administrative.land_parcel",
			"elementType": "labels.text.fill",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "administrative.land_parcel",
			"elementType": "labels.text.stroke",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "administrative.land_parcel",
			"elementType": "labels.icon",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "landscape",
			"elementType": "all",
			"stylers": [{
				"color": "#f2f2f2"
			}]
		}, {
			"featureType": "landscape.man_made",
			"elementType": "geometry",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "landscape.man_made",
			"elementType": "geometry.fill",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "landscape.man_made",
			"elementType": "geometry.stroke",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "landscape.man_made",
			"elementType": "labels",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "landscape.man_made",
			"elementType": "labels.text",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "landscape.man_made",
			"elementType": "labels.text.fill",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "landscape.man_made",
			"elementType": "labels.text.stroke",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "poi",
			"elementType": "all",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "poi.attraction",
			"elementType": "geometry",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "poi.attraction",
			"elementType": "labels",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "road",
			"elementType": "all",
			"stylers": [{
				"saturation": -100
			}, {
				"lightness": 45
			}]
		}, {
			"featureType": "road.highway",
			"elementType": "all",
			"stylers": [{
				"visibility": "simplified"
			}]
		}, {
			"featureType": "road.arterial",
			"elementType": "labels.icon",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "road.local",
			"elementType": "geometry",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "road.local",
			"elementType": "labels",
			"stylers": [{
				"visibility": "on"
			}]
		}, {
			"featureType": "transit",
			"elementType": "all",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "water",
			"elementType": "all",
			"stylers": [{
				"color": "#002142"
			}, {
				"visibility": "on"
			}]
		}];

		$scope.map = {
			control: {
				refresh: true
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
				minZoom: 3,
				styles: styles
			},
			zoom: 8,
			dragging: false,
			bounds: {},
			markers: [],
			doUgly: true
		};

		$scope.onMarkerClicked = function(marker) {
			angular.forEach($scope.map.markers, function(marker) {
				marker.showWindow = false;
			});
			marker.showWindow = true;
		};
	}
]);

angular.module('mean.agenda').controller('subNavController', ['$scope', '$routeParams', '$location', '$route', '$filter', 'Global', 'AgendaCollection',
	function($scope, $routeParams, $location, $route, $filter, Global, AgendaCollection) {

		$scope.view = ($route.current && $route.current.params.view) ? $route.current.params.view : 'agenda'; //if view not set in route params,view = list
		$scope.section = {
			'name': 'Agenda',
			'url': '/agenda'
		};

		console.warn($scope.view);
	}
]);

angular.module('mean.agenda').controller('unknowLocationCtrl', ['$scope', '$modalInstance',

	function($scope, $modalInstance) {

		$scope.ok = function(result) {
			$modalInstance.close(result);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}
]);

var eventTypes = [{
	identifier: 'restaurant',
	name: 'Resto'
}, {
	identifier: 'holidays',
	name: 'Vacances'
}, {
	identifier: 'party',
	name: 'Soirée'
}, {
	identifier: 'weekend',
	name: 'Week-end'
}, {
	identifier: 'other',
	name: 'Autres'
}];