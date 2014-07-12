'use strict';

angular.module('mean.articles').controller('ArticlesController', ['$scope', '$routeParams', '$location', 'Global', 'ArticlesCollection', 'scroll', '$fileUploader', function ($scope, $routeParams, $location, Global, ArticlesCollection, scroll, $fileUploader) {
    
    $scope.global = Global;
    $scope.onCreation = false;
    $scope.uploaderItem;
    $scope.ArticlesCollection = ArticlesCollection;

    $scope.dateFormat = "dd/MM/yyyy 'à' H'h'mm";
    $scope.uploader = $fileUploader.create({
        scope: $scope,
        url: '/upload/photo',
        formData: [
            { key: 'value' }
        ],
        filters: [
            function (item) {
                console.info('filter1');
                return true;
            }
        ]
    });

    $scope.uploader.bind('afteraddingfile', function (event, item) {
        console.info('After adding a file', item);
        $scope.uploaderItem = item;
    });

    $scope.uploader.bind('complete', function (event, xhr, item, response) {
        console.info('Complete', xhr, item, response);
    });

    $scope.showCreationForm = function() {
      if($scope.selected) $scope.selected.selected = false;
      $scope.onCreation = true;
      $scope.onEdition = false;
    };

    $scope.showEditionForm = function() {
      $scope.editingArticle = _.clone($scope.selected);
      $scope.onEdition = true;
      $scope.onCreation = false;
    };

    $scope.ArticlesCollection.load();

    $scope.totalItems = 64;
    $scope.currentPage = 4;

    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
      console.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.maxSize = 5;
    $scope.bigTotalItems = 175;
    $scope.bigCurrentPage = 1;
}]);





