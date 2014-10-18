'use strict';

angular.module('mean.notifications').controller('NotificationController', ['$scope', 'Global',
	function ($scope, Global) {

		$scope.global = Global;

	}
]);