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
		when('/agenda/map', {
			templateUrl: 'js/agenda/views/map.html',
			controller: 'MapController',
			resolve: {
				Agenda: function(AgendaCollection) {
					return AgendaCollection.load();
				}
			}
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
		when('/articles/create', {
			templateUrl: 'js/articles/views/create.html',
			controller: 'CreateArticleController',
			resolve: ArticleDetailData
		}).
		when('/articles/view/:id', {
			templateUrl: 'js/articles/views/single.html',
			controller: 'ArticleDetailController',
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
			templateUrl: 'js/links/views/create.html',
			controller: 'LinkController'
		}).

		/** ALBUMS ****/
		when('/albums', {
			templateUrl: 'js/gallery/views/albums.html',
			controller: 'AlbumsController',
			resolve: PhotoMgrData
		}).
		when('/albums/view/:albumId', {
			templateUrl: 'js/gallery/views/photos.html',
			controller: 'PhotosController',
			resolve: PhotoMgrData
		}).
		when('/albums/create', {
			templateUrl:'js/gallery/views/create.html',
			controller: 'AlbumDetailController',
			resolve: PhotoMgrData
		}).
		when('/albums/edit/:albumId', {
			templateUrl: 'js/gallery/views/create.html',
			controller: 'AlbumDetailController',
			resolve: PhotoMgrData
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

		when('/team', {
			templateUrl: 'js/team/views/list.html',
			controller: 'TeamController',
			resolve: TeamData
		}).

		/** PROFILE ****/
		when('/profile', {
			templateUrl: 'js/team/views/profile.html',
			controller: 'ProfileController'
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