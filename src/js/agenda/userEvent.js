'use strict';

angular.module('mean.agenda').controller('UserEventController', ['$scope', '$modalInstance', '$routeParams', '$location', 'Global', 'UserEvent',
	function ($scope, $modalInstance, $routeParams, $location, Global, UserEvent) {
		$scope.global = Global;
		$scope.userEvents = [];

		$scope.create = function (userEvent) {

			var userEvent = new UserEvent({
				title: this.title,
				content: this.content,
				start: this.start,
				end: this.end
				//  , community: this.community,
				// location: this.location
			});
			userEvent.$save(function (response) {
				$scope.userEvents.push(response.userEvent);
			});
		};

		$scope.remove = function (userEvent) {
			if (userEvent) {
				userEvent.$remove();

				for (var i in $scope.userEvents) {
					if ($scope.userEvents[i] === userEvent) {
						$scope.userEvents.splice(i, 1);
					}
				}
			} else {
				$scope.userEvents.$remove();
				$location.path('userEvent');
			}
		};

		$scope.update = function (userEvent) {
			if (userEvent) {

				for (var i in $scope.userEvents) {
					if ($scope.userEvents[i].uuid === userEvent.uuid) {
						$scope.userEvents[i] = userEvent;
					}
				}

				userEvent.$update(function () {
					$location.path('userEvent/' + userEvent._id);
				});
			}
		};

		$scope.find = function () {
			UserEvent.query(function (userEvent) {
				$scope.userEvents = userEvent;
			});
		};

		$scope.findOne = function () {
			UserEvent.get({
				userEventId: $routeParams.userEventId
			}, function (userEvent) {
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
			$modalInstance.close();
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
			var self = this;
			if (this.search && this.search.length > 0) {
				if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
				this.geocoder.geocode({
					'address': this.search
				}, function (results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						var loc = results[0].geometry.location;
						self.search = results[0].formatted_address;
						self.gotoLocation(loc.lat(), loc.lng());
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
				$scope.map.center = {
					latitude: lat,
					longitude: lon
				};
				if (!$scope.$$phase) $scope.$apply("loc");
			}
		};


		var tabClasses;

		function initTabs() {
			tabClasses = ["", "", "", ""];
		}

		$scope.getTabClass = function (tabNum) {
			return tabClasses[tabNum];
		};

		$scope.getTabPaneClass = function (tabNum) {
			return "tab-pane " + tabClasses[tabNum];
		}

		$scope.setActiveTab = function (tabNum) {
			initTabs();
			tabClasses[tabNum] = "active";
		};

		$scope.tab1 = "This is FIRST section: Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
		$scope.tab2 = "This is SECOND section: Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
		$scope.tab3 = "This is THIRD section: Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem.  Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
		$scope.tab4 = "This is FOURTH section: Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";

		//Initialize 
		initTabs();
		$scope.setActiveTab(1);
	}
]);