'use strict';

angular.module('mean.agenda').controller('Modal', ['$scope', '$modal', '$log', '$routeParams', '$location', 'Global', function ($scope, $modal, $log, $routeParams, $location, Global) {
    
    $scope.global = Global;

    $scope.open = function (templateUrl, controller) {

        var modalInstance = $modal.open({
          templateUrl: '../../views/' + templateUrl,
          controller: controller
        });
    };
}]);