'use strict';

angular.module('mean.agenda').controller('Modal', ['$scope', '$modal', '$log', '$routeParams', '$location', 'Global', function ($scope, $modal, $log, $routeParams, $location, Global) {
    
    $scope.global = Global;

    $scope.open = function (templateUrl, title, content, callback, param) {

        var modalInstance = $modal.open({
          templateUrl: '../../js/' + templateUrl,
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
          	},
            param: function(){
              return param;
            }
          }
        });
    };
}]);

angular.module('mean.agenda').controller('ModalInstanceController', ['$scope', '$modalInstance', 'title', 'content', 'callback', 'param', function ($scope, $modalInstance, title, content, callback, param) {
    
    $scope.title = title;
    $scope.content = content;
    $scope.param = param;

    /***
    Modal buttons
    ***/
    $scope.ok = function () {
        callback(param);
        $modalInstance.close();
    };

    $scope.cancel = function () {	
        $modalInstance.close();
    };
}]);