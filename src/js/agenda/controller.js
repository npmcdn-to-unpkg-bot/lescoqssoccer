'use strict';

angular.module('mean.agenda').controller('CreateAgendaController', ['$scope', '$routeParams', '$location', '$route', '$filter', 'Global', 'AgendaCollection', 'event', '$modal', 'SideMenu',
	function($scope, $routeParams, $location, $route, $filter, Global, AgendaCollection, event, $modal, SideMenu) {

		$scope.agendaCollection = AgendaCollection;
		$scope.eventTypes = eventTypes;
		$scope.start = $scope.end = ($route.current && $route.current.params.startDate) ? new Date($route.current.params.startDate) : new Date();

		//used in subnav
		SideMenu.setMenu({
			middle: [{
				link: "#!/agenda/create",
				image: "img/Draw_Adding_Cross_64.png",
				tooltip: "C'est plus!!",
				type: "link"
			},{
				link: "#!/agenda",
				image: "img/24_hours_delivery_64.png",
				tooltip: "What's next?!",
				type: "link"
			},{
				link: "#!/agenda/map",
				image: "img/Map_of_roads_64.png",
				tooltip: "Je suis la carte",
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

			console.warn($scope.userEvent);
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
	}
]);

var EventDetailData = {

	event: function(AgendaCollection, $route) {
		return ($route.current.params.eventId) ? ArticlesCollection.findOne($route.current.params.eventId) : null;
	}

};

angular.module('mean.agenda').controller('ListController', ['$scope', '$routeParams', '$location', '$route', 'Global', 'AgendaCollection', 'Agenda', 'SideMenu',
	function($scope, $routeParams, $location, $route, Global, AgendaCollection, Agenda, SideMenu) {

		$scope.agendaCollection = AgendaCollection;
		$scope.agenda = Agenda;

		SideMenu.setMenu({
			middle: [{
				link: "#!/agenda/create",
				image: "img/Draw_Adding_Cross_64.png",
				tooltip: "C'est plus!!",
				type: "link"
			},{
				link: "#!/agenda",
				image: "img/24_hours_delivery_64.png",
				tooltip: "What's next?!",
				type: "link"
			},{
				link: "#!/agenda/map",
				image: "img/Map_of_roads_64.png",
				tooltip: "Je suis la carte",
				type: "link"
			}]
		});

		$scope.limit = 3;
		$scope.start = 0;

		$scope.isPastEvent = function(event) {
			return moment(event.start).endOf('day').isBefore(new Date()) ? event.start : null;
		};

		$scope.isComingEvent = function(event) {
			return moment(event.start).endOf('day').isAfter(new Date()) ? event.start : null;
		};

		$scope.previous = function(evt){

			evt.preventDefault();
			evt.stopPropagation();

			if($scope.start > 0){
				$scope.start--;
			}
		};

		$scope.next = function(evt){

			evt.preventDefault();
			evt.stopPropagation();

			if($scope.start < $scope.filteredAgenda.length - $scope.limit){
				$scope.start++;
			}
		};

		$scope.update = function(userEvent) {

			var promise = $scope.agendaCollection.update(userEvent);
			promise.then(function(newUserEvent) {
				$location.path("/agenda");
			});
		};

		$scope.calendarView = 'month';
		$scope.calendarTitle = 'Mon super calendar';
		$scope.calendarDay = new Date();

		$scope.events = [];
		angular.forEach($scope.agenda, function(userEvent) {
			$scope.events.push({
				title: userEvent.title, // The title of the event
				type: 'success', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
				startsAt: userEvent.start, // A javascript date object for when the event starts
				endsAt: userEvent.start, // Optional - a javascript date object for when the event ends
				editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable. If set to false will also prevent the event from being dragged and dropped.
				deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
				incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
				recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
				cssClass: 'a-css-class-name' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
			});
		});

		$scope.eventTypes = eventTypes;
	}
]);

angular.module('mean.agenda').controller('MapController', ['$scope', '$routeParams', '$location', '$route', '$filter', 'Global', 'AgendaCollection', 'Agenda', 'SideMenu',
	function($scope, $routeParams, $location, $route, $filter, Global, AgendaCollection, Agenda, SideMenu) {

		$scope.agendaCollection = AgendaCollection;
		$scope.agenda = Agenda;

		SideMenu.setMenu({
			middle: [{
				link: "#!/agenda/create",
				image: "img/Draw_Adding_Cross_64.png",
				tooltip: "C'est plus!!",
				type: "link"
			},{
				link: "#!/agenda",
				image: "img/24_hours_delivery_64.png",
				tooltip: "What's next?!",
				type: "link"
			},{
				link: "#!/agenda/map",
				image: "img/Map_of_roads_64.png",
				tooltip: "Je suis la carte",
				type: "link"
			}]
		});

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
			zoom: 6,
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

		angular.forEach($scope.agenda, function(userEvent) {
			if (userEvent.location && userEvent.location !== "") {
				$scope.map.markers.push({
					id: userEvent._id,
					latitude: userEvent.location.latitude,
					longitude: userEvent.location.longitude,
					showWindow: false,
					title: userEvent.title,
					content: userEvent.content,
					photos: userEvent.photos
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
	name: 'Resto',
	image: "img/3d5c45b634304f99146a9e3913307a2f.jpg"
}, {
	identifier: 'holidays',
	name: 'Vacances',
	image: "img/3d5c45b634304f99146a9e3913307a2f.jpg"
}, {
	identifier: 'party',
	name: 'Soirée',
	image: "img/400x300beer.jpg"
}, {
	identifier: 'weekend',
	name: 'Week-end',
	image: "img/400x300beer.jpg"
}, {
	identifier: 'other',
	name: 'Autres',
	image: "img/400x300beer.jpg"
}];

var styles = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#555555"},{"visibility":"on"}]}];