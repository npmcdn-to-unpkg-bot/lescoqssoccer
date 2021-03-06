"use strict";

angular.module("mean.agenda").controller("CreateAgendaController", ["$scope", "$location", "$route", "Global", "AgendaCollection", "event", "$modal",
	function($scope, $location, $route, Global, AgendaCollection, event, $modal) {

		$scope.agendaCollection = AgendaCollection;
		$scope.eventTypes = eventTypes;
		$scope.startsAt = $scope.endsAt = ($route.current && $route.current.params.startDate) ? new Date($route.current.params.startDate) : new Date();

		$scope.eventRepeater = [{
			"identifier": undefined,
			"value": "Pas répéter"
		}, {
			"identifier": "week",
			"value": "Toutes les semaines"
		}, {
			"identifier": "month",
			"value": "Tous les mois"
		}, {
			"identifier": "year",
			"value": "Tous les ans"
		}];

		/***
		Map management
		 ***/
		$scope.defaultLocation = {
			lat: 45.71226,
			lng: 5.08080,
			adress: "Montcul"
		};

		$scope.map = {
			control: {},
			showTraffic: true,
			showBicycling: true,
			center: {
				latitude: $scope.defaultLocation.lat,
				longitude: $scope.defaultLocation.lng
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
				latitude: $scope.defaultLocation.lat,
				longitude: $scope.defaultLocation.lng,
				events: {
					dragend: function(marker, eventName, model) {

						$scope.userEvent.location = {
							latitude: marker.getPosition().lat(),
							longitude: marker.getPosition().lng()
						};

						$scope.geocodePosition(marker.getPosition(), false);
					}
				},
				options: {
					draggable: true
				}
			}],
			doUgly: true
		};

		$scope.userEvent = event || {
			title: "",
			type: "inverse",
			eventType: $scope.eventTypes[2].identifier,
			content: "",
			startsAt: $scope.startsAt,
			endsAt: $scope.endsAt,
			editable: false,
			deletable: false,
			incrementsBadgeTotal: true,
			recursOn: $scope.eventRepeater[0].identifier,
			location: {
				latitude: $scope.defaultLocation.lat,
				longitude: $scope.defaultLocation.lng
			},
			guest: []
		};

		$scope.create = function(evt) {

			evt.preventDefault();
			evt.stopPropagation();

			if ($scope.userEvent.title) {
				if ($scope.userEvent._id) {
					$scope.agendaCollection.update($scope.userEvent).then(function(newUserEvent) {
						$location.path("/agenda");
					});
				} else {
					$scope.agendaCollection.add($scope.userEvent).then(function(userEvent) {
						$location.path("/agenda");
					});
				}
			} else {
				var modalInstance = $modal.open({
					templateUrl: "js/articles/views/modal/noTitleArticleModalCtrl.html",
					controller: "noTitleEventModalCtrl"
				});
			}
		};

		/***
		Date picker management
		 ***/

		//Config
		$scope.formats = ["dd-MMMM-yyyy", "yyyy/MM/dd", "dd.MM.yyyy", "shortDate"];
		$scope.format = $scope.formats[2];
		$scope.dateOptions = {
			"year-format": "yy",
			"starting-day": 1
		};

		//Close ones if other is already open
		$scope.open = function($event, datepicker) { //Manage opening of two datepickers

			$event.preventDefault();
			$event.stopPropagation();

			if (datepicker === "startsAt") {
				$scope.openedStartDate = !$scope.openedStartDate;
				$scope.openedEndDate = false;
			} else {
				$scope.openedEndDate = !$scope.openedEndDate;
				$scope.openedStartDate = false;
			}
		};

		//Update min value for end date of userEvent if startDate increase
		$scope.$watch("userEvent.startsAt", function(newValue, oldValue) {
			if (newValue > $scope.userEvent.endsAt) {
				$scope.userEvent.endsAt = $scope.userEvent.startsAt;
			}
		});

		$scope.$watch("userEvent.endsAt", function(newValue, oldValue) {
			if (newValue < $scope.userEvent.startsAt) {
				$scope.userEvent.startsAt = $scope.userEvent.endsAt;
			}
		});

		$scope.geocodePosition = function(pos, showModal) {

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

					if (showModal) {
						$modal.open({
							templateUrl: "js/agenda/views/modal/unknownLocation.html",
							controller: "unknowLocationCtrl"
						});
					}

				}
			});
		};

		$scope.geoCode = function() {

			if (this.search && this.search.length > 0) {

				if (!this.geocoder) this.geocoder = new google.maps.Geocoder();

				this.geocoder.geocode({
					"address": this.search
				}, function(results, status) {

					if (status == google.maps.GeocoderStatus.OK) {

						var loc = results[0].geometry.location;

						$scope.gotoLocation(loc.lat(), loc.lng());
						$scope.search = results[0].formatted_address;
						$scope.userEvent.location = {
							latitude: loc.lat(),
							longitude: loc.lng()
						};

					} else {

						$modal.open({
							templateUrl: "js/agenda/views/modal/unknownLocation.html",
							controller: "unknowLocationCtrl"
						});
					}

				});
			}
		};

		$scope.gotoCurrentLocation = function() {
			if ("geolocation" in navigator) {

				navigator.geolocation.getCurrentPosition(

					function(position) {

						$scope.gotoLocation(position.coords.latitude, position.coords.longitude);
						$scope.geocodePosition({
							lat: position.coords.latitude,
							lng: position.coords.longitude
						}, false);

					},
					function(err) {
						console.debug("ERROR(" + err.code + "): " + err.message);

						$scope.gotoLocation($scope.defaultLocation.lat, $scope.defaultLocation.lng);
						$scope.search = $scope.defaultLocation.adress;
					}
				);

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

		$scope.$parent.menu = {
			title: "Nouvel évènement",
			items: [{
				link: "#!",
				info: "Retour",
				icon: "fa-arrow-left",
				callback: $scope.global.back
			}, {
				link: "#!",
				info: "Sauvegarder",
				icon: "fa-save",
				callback: $scope.create
			}]
		};
	}
]);

