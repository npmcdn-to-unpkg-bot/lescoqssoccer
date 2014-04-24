angular.module('mean', []).directive('UserEventDirective', ['$scope', '$routeParams', '$location', 'Global', 'UserEvent', function ($scope, $routeParams, $location, Global, UserEvent) {
    return {
      restrict: 'A',
      template: 'views/userEvent.html',
      scope: {
        startDate: '=',
        endDate: '=',
        content: '=',
        title: '=',
        user: '=',
        readonly: '@',
        method: '&'
      },
      link: function (scope, elem, attrs) {

        scope.callback = function() {
          if (scope.readonly && scope.readonly === 'true') {
            return;
          }

          scope.method({
            startDate:startDate,
            endDate: startDate,
            content: content,
            title: title,
            user: user
          )};
      }
    }
  }]);