angular.module('mean.agenda').directive('ngEnter', function() {
	return function(scope, element, attrs) {
		element.bind("keydown keypress", function(event) {
			if (event.which === 13) {
				scope.$apply(function() {
					scope.$eval(attrs.ngEnter);
				});

				event.preventDefault();
			}
		});
	};
});

angular.module('mean.agenda').directive("owlCarousel", function() {
    return {
        restrict: 'E',
        transclude: false,
        link: function (scope) {
            scope.initCarousel = function(element) {
                $(element).owlCarousel({
					items: 1,
					autoplay: false,
					dots: false,
					navText: ['', ''],
					nav: true,
					loop: false,
					lazyLoad: true,
					responsive: {
						480: {
							items: 2
						},
						640: {
							items: 3
						},
						800: {
							items: 4
						}
					}
				});
            };
        }
    };
}).directive('owlCarouselItem', [function() {
    return {
        restrict: 'A',
        transclude: false,
        link: function(scope, element) {
          	// wait for the last item in the ng-repeat then call init
            if(scope.$last) {
                scope.initCarousel(element.parent());
            }
        }
    };
}]);