angular.module("mean.agenda").controller("ListController", ["$scope", "$routeParams", "$filter", "$location", "$route", "Global", "Agenda", "AgendaCollection", "$modal",
	function($scope, $routeParams, $filter, $location, $route, Global, Agenda, AgendaCollection, $modal) {

		$scope.global = Global;
		$scope.agenda = Agenda;
		$scope.agendaCollection = AgendaCollection;
		$scope.eventTypes = eventTypes;
		$scope.dateNow = new Date();

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

		$scope.showAgendaDetail = function() {
			if ($scope.selectedEvent.subType === "euroMatch") {
				// $location.path("/euro/" + $scope.selectedEvent.matchId);
			} else {
				$location.path("/agenda/view/" + $scope.selectedEvent._id);
			}
		};

		$scope.setSelectedEvent = function(evt, userEvent) {

			if (evt) {
				evt.preventDefault();
				evt.stopPropagation();
			}

			if (userEvent) {
				$scope.selectedEvent = userEvent;
				$scope.showAddMe = $scope.selectedEvent.user && $scope.selectedEvent.user._id !== $scope.global.user._id && !_.contains(_.pluck($scope.selectedEvent.guest, "_id"), $scope.global.user._id);

				//center map on new event
				if ($scope.selectedEvent.location) {

					$scope.map.center = $scope.selectedEvent.location;
					$scope.marker = {
						id: userEvent._id,
						latitude: userEvent.location.latitude,
						longitude: userEvent.location.longitude,
						showWindow: false,
						title: userEvent.title,
						content: userEvent.content
					};

				}

				$(window).trigger("resize");
			}
		};

		$scope.setPreviousElement = function() {
			var index = (window._.indexOf($scope.agenda, $scope.selectedEvent) - 1 > 0) ? window._.indexOf($scope.agenda, $scope.selectedEvent) - 1 : 0;
			$scope.setSelectedEvent(null, $scope.agenda[index]);
		};

		$scope.setNextElement = function() {
			var index = (window._.indexOf($scope.agenda, $scope.selectedEvent) + 1 < $scope.agenda.length) ? window._.indexOf($scope.agenda, $scope.selectedEvent) + 1 : $scope.agenda.length - 1;
			$scope.setSelectedEvent(null, $scope.agenda[index]);
		};

		$scope.isUserPresent = function(userEvent){
			return _.contains(_.pluck(userEvent.guest, "_id"), $scope.global.user._id);
		};

		$scope.isUserAbsent = function(userEvent){
			return _.contains(_.pluck(userEvent.guestUnavailable, "_id"), $scope.global.user._id);
		};

		$scope.notAddMeToEvent = function(evt, userEvent) {

			if (evt) {
				evt.preventDefault();
				evt.stopPropagation();
			}

			if (!_.contains(_.pluck(userEvent.guestUnavailable, "_id"), $scope.global.user._id) && $scope.global.user._id !== userEvent.user._id) {

				userEvent.guestUnavailable.push({
					_id: $scope.global.user._id
				});

				var ids = _.pluck(userEvent.guest, "_id");
				var indexOfUser = _.indexOf(ids, $scope.global.user._id);

				if (indexOfUser !== -1) {
					userEvent.guest.splice(indexOfUser, 1);
				}

				$scope.agendaCollection.update(userEvent).then(function(newUserEvent) {
					$location.path("/agenda");
				});

			} else {
				$modal.open({
					templateUrl: "js/agenda/views/modal/alreadyHere.html",
					controller: "alreadyHereCtrl"
				});
			}
		};

		$scope.addMeToEvent = function(evt, userEvent) {

			if (evt) {
				evt.preventDefault();
				evt.stopPropagation();
			}

			if (!_.contains(_.pluck(userEvent.guest, "_id"), $scope.global.user._id) && $scope.global.user._id !== userEvent.user._id) {

				userEvent.guest.push({
					_id: $scope.global.user._id
				});

				var ids = _.pluck(userEvent.guestUnavailable, "_id");
				var indexOfUser = _.indexOf(ids, $scope.global.user._id);

				if (indexOfUser !== -1) {
					userEvent.guestUnavailable.splice(indexOfUser, 1);
				}

				$scope.agendaCollection.update(userEvent).then(function(newUserEvent) {
					$location.path("/agenda");
				});
			} else {
				$modal.open({
					templateUrl: "js/agenda/views/modal/alreadyHere.html",
					controller: "alreadyHereCtrl"
				});
			}

		};

		$scope.getFormattedDate = function(date) {
			return $filter("date")(date, "dd MMM yyyy");
		};

		if ($scope.agenda.length > 0) {
			if ($route.current.params.eventId) {
				$scope.setSelectedEvent(null, _.filter($scope.agenda, function(uEvent) {
					return uEvent._id === $route.current.params.eventId;
				})[0]);
			} else {
				$scope.setSelectedEvent(null, $scope.agenda[0]);
			}
		}

		$scope.$parent.menu = {
			title: "Rencards",
			items: [{
				link: "#!/agenda/create",
				info: "Nouvel évènement",
				icon: "fa-plus"
			}]
		};
	}
]);

