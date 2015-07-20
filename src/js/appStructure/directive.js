angular.module('mean.system').directive('cmSidebar',
	function() {
		return {
			restrict: 'E',
			templateUrl: "js/appStructure/sidebar.html",
			transclude: true
		}
	}
);