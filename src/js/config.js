'use strict';

//Setting up route
angular.module('mean').config(['$routeProvider',

	function($routeProvider) {
		$routeProvider.

		/** HOME ****/
		when('/home', {
			templateUrl: 'js/home/home.html',
			controller: 'HomeController',
			resolve: TeamData
		}).

		/** AGENDA ****/
		when('/agenda', {
			templateUrl: 'js/agenda/views/list.html',
			controller: 'ListController',
			resolve: EventsData
		}).
		when('/agenda/view/:eventId', {
			templateUrl: 'js/agenda/views/view.html',
			controller: 'AgendaDetailController',
			resolve: EventDetailData
		}).
		when('/agenda/create', {
			templateUrl: 'js/agenda/views/create.html',
			controller: 'CreateAgendaController',
			resolve: EventDetailData
		}).
		when('/agenda/edit/:eventId', {
			templateUrl: 'js/agenda/views/create.html',
			controller: 'CreateAgendaController',
			resolve: EventDetailData
		}).

		/** ARTICLES ****/
		when('/articles', {
			templateUrl: 'js/articles/views/list.html',
			controller: 'ArticlesController',
			resolve: ArticlesData
		}).
		when('/articles/create/:view', {
			templateUrl: function(params){
				return (params.view === "standard") ? 'js/articles/views/creation/standard.html' : 'js/articles/views/creation/others.html';
			},
			controller: 'CreateArticleController',
			resolve: ArticleDetailData
		}).
		when('/articles/:page', {
			templateUrl: 'js/articles/views/list.html',
			controller: 'ArticlesController',
			resolve: ArticlesData
		}).
		when('/articles/view/:view/:id', {
			templateUrl: function(params){
				return 'js/articles/views/detail/' + params.view + '.html';
			},
			controller: 'ArticleDetailController',
			resolve: ArticleDetailData
		}).
		when('/articles/edit/:view/:id', {
			templateUrl: function(params){
				return (params.view === "standard") ? 'js/articles/views/creation/standard.html' : 'js/articles/views/creation/others.html';
			},
			controller: 'CreateArticleController',
			resolve: ArticleDetailData
		}).

		/** ALBUMS ****/
		when('/albums', {
			templateUrl: 'js/gallery/views/albums.html',
			controller: 'AlbumsController',
			resolve: AlbumsData
		}).
		when('/albums/view/:albumId', {
			templateUrl: 'js/gallery/views/photos.html',
			controller: 'PhotosController',
			resolve: AlbumData
		}).
		when('/albums/create', {
			templateUrl:'js/gallery/views/create.html',
			controller: 'AlbumDetailController',
			resolve: AlbumData
		}).
		when('/albums/edit/:albumId', {
			templateUrl: 'js/gallery/views/create.html',
			controller: 'AlbumDetailController',
			resolve: AlbumData
		}).
		when('/albums:page', {
			templateUrl: 'js/gallery/views/albums.html',
			controller: 'AlbumsController',
			resolve: AlbumsData
		}).

		/** SUGGESTIONS ****/
		when('/others/suggestions', {
			templateUrl: 'js/suggestions/views/suggestions.html',
			controller: 'SuggestionController',
		}).
		when('/others/suggestions/create', {
			templateUrl: 'js/suggestions/views/create.html',
			controller: 'SuggestionController',
		}).
		when('/others/issues', {
			templateUrl: 'js/other/issues.html'
		}).

		/** USERS ****/
		when('/users', {
			templateUrl: 'js/users/views/list.html',
			controller: 'TeamController',
			resolve: TeamData
		}).
		when('/users/detail/:id', {
			templateUrl: 'js/users/views/detail.html',
			controller: 'UserDetailController',
			resolve: UserDetailData
		}).
		when('/users/profile', {
			templateUrl: 'js/users/views/profile.html',
			controller: 'ProfileController',
			resolve: ProfileData
		}).
		when('/users/chat', {
			templateUrl: 'js/users/views/chat.html',
			controller: 'ChatController',
			resolve: TeamData
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