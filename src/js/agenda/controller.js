'use strict';

angular.module('mean.agenda').controller('CreateAgendaController', ['$scope', '$routeParams', '$location', '$route', '$filter', 'Global', 'AgendaCollection', 'event', '$modal', 'SubMenu',
	function($scope, $routeParams, $location, $route, $filter, Global, AgendaCollection, event, $modal, SubMenu) {

		$scope.agendaCollection = AgendaCollection;
		$scope.eventTypes = eventTypes;
		$scope.start = $scope.end = ($route.current && $route.current.params.startDate) ? new Date($route.current.params.startDate) : new Date();

		//used in subnav
		SubMenu.setMenu({
			middle: [{
				link: "#!/agenda",
				image: "img/24_hours_delivery_64.png",
				tooltip: "What's next?!",
				type: "link"
			}, {
				link: "#!/agenda/calendar",
				image: "img/Calendar_hand_drawn_tool_64.png",
				tooltip: "Calendrier",
				type: "link"
			}, {
				link: "#!/agenda/map",
				image: "img/Map_of_roads_64.png",
				tooltip: "Je suis la carte",
				type: "link"
			}, {
				link: "#!/agenda/create",
				image: "img/Draw_Adding_Cross_64.png",
				tooltip: "Ajouter un petit nouveau",
				type: "link"
			}]
		});

		$scope.userEvent = event || {
			selectedType: $scope.eventTypes[2],
			title: '',
			content: '',
			start: $scope.start,
			end: $scope.end,
			photos: [],
			location: {},
			allDay: true
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

var EventDetailData = {

	event: function(AgendaCollection, $route) {
		return ($route.current.params.eventId) ? ArticlesCollection.findOne($route.current.params.eventId) : null;
	}

};

angular.module('mean.agenda').controller('ListController', ['$scope', '$routeParams', '$location', '$route', 'Global', 'AgendaCollection', 'Agenda', 'SubMenu',
	function($scope, $routeParams, $location, $route, Global, AgendaCollection, Agenda, SubMenu) {

		$scope.agendaCollection = AgendaCollection;
		$scope.agenda = Agenda;

		SubMenu.setMenu({
			middle: [{
				link: "#!/agenda",
				image: "img/24_hours_delivery_64.png",
				tooltip: "What's next?!",
				type: "link"
			}, {
				link: "#!/agenda/calendar",
				image: "img/Calendar_hand_drawn_tool_64.png",
				tooltip: "Calendrier",
				type: "link"
			}, {
				link: "#!/agenda/map",
				image: "img/Map_of_roads_64.png",
				tooltip: "Je suis la carte",
				type: "link"
			}, {
				link: "#!/agenda/create",
				image: "img/Draw_Adding_Cross_64.png",
				tooltip: "Ajouter un petit nouveau",
				type: "link"
			}]
		});

		$scope.obj = {
			searchTitle: ""
		};

		$scope.nameFilter = function(event) {
			return (event.title.toLowerCase().indexOf($scope.obj.searchTitle) !== -1) ? event.title : null;
		};

		$scope.isPastEvent = function(event) {
			return moment(event.start).endOf('day').isBefore(new Date()) ? event.start : null;
		};

		$scope.isComingEvent = function(event) {
			return moment(event.start).endOf('day').isAfter(new Date()) ? event.start : null;
		};

		$scope.update = function(userEvent) {

			var promise = $scope.agendaCollection.update(userEvent);
			promise.then(function(newUserEvent) {
				$location.path("/agenda");
			});
		};

		$scope.events = [];
		$scope.eventTypes = eventTypes;
	}
]);

angular.module('mean.agenda').controller('CalendarController', ['$scope', '$routeParams', '$location', '$route', 'Global', 'AgendaCollection', 'Agenda', 'SubMenu',
	function($scope, $routeParams, $location, $route, Global, AgendaCollection, Agenda, SubMenu) {

		$scope.agendaCollection = AgendaCollection;
		$scope.agenda = Agenda;

		SubMenu.setMenu({
			middle: [{
				link: "#!/agenda",
				image: "img/24_hours_delivery_64.png",
				tooltip: "What's next?!",
				type: "link"
			}, {
				link: "#!/agenda/calendar",
				image: "img/Calendar_hand_drawn_tool_64.png",
				tooltip: "Calendrier",
				type: "link"
			}, {
				link: "#!/agenda/map",
				image: "img/Map_of_roads_64.png",
				tooltip: "Je suis la carte",
				type: "link"
			}, {
				link: "#!/agenda/create",
				image: "img/Draw_Adding_Cross_64.png",
				tooltip: "Ajouter un petit nouveau",
				type: "link"
			}]
		});

		$scope.calendarView = 'month';
		$scope.calendarTitle = 'Mon super calendar';
		$scope.calendarDay = new Date();

		$scope.events = [{
			title: 'My event title', // The title of the event
			type: 'success', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
			startsAt: new Date(2013, 5, 1, 1), // A javascript date object for when the event starts
			endsAt: new Date(2013, 5, 17, 15), // Optional - a javascript date object for when the event ends
			editable: true, // If edit-event-html is set and this field is explicitly set to false then dont make it editable. If set to false will also prevent the event from being dragged and dropped.
			deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
			incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
			recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
			cssClass: 'a-css-class-name' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
		}];

		$scope.eventTypes = eventTypes;
	}
]);

angular.module('mean.agenda').controller('MapController', ['$scope', '$routeParams', '$location', '$route', '$filter', 'Global', 'AgendaCollection', 'Agenda', 'SubMenu',
	function($scope, $routeParams, $location, $route, $filter, Global, AgendaCollection, Agenda, SubMenu) {

		$scope.agendaCollection = AgendaCollection;
		$scope.agenda = Agenda;

		SubMenu.setMenu({
			middle: [{
				link: "#!/agenda",
				image: "img/24_hours_delivery_64.png",
				tooltip: "What's next?!",
				type: "link"
			}, {
				link: "#!/agenda/calendar",
				image: "img/Calendar_hand_drawn_tool_64.png",
				tooltip: "Calendrier",
				type: "link"
			}, {
				link: "#!/agenda/map",
				image: "img/Map_of_roads_64.png",
				tooltip: "Je suis la carte",
				type: "link"
			}, {
				link: "#!/agenda/create",
				image: "img/Draw_Adding_Cross_64.png",
				tooltip: "Ajouter un petit nouveau",
				type: "link"
			}]
		});

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

		angular.forEach($scope.agenda, function(event) {
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