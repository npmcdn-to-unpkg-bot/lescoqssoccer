angular.module('mean.system').controller('ParametersController', ['$scope', 'Global', 'Parameters', 'ParametersService',

	function($scope, Global, Parameters, ParametersService) {

		$scope.global = Global;
		$scope.parameters = Parameters[0];

		$scope.update = function(){
			ParametersService.update($scope.parameters).then(function(newParams){
				console.warn(newParams);
			});
		};

		$scope.$parent.menu = {
			title: "Paramètres",
			items: [{
				link: '#!',
				info: 'Retour',
				icon: 'fa-arrow-left',
				callback: $scope.global.back
			},
			{
				link: '#!',
				info: 'Sauvegarder',
				icon: 'fa-save',
				callback: $scope.update
			}]
		};
	}
]);

var ParametersData = {
	Parameters: function(ParametersService) {
		return ParametersService.load();
	}
};