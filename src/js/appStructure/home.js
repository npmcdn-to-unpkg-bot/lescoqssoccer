'use strict';

angular.module('mean.home').controller('HomeController', ['$scope', 'Global',
	function($scope, Global, $location) {

		$scope.global = Global;

	}
]);