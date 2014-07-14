'use strict';

//Setting up route
angular.module('mean').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/articles', {
            templateUrl: 'js/articles/views/list.html'
        }).
        when('/articles/create', {
            templateUrl: 'js/articles/views/create.html'
        }).
        when('/articles/:articleId/edit', {
            templateUrl: 'js/articles/views/edit.html'
        }).
        when('/articles/:articleId', {
            templateUrl: 'js/articles/views/view.html'
        }).
        when('/agenda', {
            templateUrl: 'js/agenda/views/agenda.html'
        }).
        when('/profile', {
            templateUrl: 'js/profile/profile.html'
        }).
        when('/externalLink', {
            templateUrl: 'js/links/externalLink.html'
        }).
        when('/gallery', {
            templateUrl: 'js/gallery/gallery.html'
        }).
        when('/suggestions', {
            templateUrl: 'js/suggestions/suggestions.html'
        }).
        when('/home', {
            templateUrl: 'js/appStructure/home.html'
        }).
        when('/', {
            redirectTo: 'home'
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