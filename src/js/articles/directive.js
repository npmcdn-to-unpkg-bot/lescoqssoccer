
angular.module('mean.articles').directive('wViewarticle', function() {

  return {
    restrict: 'E',
    templateUrl: 'views/articles/view.html'
  }
});

angular.module('mean.articles').directive('wCreatearticle', function() {

  return {
    restrict: 'E',
    templateUrl: 'views/articles/create.html'
  }
});

angular.module('mean.articles').directive('wEditarticle', function() {

  return {
    restrict: 'E',
    templateUrl: 'views/articles/edit.html'
  }
});