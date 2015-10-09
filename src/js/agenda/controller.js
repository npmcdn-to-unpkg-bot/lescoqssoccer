'use strict';

angular.module('mean.agenda').controller('CreateAgendaController', ['$scope', '$location', '$route', 'Global', 'AgendaCollection', 'event', '$modal',
	function($scope, $location, $route, Global, AgendaCollection, event, $modal) {

		$scope.agendaCollection = AgendaCollection;
		$scope.eventTypes = eventTypes;
		$scope.startsAt = $scope.endsAt = ($route.current && $route.current.params.startDate) ? new Date($route.current.params.startDate) : new Date();

		$scope.eventRepeater = [{
			'identifier': 'none',
			'value': 'Pas répéter'
		}, {
			'identifier': 'week',
			'value': 'Toutes les semaines'
		}, {
			'identifier': 'month',
			'value': 'Tous les mois'
		}, {
			'identifier': 'year',
			'value': 'Tous les ans'
		}];

		$scope.userEvent = event || {
			title: '',
			type: 'inverse',
			eventType: $scope.eventTypes[2].identifier,
			content: '',
			startsAt: $scope.startsAt,
			endsAt: $scope.endsAt,
			editable: false,
			deletable: false,
			incrementsBadgeTotal: true,
			recursOn: $scope.eventRepeater[0].identifier,
			location: {}
		};

		/* add custom event*/
		$scope.create = function() {

			if ($scope.userEvent.recursOn === "none") {
				$scope.userEvent.recursOn = undefined;
			}

			$scope.agendaCollection.add($scope.userEvent).then(function(userEvent) {
				$location.path("/agenda");
			});

		};

		/***
		Date picker management
		 ***/
		$scope.open = function($event, datepicker) { //Manage opening of two datepickers

			$event.preventDefault();
			$event.stopPropagation();

			if (datepicker === 'startsAt') {
				$scope.openedStartDate = !$scope.openedStartDate;
				$scope.openedEndDate = false;
			} else {
				$scope.openedEndDate = !$scope.openedEndDate;
				$scope.openedStartDate = false;
			}
		};

		//Update min value for end date of userEvent if startDate increase
		$scope.$watch('userEvent.startsAt', function(newValue, oldValue) {
			if (newValue > $scope.userEvent.endsAt) {
				$scope.userEvent.endsAt = $scope.userEvent.startsAt;
			}
		});

		$scope.$watch('userEvent.endsAt', function(newValue, oldValue) {
			if (newValue < $scope.userEvent.startsAt) {
				$scope.userEvent.startsAt = $scope.userEvent.endsAt;
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
				scrollwheel: false,
				styles: [{
					featureType: "all",
					elementType: "all",
					stylers: [{
						saturation: -100
					}]
				}]
			},
			zoom: 8,
			markers: [{
				id: 1,
				latitude: 45.188529000000000000,
				longitude: 5.724523999999974000,
				events: {
					dragend: function(marker, eventName, model) {
						$scope.userEvent.location = {
							latitude: marker.getPosition().lat(),
							longitude: marker.getPosition().lng()
						};

						$scope.geocodePosition(marker.getPosition());
					}
				},
				options: {
					draggable: true
				}
			}],
			doUgly: true
		};

		$scope.geocodePosition = function(pos) {

			if (!this.geocoder) this.geocoder = new google.maps.Geocoder();

			this.geocoder.geocode({
				latLng: pos
			}, function(responses) {
				if (responses && responses.length > 0) {

					$scope.search = responses[0].formatted_address;

					if (!$scope.$$phase) {
						$scope.$apply();
					}

				} else {

					$modal.open({
						templateUrl: 'js/agenda/views/modal/unknownLocation.html',
						controller: 'unknowLocationCtrl'
					});
				}
			});
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
						$scope.userEvent.location = {
							latitude: loc.A,
							longitude: loc.F
						};
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

		$scope.back = function(){
			window.location = "#!/agenda";
		};
	}
]);

angular.module('mean.agenda').controller('ListController', ['$scope', '$routeParams', '$filter', '$location', '$route', 'Global', 'AgendaCollection', 'Agenda', '$modal',
	function($scope, $routeParams, $filter, $location, $route, Global, AgendaCollection, Agenda, $modal) {

		$scope.agendaCollection = AgendaCollection;
		$scope.eventTypes = eventTypes;
		$scope.agenda = Agenda;

		$scope.agenda = Agenda;

		//Calendar config
		$scope.calendarView = 'month';
		$scope.calendarDay = new Date();
		$scope.calendarTitle = '';

		$scope.setSelectedEvent = function(evt, userEvent) {

			if (evt) {
				evt.preventDefault();
				evt.stopPropagation();
			}

			$scope.selectedEvent = userEvent;

			if ($scope.selectedEvent.location) {
				$scope.map.center = $scope.selectedEvent.location;
			}
		};

		$scope.setPreviousElement = function() {
			var index = (window._.indexOf($scope.filteredAgenda, $scope.selectedEvent) - 1 > 0) ? window._.indexOf($scope.filteredAgenda, $scope.selectedEvent) - 1 : 0;
			$scope.setSelectedEvent(null, $scope.filteredAgenda[index]);
			$scope.$apply();
		};

		$scope.setNextElement = function() {
			var index = (window._.indexOf($scope.filteredAgenda, $scope.selectedEvent) + 1 < $scope.filteredAgenda.length) ? window._.indexOf($scope.filteredAgenda, $scope.selectedEvent) + 1 : $scope.filteredAgenda.length;
			$scope.setSelectedEvent(null, $scope.filteredAgenda[index]);
			$scope.$apply();
		};

		$scope.getFormattedDate = function(date) {
			return $filter('date')(date, "dd MMM yyyy");
		};

		$scope.update = function(userEvent) {
			$scope.agendaCollection.update(userEvent).then(function(newUserEvent) {
				$location.path("/agenda");
			});
		};

		$scope.isPastEvent = function(userEvent) {
			return moment(userEvent.startsAt).endOf('day').isBefore(new Date()) ? userEvent.startsAt : null;
		};

		$scope.isComingEvent = function(userEvent) {
			return moment(userEvent.startsAt).endOf('day').isAfter(new Date()) ? userEvent.startsAt : null;
		};

		$scope.openCalendar = function(evt) {

			evt.preventDefault();
			evt.stopPropagation();

			$modal.open({
				templateUrl: 'js/agenda/views/modal/calendar.html',
				controller: 'calendarCtrl',
				windowClass: 'calendarPopup',
				resolve: {
					Agenda: function() {
						return AgendaCollection.load();
					},
					EventClick: function() {
						return $scope.setSelectedEvent;
					}
				}
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
				mapTypeControl: true,
				zoomControl: true,
				zoomControlOptions: {
					style: google.maps.ZoomControlStyle.MEDIUM,
					position: google.maps.ControlPosition.LEFT_BOTTOM
				},
				streetViewControl: true,
				panControl: false,
				maxZoom: 20,
				minZoom: 3,
				styles: [{
					featureType: "all",
					elementType: "all",
					stylers: [{
						saturation: -100
					}]
				}]
			},
			zoom: 12,
			dragging: false,
			bounds: {},
			markers: [],
			doUgly: true
		};

		angular.forEach($scope.agenda, function(userEvent, $index) {

			if (userEvent.location && userEvent.location !== "") {
				$scope.map.markers.push({
					id: userEvent._id,
					latitude: userEvent.location.latitude,
					longitude: userEvent.location.longitude,
					showWindow: $index === 0,
					title: userEvent.title,
					content: userEvent.content
				});
			}
		});

		$scope.resizeMap = function() {
			$("#google-map").css('height', 'calc(100vh - ' + ($("#agendaCarousel").height() + 164) + "px)");
			$("google-map .angular-google-map-container").css('height', 'calc(100vh - ' + ($("#agendaCarousel").height() + 164) + "px)");
		};

		$scope.$watch(
			function() {
				return $("#agendaCarousel").height();
			},
			function(newValue, oldValue) {
				$scope.resizeMap();
			}
		);
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

var EventDetailData = {

	event: function(AgendaCollection, $route) {
		return ($route.current.params.eventId) ? ArticlesCollection.findOne($route.current.params.eventId) : null;
	}

};

var eventTypes = [{
	identifier: 'restaurant',
	name: 'Resto',
	image: "img/photos/office2-thumb.jpg"
}, {
	identifier: 'holidays',
	name: 'Vacances',
	image: "img/photos/office3-thumb.jpg"
}, {
	identifier: 'party',
	name: 'Soirée',
	image: "img/photos/office6-thumb.jpg"
}, {
	identifier: 'weekend',
	name: 'Week-end',
	image: "img/photos/office5-thumb.jpg"
}, {
	identifier: 'other',
	name: 'Autres',
	image: "img/photos/office6-thumb.jpg"
}];