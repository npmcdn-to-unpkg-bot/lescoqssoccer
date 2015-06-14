'use strict';

//Setting up route
angular.module('mean').config(['$routeProvider',

	function($routeProvider) {
		$routeProvider.

		/** HOME ****/
		when('/home', {
			templateUrl: 'js/appStructure/home.html',
			controller: 'HomeController',
		}).

		/** AGENDA ****/
		when('/agenda', {
			templateUrl: 'js/agenda/views/list.html',
			controller: 'CalendarController',
			resolve: {
				Agenda: function(AgendaCollection) {
					return AgendaCollection.load();
				}
			}
		}).
		when('/agenda/:view', {
			templateUrl: function(params) {
				return (params.view === 'create') ? 'js/agenda/views/create.html' : 'js/agenda/views/map.html'
			}
		}).
		when('/agenda/:view/:startDate', {
			templateUrl: 'js/agenda/views/create.html'
		}).

		/** ARTICLES ****/
		when('/articles', {
			templateUrl: 'js/articles/views/list.html',
			controller: 'ArticlesController',
			resolve: {
				Articles: function(ArticlesCollection) {
					return ArticlesCollection.load();
				}
			}
		}).
		when('/articles/create', {
			templateUrl: 'js/articles/views/create.html',
			controller: 'CreateArticleController',
			resolve: ArticleDetailData
		}).
		when('/articles/edit/:articleId', {
			templateUrl: 'js/articles/views/create.html',
			controller: 'CreateArticleController',
			resolve: ArticleDetailData
		}).

		/** LINKS ****/
		when('/links', {
			templateUrl: 'js/links/views/links.html',
			controller: 'LinkController'
		}).
		when('/links/create', {
			templateUrl: 'js/links/views/create.html'
		}).

		/** ALBUMS ****/
		when('/albums', {
			templateUrl: 'js/gallery/views/albums.html',
			controller: 'GalleryCtrl',
			resolve: PhotoMgrData
		}).
		when('/albums/:view', {
			templateUrl: function(params) {
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

		/** SUGGESTIONS ****/
		when('/suggestions', {
			templateUrl: 'js/suggestions/views/suggestions.html'
		}).
		when('/suggestions/create', {
			templateUrl: 'js/suggestions/views/create.html'
		}).

		/** PROFILE ****/
		when('/profile', {
			templateUrl: 'js/profile/profile.html'
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
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

angular.module('mean').config(['$translateProvider',
	function($translateProvider) {

		$translateProvider.useStaticFilesLoader({
			prefix: 'translations/translation_',
			suffix: '.json'
		});

		$translateProvider.preferredLanguage('fr');
	}
]);