'use strict';

angular.module('mean.system').controller('SidebarController', ['$scope', 'Global', '$location', function ($scope, Global, $location) {
    $scope.global = Global;

    $scope.isCurrentPath = function (path) {
        var cur_path = "#!" + $location.path().substr(0, path.length);
        if (cur_path == path) {
            if($location.path().substr(0).length > 1 && path.length == 1)
                return false;
            else
                return true;
        } else {
            return false;
        }
    };

    $scope.menu = [{
        'title': 'Articles',
        'link': 'articles'
    },{
        'title': 'Agenda',
        'link': 'agenda'
    },{
        'title': 'Utilisateurs',
        'link': 'team'
    },{
        'title': 'Autres sites',
        'link': 'externalLink'
    }];

    $scope.isCollapsed = false;
}]);