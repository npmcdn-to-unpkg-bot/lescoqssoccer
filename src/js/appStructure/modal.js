'use strict';

angular.module('mean.agenda').controller('Modal', ['$scope', '$modal', '$log', '$routeParams', '$location', 'Global', function ($scope, $modal, $log, $routeParams, $location, Global) {
    
    $scope.global = Global;

    $scope.open = function (templateUrl, title, content, callback) {

        var modalInstance = $modal.open({
          templateUrl: '../../views/' + templateUrl,
          controller: 'ModalInstanceController'	,
          resolve:{
			      title:function(){
          		return title;
          	},
          	content: function(){
          		return content;
          	},
          	callback: function(){
          		return callback;
          	}
          }
        });
    };
}]);

angular.module('mean.agenda').controller('ModalInstanceController', ['$scope', '$modalInstance', 'title', 'content', 'callback', function ($scope, $modalInstance, title, content, callback) {
    
    $scope.title = title;
    $scope.content = content;

    /***
    Modal buttons
    ***/
    $scope.ok = function () {
        callback.call();
        $modalInstance.close();
    };

    $scope.cancel = function () {	
        $modalInstance.close();
    };
}]);