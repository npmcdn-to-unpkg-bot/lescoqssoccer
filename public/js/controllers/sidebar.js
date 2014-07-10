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
        'title': 'Home',
        'link': 'home',
        'icon': 'fa fa-dashboard'
    },{
        'title': 'Agenda',
        'link': 'agenda',
        'icon': 'fa fa-calendar'
    },{
        'title': 'Articles',
        'link': 'articles',
        'icon': 'fa fa-pencil-square-o'
    },{
        'title': 'Liens',
        'link': 'externalLink',
        'icon': 'fa fa-list'
    },{
        'title': 'Photos',
        'link': 'gallery',
        'icon': 'fa fa-picture-o'
    },{
        'title': 'Suggestions',
        'link': 'suggestions',
        'icon': 'fa fa-font'
    }];

    $scope.isCollapsed = false;
}]);