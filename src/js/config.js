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
        /** PHOTOS ****/
        when('/photos', {
            templateUrl: 'js/gallery/views/photos.html',
            controller: 'PhotoCtrl', 
            resolve: PhotoMgrData
        }).
        when('/photos/:view', {
            //templateUrl: 'tpl/photos.html',
            templateUrl: function(params){ 
                return (params.view === 'add') ? 'js/gallery/views/photo-detail.html': 'js/gallery/views/photos.html'
            },
            controller: 'PhotoCtrl', 
            resolve: PhotoMgrData
        }).         
        when('/photos/:view/:photoId', {
            templateUrl: 'js/gallery/views/photo-detail.html',
            controller: 'PhotoCtrl', 
            resolve: PhotoMgrData
        }).

        /** ALBUMS ****/
        when('/albums', {
            templateUrl:'js/gallery/views/albums.html',
            controller: 'AlbumCtrl', 
            resolve: PhotoMgrData
        }).
    
        when('/albums/:view', {
            templateUrl: function(params){ 
                return (params.view === 'add') ? 'js/gallery/views/album-detail.html': 'js/gallery/views/albums.html'
            },
            controller: 'AlbumCtrl', 
            resolve: PhotoMgrData
        }).
        when('/albums/:view/:albumId', {
            templateUrl:'js/gallery/views/album-detail.html',
            controller: 'AlbumCtrl', 
            resolve: PhotoMgrData
        }).

        /** GALLERY ****/
        when('/gallery', {
            templateUrl: 'js/gallery/views/gallery.html', 
            controller: 'GalleryCtrl', 
            resolve: GalleryData
        }).
        when('/gallery/:albumId', {
            templateUrl: 'js/gallery/views/gallery.html', 
            controller: 'GalleryCtrl', 
            resolve: PhotoMgrData
        }). 
        when('/suggestions', {
            templateUrl: 'js/suggestions/suggestions.html'
        }).
        when('/notifications', {
            templateUrl: 'js/notifications/notifications.html'
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

angular.module('mean').config(['$translateProvider', function($translateProvider) {

    $translateProvider.useStaticFilesLoader({
      prefix: 'translations/translation_',
      suffix: '.json'
    });

    $translateProvider.preferredLanguage('fr');
}]);