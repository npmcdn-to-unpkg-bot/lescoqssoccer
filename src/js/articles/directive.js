
angular.module('mean.articles').directive('wViewarticle', function() {

  return {
    restrict: 'E',
    templateUrl: 'js/articles/views/view.html'
  }
});

angular.module('mean.articles').directive('wCreatearticle', function() {

  return {
    restrict: 'E',
    templateUrl: 'js/articles/views/create.html'
  }
});

angular.module('mean.articles').directive('wEditarticle', function() {

  return {
    restrict: 'E',
    templateUrl: 'js/articles/views/edit.html'
  }
});