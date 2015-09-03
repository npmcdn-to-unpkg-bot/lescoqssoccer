'use strict';

angular.module('mean.users').directive("teamCarousel", function() {
	return {
		restrict: 'E',
		transclude: false,
		link: function(scope) {
			scope.initCarousel = function(element) {
				$(element).owlCarousel({
					items: 1,
					dots: false,
					navText: ['', ''],
					nav: true,
					loop: true,
					lazyLoad: true,
					responsive: {
						480: {
							items: 3
						},
						640: {
							items: 6
						},
						900: {
							items: 6
						}
					}
				});

				scope.$on('$destroy', function() {
					$(element).data('owlCarousel').trigger('remove.owl.carousel', 0);
				});
			};
		}
	};
}).directive('teamCarouselItem', [function() {
	return {
		restrict: 'A',
		transclude: false,
		link: function(scope, element) {
			// wait for the last item in the ng-repeat then call init
			if (scope.$last) {
				scope.initCarousel(element.parent());
			}
		}
	};
}]);