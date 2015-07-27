angular.module('mean.articles').directive('cmPortfolio',
	function() {
		return {
			restrict: 'E',
			transclude: true,
			link: function($scope, element, attrs) {

				jQuery("#filters1").dysaniagrid({
					galleryid: "#gridbox1"
				});

				jQuery(".clb-photo").colorbox({
					maxWidth: '95%',
					maxHeight: '95%'
				});

				jQuery(".clb-iframe").colorbox({
					iframe: true,
					width: "80%",
					height: "80%"
				});
			}
		}
	}
);