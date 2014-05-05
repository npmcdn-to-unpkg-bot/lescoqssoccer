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
            templateUrl: 'views/agenda.html'
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

angular.module('mean').config(['$translateProvider', function($translateProvider) {
    
    $translateProvider.useStaticFilesLoader({
      prefix: 'translations/translation_',
      suffix: '.json'
    });

    $translateProvider.preferredLanguage('fr');
}]);