angular.module("mean.agenda").controller("AgendaDetailController", ["$scope", "Global", "$location", "$modal", "event", "AgendaCollection",

	function($scope, Global, $location, $modal, Event, AgendaCollection) {

		$scope.userEvent = Event;
		$scope.eventTypes = eventTypes;
		$scope.agendaCollection = AgendaCollection;

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
			zoom: 8,
			dragging: true,
			doUgly: true
		};

		$scope.map.center = $scope.userEvent.location;

		$scope.marker = {
			id: $scope.userEvent._id,
			latitude: $scope.userEvent.location.latitude,
			longitude: $scope.userEvent.location.longitude,
			showWindow: false,
			title: $scope.userEvent.title,
			content: $scope.userEvent.content
		};

		$scope.updateMethod = function() {
			return $scope.agendaCollection.update($scope.userEvent);
		};

		$scope.isUserPresent = function(userEvent){
			return userEvent.guest && _.contains(_.pluck(userEvent.guest, "_id"), $scope.global.user._id);
		};

		$scope.isUserAbsent = function(userEvent){
			return userEvent.guestUnavailable && _.contains(_.pluck(userEvent.guestUnavailable, "_id"), $scope.global.user._id);
		};

		$scope.notAddMeToEvent = function(evt) {

			if (evt) {
				evt.preventDefault();
				evt.stopPropagation();
			}

			if (!_.contains(_.pluck($scope.userEvent.guestUnavailable, "_id"), $scope.global.user._id) && $scope.global.user._id !== $scope.userEvent.user._id) {

				$scope.userEvent.guestUnavailable.push({
					_id: $scope.global.user._id
				});

				var ids = _.pluck($scope.userEvent.guest, "_id");
				var indexOfUser = _.indexOf(ids, $scope.global.user._id);

				if (indexOfUser !== -1) {
					$scope.userEvent.guest.splice(indexOfUser, 1);
				}

				$scope.agendaCollection.update($scope.userEvent).then(function(newUserEvent) {
					// Update
					$scope.userEvent = newUserEvent;
				});

			} else {
				$modal.open({
					templateUrl: "js/agenda/views/modal/alreadyHere.html",
					controller: "alreadyHereCtrl"
				});
			}
		};

		$scope.addMeToEvent = function(evt) {

			if (evt) {
				evt.preventDefault();
				evt.stopPropagation();
			}

			if (!_.contains(_.pluck($scope.userEvent.guest, "_id"), $scope.global.user._id) && $scope.global.user._id !== $scope.userEvent.user._id) {

				$scope.userEvent.guest.push({
					_id: $scope.global.user._id
				});

				var ids = _.pluck($scope.userEvent.guestUnavailable, "_id");
				var indexOfUser = _.indexOf(ids, $scope.global.user._id);

				if (indexOfUser !== -1) {
					$scope.userEvent.guestUnavailable.splice(indexOfUser, 1);
				}

				$scope.agendaCollection.update($scope.userEvent).then(function(newUserEvent) {
					//Update
					$scope.userEvent = newUserEvent;
				});
			} else {
				$modal.open({
					templateUrl: "js/agenda/views/modal/alreadyHere.html",
					controller: "alreadyHereCtrl"
				});
			}

		};

		$scope.$parent.menu = {
			title: "Rencards / " + $scope.userEvent.title,
			items: [{
				link: "#!",
				info: "Retour",
				icon: "fa-arrow-left",
				callback: $scope.global.back
			}]
		};
	}
]);

