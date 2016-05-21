angular.module('mean.system').controller('ParametersController', ['$scope', 'Global', '$modal', 'Parameters', 'ParametersService',

	function($scope, Global, $modal, Parameters, ParametersService) {

		$scope.global = Global;
		$scope.parameters = Parameters[0];

		$scope.addCategorie = function() {
			if ($scope.newCategorieLabel !== "") {
				$scope.parameters.articleCategories.push({
					id: $scope.parameters.articleCategories.length + 1,
					value: $scope.newCategorieLabel
				});
			}
		};

		$scope.toggleCategory = function(evt, category) {
			if (evt) {
				evt.preventDefault();
				evt.stopPropagation();
			}
			category.active = !category.active;
		};

		$scope.update = function(evt) {
			if (evt) {
				evt.preventDefault();
				evt.stopPropagation();
			}

			ParametersService.update($scope.parameters).then(function(newParams) {
				var modalInstance = $modal.open({
					templateUrl: 'js/parameters/views/saveModal.html',
					controller: 'saveCtrl'
				});
			});
		};

		$scope.$parent.menu = {
			title: "Paramètres",
			items: [{
				link: '#!',
				info: 'Retour',
				icon: 'fa-arrow-left',
				callback: $scope.global.back
			}, {
				link: '#!',
				info: 'Sauvegarder',
				icon: 'fa-save',
				callback: $scope.update
			}]
		};
	}
]);

angular.module('mean.system').controller('issuesCtrl', ['$scope',
	function($scope) {
		$scope.$parent.menu = {
			title: "Bugs",
			items: []
		};
	}
]);

angular.module('mean.system').controller('saveCtrl', ['$scope', '$modalInstance',
	function($scope, $modalInstance) {
		$scope.ok = function(result) {
			$modalInstance.close(result);
		};
	}
]);

var ParametersData = {
	Parameters: function(ParametersService) {
		return ParametersService.load();
	}
};