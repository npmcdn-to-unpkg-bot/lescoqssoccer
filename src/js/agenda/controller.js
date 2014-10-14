'use strict';

angular.module('mean.agenda').controller('agendaController', ['$scope', '$routeParams', '$location', '$route', '$filter', 'Global', 'AgendaCollection', 'FileUploader',
	function ($scope, $routeParams, $location, $route, $filter, Global, AgendaCollection, FileUploader) {

		$scope.global = Global;
		$scope.AgendaCollection = AgendaCollection;
		$scope.currentUserEvent, $scope.selectedUserEvent;

		$scope.eventTypes = [{
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

		// create a uploader with options
		$scope.uploader = new FileUploader( {
			scope: $scope,
			url: '/upload/photo',
			autoUpload: true,
			formData: [ {
				key: 'value'
			} ]
		} );

		$scope.uploader.onCompleteItem = function ( item, response, status, headers ) {
			console.info( 'Complete', item, response );

			$scope.image = response;
			console.log($scope.image.path);
			console.log($scope.image.name);
		};

		$scope.init = function () {

			$scope.selectedUserEvent = null;

			$scope.currentUserEvent = {
				selectedType: $scope.eventTypes[2],
				title: '',
				content: '',
				start: new Date(),
				end: new Date(),
				location: '',
				allDay: true
			};
		};

		// Agenda
		$scope.load = function () {

			$scope.AgendaCollection.load(function (events) {
				angular.forEach(events, function (event) {
					$scope.events.push(event);
				});
			});

		};

		/* add custom event*/
		$scope.addOrUpdate = function () {

			if (!$scope.currentUserEvent.__uiCalId) {

				$scope.currentUserEvent.type = $scope.currentUserEvent.selectedType.identifier;
				$scope.AgendaCollection.add($scope.currentUserEvent, function (userEvent) {
					$scope.events.push(userEvent);
					$scope.init();
					$location.path("/agenda");
				});

			} else {
				$scope.update($scope.currentUserEvent.__uiCalId - 1);
			}

		};

		$scope.update = function () {

			var userEvent = $scope.currentUserEvent;

			$scope.AgendaCollection.update(userEvent, function (newUserEvent) {
				newUserEvent.selectedType = $filter('getByIdentifier')($scope.eventTypes, $scope.currentUserEvent.type);
				$scope.calendar.fullCalendar('updateEvent', newUserEvent);
				$scope.init();
				$scope.selectedUserEvent = newUserEvent;
				$location.path("/agenda");
			});

		};

		/* remove event */
		$scope.remove = function (index) {

			var userEvent = $scope.events[index];
			var userEventId = userEvent.id;

			$scope.AgendaCollection.remove(userEvent, function () {
				$scope.calendar.fullCalendar('removeEvents', userEventId);
				$scope.init();
			});

		};

		$scope.events = [];
		$scope.eventSources = [$scope.events];
		$scope.init();
		$scope.load();

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
			markers: [{
				id: 1,
				latitude: 45.188529000000000000,
				longitude: 5.724523999999974000,
				showWindow: false,
				title: 'Marker 2'
			}],
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
			}
		};

		$scope.onMarkerClicked = function (marker) {
			marker.showWindow = true;
		};

		$scope.geoCode = function () {
			if ($scope.search && $scope.search.length > 0) {
				if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
				this.geocoder.geocode({
					'address': $scope.search
				}, function (results, status) {
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
				$scope.map1.center = {
					lat: lat,
					lon: lon
				};
				if (!$scope.$$phase) $scope.$apply("loc");
			}
		};

		/***
		Date picker management
		 ***/
		$scope.initialize = function () {
			var start = angular.element('#directives-calendar').scope().selectedDate;
			if (start) {
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
		$scope.disabled = function (date, mode) {
			return ($scope.openedEndDate === true && date < $scope.start);
		};

		$scope.toggleMin = function () {
			$scope.minDate = ($scope.minDate) ? null : new Date();
		};

		$scope.open = function ($event, datepicker) {
			$event.preventDefault();
			$event.stopPropagation();

			if (datepicker === 'start') {
				$scope.openedStartDate = ($scope.openedStartDate) ? false : true;
				$scope.openedEndDate = false;
			} else {
				$scope.openedEndDate = ($scope.openedEndDate) ? false : true;
				$scope.openedStartDate = false;
			}
		};

		$scope.dateOptions = {
			'year-format': "'yy'",
			'starting-day': 1
		};
	}
]);

angular.module('mean.agenda').controller('calendarController', ['$scope', '$routeParams', '$location', '$route', '$filter', 'Global', 'AgendaCollection',
	function ($scope, $routeParams, $location, $route, $filter, Global, AgendaCollection) {

		$scope.agendaCollection = AgendaCollection;
		$scope.currentUserEvent;
		$scope.selectedUserEvent;

		// Agenda
		$scope.load = function () {

			$scope.agendaCollection.load(function (events) {
				angular.forEach(events, function (event) {
					$scope.events.push(event);
				});
			});

		};

		/* alert on eventClick */
		$scope.onDateClick = function (date, allDay, jsEvent, view) {
			$scope.currentUserEvent.start = $scope.currentUserEvent.end = date;
		};

		$scope.onEventClick = function (event, allDay, jsEvent, view) {
			$scope.selectedUserEvent = event;
			$scope.selectedUserEvent.index = event.__uiCalId - 1;
			// $scope.selectedUserEvent.selectedType = $filter('getByIdentifier')($scope.eventTypes, $scope.selectedUserEvent.type);
		};

		/* alert on Drop */
		$scope.onEventDrop = function (event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
			// $scope.update(event);
		};

		/* alert on Resize */
		$scope.onEventResize = function (event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view) {
			// $scope.update(event);
		};

		$scope.changeLang = function (language) {
			if (language === 'french') {
				$scope.uiConfig.calendar.firstDay = 1;
				$scope.uiConfig.calendar.monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
				$scope.uiConfig.calendar.monthNamesShort = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jui', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc'];
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

		$scope.events = [];
		$scope.eventSources = [$scope.events];
		$scope.load();
	}
]);

angular.module('mean.agenda').controller('mapController', ['$scope', '$routeParams', '$location', '$route', '$filter', 'Global', 'AgendaCollection',
	function ($scope, $routeParams, $location, $route, $filter, Global, AgendaCollection) {

		$scope.agendaCollection = AgendaCollection;

		// Agenda
		$scope.load = function () {

			$scope.agendaCollection.load(function (events) {
				angular.forEach(events, function (event) {
					$scope.events.push(event);
				});
			});

		};

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
				minZoom: 3
			},
			zoom: 8,
			dragging: false,
			bounds: {},
			markers: [{
				id: 1,
				latitude: 45.188529000000000000,
				longitude: 5.724523999999974000,
				showWindow: false,
				title: 'Marker 2'
			}, {
				id: 2,
				latitude: 15,
				longitude: 30,
				showWindow: false,
				title: 'Marker 2'
			}, {
				id: 3,
				latitude: 37,
				longitude: -122,
				showWindow: false,
				title: 'Plane'
			}],
			doUgly: true
		};

		$scope.onMarkerClicked = function (marker) {
			marker.showWindow = true;
		};

		$scope.events = [];
		$scope.eventSources = [$scope.events];
		$scope.load();
	}
]);

angular.module('mean.agenda').controller('subNavController', ['$scope', '$routeParams', '$location', '$route', '$filter', 'Global', 'AgendaCollection',
	function ($scope, $routeParams, $location, $route, $filter, Global, AgendaCollection) {

		$scope.view = ($route.current && $route.current.params.view) ? $route.current.params.view : 'agenda'; //if view not set in route params,view = list
		$scope.section = {
			'name': 'Agenda',
			'url': '/agenda'
		};
	}
]);
