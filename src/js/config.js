'use strict';

//Setting up route
angular.module('mean').config(['$routeProvider',

	function($routeProvider) {
		$routeProvider.

		/** HOME ****/
		when('/home', {
			templateUrl: 'js/appStructure/home.html',
			controller: 'HomeController'
		}).

		/** AGENDA ****/
		when('/agenda', {
			templateUrl: 'js/agenda/views/list.html',
			controller: 'ListController',
			resolve: {
				Agenda: function(AgendaCollection) {
					return AgendaCollection.load();
				}
			}
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
			resolve: {
				Articles: function(ArticlesCollection) {
					return ArticlesCollection.load(1);
				},
				Page: function() {
					return 1;
				},
				ItemsCount: function(ArticlesCollection){
					return ArticlesCollection.getItemsCount();
				}
			}
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
			resolve: {
				Articles: function(ArticlesCollection, $route) {
					return ArticlesCollection.load($route.current.params.page);
				},
				Page: function($route) {
					return $route.current.params.page;
				},
				ItemsCount: function(ArticlesCollection){
					return ArticlesCollection.getItemsCount();
				}
			}
		}).
		when('/articles/view/:view/:id', {
			templateUrl: 'js/articles/views/detail/standard.html',
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

		/** LINKS ****/
		when('/links', {
			templateUrl: 'js/links/views/links.html',
			controller: 'LinkController',
			resolve: {
				Links: function(LinksCollection, $route) {
					return LinksCollection.load();
				}
			}
		}).
		when('/links/create', {
			templateUrl: 'js/links/views/create.html',
			controller: 'CreateLinkController'
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
		when('/suggestions', {
			templateUrl: 'js/suggestions/views/suggestions.html',
			controller: 'SuggestionController',
		}).
		when('/suggestions/create', {
			templateUrl: 'js/suggestions/views/create.html',
			controller: 'SuggestionController',
		}).
		when('/issues', {
			templateUrl: 'js/other/issues.html'
		}).

		when('/team', {
			templateUrl: 'js/users/views/list.html',
			controller: 'TeamController',
			resolve: TeamData
		}).

		/** PROFILE ****/
		when('/profile', {
			templateUrl: 'js/users/views/profile.html',
			controller: 'ProfileController',
			resolve: ProfileData
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