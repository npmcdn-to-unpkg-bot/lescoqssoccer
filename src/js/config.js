'use strict';

//Setting up route
angular.module('mean').config(['$routeProvider',

	function ($routeProvider) {
		$routeProvider.

		/** HOME ****/
		when('/home', {
			templateUrl: 'js/appStructure/home.html'
		}).

		/** AGENDA ****/
		when('/agenda', {
			templateUrl: 'js/agenda/views/agenda.html'
		}).
		when('/agenda/:view', {
			templateUrl: function (params) {
				return (params.view === 'add') ? 'js/agenda/views/create.html' : 'js/agenda/views/map.html'
			}
		}).

		/** ARTICLES ****/
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

		/** LINKS ****/
		when('/externalLink', {
			templateUrl: 'js/links/externalLink.html'
		}).

		/** ALBUMS ****/
		when('/albums', {
			templateUrl: 'js/gallery/views/albums.html',
			controller: 'AlbumCtrl',
			resolve: PhotoMgrData
		}).
		when('/albums/:view', {
			templateUrl: function (params) {
				return (params.view === 'add') ? 'js/gallery/views/album-detail.html' : 'js/gallery/views/albums.html'
			},
			controller: 'AlbumCtrl',
			resolve: PhotoMgrData
		}).
		when('/albums/:view/:albumId', {
			templateUrl: 'js/gallery/views/album-detail.html',
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

		/** SUGGESTIONS ****/
		when('/suggestions', {
			templateUrl: 'js/suggestions/suggestions.html'
		}).

		/** PROFILE ****/
		when('/profile', {
			templateUrl: 'js/profile/profile.html'
		}).

		/** NOTIFICATIONS ****/
		when('/notifications', {
			templateUrl: 'js/notifications/notifications.html'
		}).

		/** DEFAULT ****/
		when('/', {
			redirectTo: 'home'
		}).
		otherwise({
			redirectTo: 'home'
		});
	}
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
	function ($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

angular.module('mean').config(['$translateProvider',
	function ($translateProvider) {

		$translateProvider.useStaticFilesLoader({
			prefix: 'translations/translation_',
			suffix: '.json'
		});

		$translateProvider.preferredLanguage('fr');
	}
]);