'use strict';

angular.module('mean.articles').controller('ArticlesDeleteController', ['$scope', '$modalInstance', '$routeParams', '$location', 'Global', 'Articles', 'items', 'scroll', function ($scope, $modalInstance, $routeParams, $location, Global, Articles, items, scroll) {
    
    $scope.global = Global;
    $scope.items = items;

    $scope.remove = function(article) {
        if (article) {
            article.$remove(function(response){
              for (var i in $scope.articles) {
                if ($scope.articles[i] === article) {
                    $scope.articles.splice(i, 1);
                }
              }
              $scope.items.getItemsFromDataStore(true);
            });
        } else {
            $scope.article.$remove();
            $location.path('articles');
        }
    };

    /***
    Modal buttons
    ***/
    $scope.ok = function () {
        this.remove(items.selected.article);
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);