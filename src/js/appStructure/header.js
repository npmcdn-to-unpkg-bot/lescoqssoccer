'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

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