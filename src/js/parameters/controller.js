"use strict";

angular.module("mean.system").controller("ParametersController", ["$scope", "Global", "Parameters", "ParametersService",

	function($scope, Global, Parameters, ParametersService) {

		$scope.global = Global;
		$scope.parameters = Parameters[0];

		$scope.addCategorie = function() {
			if ($scope.newCategorieLabel !== "") {
				$scope.parameters.articleCategories.push({
					id: $scope.parameters.articleCategories.length + 1,
					value: $scope.newCategorieLabel
				});

				ParametersService.update($scope.parameters);
			}
		};

		$scope.toggleCategory = function(evt, category) {
			if (evt) {
				evt.preventDefault();
				evt.stopPropagation();
			}
			category.active = !category.active;

			ParametersService.update($scope.parameters);
		};

		$scope.$parent.menu = {
			title: "Paramètres",
			items: [{
				link: "#!",
				info: "Retour",
				icon: "fa-arrow-left",
				callback: $scope.global.back
			}]
		};
	}
]);

var ParametersData = {
	Parameters: function(ParametersService) {
		return ParametersService.load();
	}
};