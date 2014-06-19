angular.module('mean.agenda').directive('wViewevent', function() {

  return {
    restrict: 'E',
    templateUrl: 'views/agenda/view.html'
  }
});

angular.module('mean.agenda').directive('wCreateevent', function() {

  return {
    restrict: 'E',
    templateUrl: 'views/agenda/create.html'
  }
});

angular.module('mean.agenda').directive('wEditevent', function() {

  return {
    restrict: 'E',
    templateUrl: 'views/agenda/edit.html'
  }
});