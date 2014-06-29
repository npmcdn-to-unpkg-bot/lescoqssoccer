'use strict';

//Setting up route
angular.module('mean').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/articles', {
            templateUrl: 'views/articles/list.html'
        }).
        when('/articles/create', {
            templateUrl: 'views/articles/create.html'
        }).
        when('/articles/:articleId/edit', {
            templateUrl: 'views/articles/edit.html'
        }).
        when('/articles/:articleId', {
            templateUrl: 'views/articles/view.html'
        }).
        when('/agenda', {
            templateUrl: 'views/agenda/agenda.html'
        }).
        when('/team', {
            templateUrl: 'views/team/team.html'
        }).
        when('/profile', {
            templateUrl: 'views/profile.html'
        }).
        when('/externalLink', {
            templateUrl: 'views/externalLink.html'
        }).
        when('/home', {
            templateUrl: 'views/home.html'
        }).
        when('/charts_xcharts', {
            templateUrl: 'views/devoops/charts_xcharts.html'
        }).
        when('/charts_flot', {
            templateUrl: 'views/devoops/charts_flot.html'
        }).
        when('/charts_google', {
            templateUrl: 'views/devoops/charts_google.html'
        }).
        when('/charts_morris', {
            templateUrl: 'views/devoops/charts_morris.html'
        }).
        when('/charts_coindesk', {
            templateUrl: 'views/devoops/charts_coindesk.html'
        }).
        when('/tables_simple', {
            templateUrl: 'views/devoops/tables_simple.html'
        }).
        when('/tables_datatables', {
            templateUrl: 'views/devoops/tables_datatables.html'
        }).
        when('/tables_beauty', {
            templateUrl: 'views/devoops/tables_beauty.html'
        }).
        when('/forms_elements', {
            templateUrl: 'views/devoops/forms_elements.html'
        }).
        when('/forms_layouts', {
            templateUrl: 'views/devoops/forms_layouts.html'
        }).
        when('/forms_file_uploader', {
            templateUrl: 'views/devoops/forms_file_uploader.html'
        }).
        when('/', {
            redirectTo: 'articles'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);