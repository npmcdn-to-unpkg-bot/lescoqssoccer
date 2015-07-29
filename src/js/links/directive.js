angular.module('mean.articles').directive('cmPortfolio',
	function() {
		return {
			restrict: 'E',
			transclude: true,
			link: function($scope, element, attrs) {

				jQuery("#filters1").dysaniagrid({
					galleryid: "#gridbox1"
				});

			}
		}
	}
);

angular.module('mean.articles').directive('cmColorbox',
	function() {
		return {
			restrict: 'E',
			transclude: true,
			link: function($scope, element, attrs) {
				setTimeout(function() {
					jQuery(".clb-photo").colorbox({
						maxWidth: '95%',
						maxHeight: '95%',
						photo: true
					});
				}, 500);
			}
		}
	}
);