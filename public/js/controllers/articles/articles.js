'use strict';

angular.module('mean.articles').controller('ArticlesController', ['$scope', '$routeParams', '$location', 'Global', 'Articles', 'items', 'scroll', function ($scope, $routeParams, $location, Global, Articles, items, scroll) {
    
    $scope.global = Global;
    $scope.items = items;

    $scope.create = function() {
        var article = new Articles({
            title: this.title,
            content: this.content
        });
        article.$save(function(response) {
            $scope.items.getItemsFromDataStore();
        });
    };

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

    $scope.update = function() {
        var article = $scope.article;
        if (!article.updated) {
            article.updated = [];
        }
        article.updated.push(new Date().getTime());

        article.$update(function() {
            $location.path('articles/' + article._id);
        });
    };

    $scope.find = function() {
        Articles.query(function(articles) {
            $scope.articles = articles;
        });
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

    $scope.refresh = function() {
      
    };

    $scope.handleSpace = function() {
      if (!scroll.pageDown()) {
        items.next();
      }
    };

    $scope.$watch('items.selectedIdx', function(newVal) {
      if (newVal !== null) {
        scroll.toCurrent();
        $scope.findOne(items.selected.id);
      }
    });
}]);