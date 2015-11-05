'use strict';

angular.module('mean.home').controller('HomeController', ['$scope', 'Global', 'Team',
	function($scope, Global, Team) {

		$scope.global = Global;
		$scope.team = Team;

	}
]);