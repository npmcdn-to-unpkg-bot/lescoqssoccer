'use strict';

angular.module('mean.articles').controller('ArticlesController', ['$scope', '$routeParams', '$location', 'Global', 'ArticlesCollection', 'scroll', '$fileUploader', function ($scope, $routeParams, $location, Global, ArticlesCollection, scroll, $fileUploader) {
    
    $scope.global = Global;
    $scope.onCreation = false;
    $scope.uploaderItem;
    ArticlesCollection.load();

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

    $scope.create = function() {
      $scope.uploaderItem.upload();

      var article = new Articles({
          title: this.title,
          content: this.content,
          link: this.link
      });
      article.$save(function(response) {
          $scope.find();
      });
    };

    $scope.find = function(selectNextElement) {
        
    };

    $scope.findOne = function(articleId) {
      if(articleId){
          Articles.get({
              articleId: articleId
          }, function(article) {
              $scope.article = article;
          });
      }
    };

    $scope.update = function() {
      if ($scope.editingArticle) {
          $scope.editingArticle.$update(function(response) {
              $scope.filtered[$scope.selectedIdx] = response;
              $scope.selected = response;
              $scope.selected.selected = true;
              $scope.onEdition = false;
              $scope.editingArticle = null;
          });
      } else {
          alert("error");
      }
    };

    $scope.remove = function() {
        if ($scope.selected) {
          $scope.selected.$remove(function(response){
              $scope.find(true);
          });
        } else {
          alert("error");
        }
    };

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

    
}]);





