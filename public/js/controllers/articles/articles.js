'use strict';

angular.module('mean.articles').controller('ArticlesController', ['$scope', '$routeParams', '$location', 'Global', 'Articles', 'scroll', '$fileUploader', function ($scope, $routeParams, $location, Global, Articles, scroll, $fileUploader) {
    
    $scope.global = Global;
    $scope.all = [];
    $scope.filtered = [];
    $scope.selected = null;
    $scope.selectedIdx = null;
    $scope.editingArticle = null;
    $scope.readCount = 0;
    $scope.starredCount = 0;
    $scope.onCreation = false;
    $scope.uploaderItem;

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
        Articles.query(function(articles) {      

            $scope.all = [];

            angular.forEach(articles, function(article) {

               $scope.all.push(article);

                $scope.all.sort(function(articleA, articlesB) {
                  return new Date(articlesB.created).getTime() - new Date(articleA.created).getTime();
                });

                $scope.filtered = $scope.all;
                $scope.readCount = $scope.all.reduce(function(count, item) { return item.read ? ++count : count; }, 0);
                $scope.starredCount = $scope.all.reduce(function(count, item) { return item.starred ? ++count : count; }, 0);
                $scope.selected = $scope.selected
                  ? $scope.all.filter(function(item) { return item.id == $scope.selected.id; })[0]
                  : null;
                $scope.reindexSelectedItem();
            });

            if(selectNextElement){
                if($scope.all.length > 0)
                    $scope.prev();
                else
                    $scope.selected = undefined;
            }
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

    $scope.prev = function() {
      if (this.hasPrev()) {
        $scope.selectItem(this.selected ? $scope.selectedIdx - 1 : 0);
      }
    };

    $scope.next = function() {
      if (this.hasNext()) {
        $scope.selectItem($scope.selected ? $scope.selectedIdx + 1 : 0);
      }
    };

    $scope.hasPrev = function() {
      if (!this.selected) {
        return true;
      }
      return this.selectedIdx > 0;
    };

    $scope.hasNext = function() {
      if (!$scope.selected) {
        return true;
      }
      return $scope.selectedIdx < $scope.filtered.length - 1;
    };

    $scope.selectItem = function(idx) {

        // Unselect previous selection.
        if ($scope.selected) {
            $scope.selected.selected = false;
        }

        $scope.selected = $scope.filtered[idx];
        $scope.selectedIdx = idx;
        $scope.selected.selected = true;
        $scope.onCreation = $scope.onEdition = false;
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

    $scope.filterBy = function(key, value) {
      $scope.filtered = $scope.all.filter(function(item) {
        return item[key] === value;
      });
      $scope.reindexSelectedItem();
    };

    $scope.clearFilter = function() {
      this.filtered = this.all;
      this.reindexSelectedItem();
    };

    $scope.reindexSelectedItem = function() {
      if ($scope.selected) {
        var idx = $scope.filtered.indexOf($scope.selected);

        if (idx === -1) {
          if ($scope.selected) $scope.selected.selected = false;

          $scope.selected = null;
          $scope.selectedIdx = null;
        } else {
          $scope.selectedIdx = idx;
          $scope.selected = $scope.filtered[idx];
          $scope.selected.selected = true;
        }
      }
    };

    $scope.refresh = function() {
        $scope.find();
    };

    $scope.handleSpace = function() {
      if (!scroll.pageDown()) {
        $scope.next();
      }
    };

    $scope.$watch('selectedIdx', function(newVal) {
      if (newVal !== null) {
        scroll.toCurrent();
      }
    });

    $scope.find();
}]);