angular.module("mean.agenda").controller("calendarCtrl", ["$scope", "$modalInstance", "Agenda", "EventClick",

	function($scope, $modalInstance, Agenda, EventClick) {

		$scope.agenda = Agenda;

		//Calendar config
		$scope.calendarView = "month";
		$scope.calendarDay = new Date();
		$scope.calendarTitle = "";

		$scope.eventClick = function(evt, userEvent) {

			EventClick(evt, userEvent);
			$scope.cancel();
		};

		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
		};
	}
]);

angular.module("mean.agenda").controller("unknowLocationCtrl", ["$scope", "$modalInstance",

	function($scope, $modalInstance) {

		$scope.ok = function(result) {
			$modalInstance.close(result);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
		};
	}
]);

angular.module("mean.agenda").controller("alreadyHereCtrl", ["$scope", "$modalInstance",

	function($scope, $modalInstance) {

		$scope.ok = function(result) {
			$modalInstance.close(result);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
		};
	}
]);

angular.module("mean.system").controller("noTitleEventModalCtrl", ["$scope", "$modalInstance",
	function($scope, $modalInstance) {
		$scope.ok = function(result) {
			$modalInstance.close(result);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
		};
	}
]);

var EventDetailData = {
	event: function(AgendaCollection, $route) {
		return ($route.current.params.eventId) ? AgendaCollection.findOne($route.current.params.eventId) : null;
	}
};

var EventsData = {
	Agenda: function(AgendaCollection) {
		return AgendaCollection.load();
	}
};

var eventTypes = [{
	identifier: "restaurant",
	name: "Resto",
	image: "img/photos/office2-thumb.jpg"
}, {
	identifier: "holidays",
	name: "Vacances",
	image: "img/photos/office3-thumb.jpg"
}, {
	identifier: "party",
	name: "Soirée",
	image: "img/photos/office6-thumb.jpg"
}, {
	identifier: "weekend",
	name: "Week-end",
	image: "img/photos/office5-thumb.jpg"
}, {
	identifier: "other",
	name: "Autres",
	image: "img/photos/office6-thumb.jpg"
}];