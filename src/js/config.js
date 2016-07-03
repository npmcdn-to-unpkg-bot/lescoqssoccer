"use strict";

//Setting up route
angular.module("mean").config(["$routeProvider",

	function($routeProvider) {
		$routeProvider.

		/** HOME ****/
		when("/home", {
			templateUrl: "js/home/views/home.html",
			controller: "HomeController",
			resolve: HomeData
		}).

		/** SPECIAL: EURO ****/
		when("/euro", {
			templateUrl: "js/euro/views/teams.html",
			controller: "EuroController",
			resolve: EuroData
		}).
		when("/euro/admin", {
			templateUrl: "js/euro/views/admin.html",
			controller: "AdminMatchController",
			resolve: AdminEuroData
		}).
		when("/euro/view/:matchId", {
			templateUrl: "js/euro/views/match.html",
			controller: "MatchController",
			resolve: MatchData
		}).

		/** AGENDA ****/
		when("/agenda", {
			templateUrl: "js/agenda/views/list.html",
			controller: "ListController",
			resolve: EventsData
		}).
		when("/agenda/view/:eventId", {
			templateUrl: "js/agenda/views/view.html",
			controller: "AgendaDetailController",
			resolve: EventDetailData
		}).
		when("/agenda/create", {
			templateUrl: "js/agenda/views/create.html",
			controller: "CreateAgendaController",
			resolve: EventDetailData
		}).
		when("/agenda/edit/:eventId", {
			templateUrl: "js/agenda/views/create.html",
			controller: "CreateAgendaController",
			resolve: EventDetailData
		}).
		when("/agenda/:eventId", {
			templateUrl: "js/agenda/views/list.html",
			controller: "ListController",
			resolve: EventsData
		}).

		/** ARTICLES ****/
		when("/articles", {
			templateUrl: "js/articles/views/list.html",
			controller: "ArticlesController",
			resolve: ArticlesData
		}).
		when("/articles/create/:view", {
			templateUrl: function(params){
				return (params.view === "standard") ? "js/articles/views/creation/standard.html" : "js/articles/views/creation/others.html";
			},
			controller: "CreateArticleController",
			resolve: ArticleDetailData
		}).
		when("/articles/:page", {
			templateUrl: "js/articles/views/list.html",
			controller: "ArticlesController",
			resolve: ArticlesData
		}).
		when("/articles/view/:view/:id", {
			templateUrl: function(params){
				return "js/articles/views/detail/" + params.view + ".html";
			},
			controller: "ArticleDetailController",
			resolve: ArticleDetailData
		}).
		when("/articles/edit/:view/:id", {
			templateUrl: function(params){
				return (params.view === "standard") ? "js/articles/views/creation/standard.html" : "js/articles/views/creation/others.html";
			},
			controller: "CreateArticleController",
			resolve: ArticleDetailData
		}).

		/** ALBUMS ****/
		when("/albums", {
			templateUrl: "js/albums/views/albums.html",
			controller: "AlbumsController",
			resolve: AlbumsData
		}).
		when("/albums/view/:albumId", {
			templateUrl: "js/albums/views/albumDetail.html",
			controller: "PhotosController",
			resolve: AlbumData
		}).
		when("/albums/create", {
			templateUrl:"js/albums/views/create.html",
			controller: "CreateAlbumController",
			resolve: AlbumData
		}).
		when("/albums/edit/:albumId", {
			templateUrl: "js/albums/views/create.html",
			controller: "CreateAlbumController",
			resolve: AlbumData
		}).
		when("/albums/:page", {
			templateUrl: "js/albums/views/albums.html",
			controller: "AlbumsController",
			resolve: AlbumsData
		}).

		/** SUGGESTIONS ****/
		when("/suggestions", {
			templateUrl: "js/suggestions/views/suggestions.html",
			controller: "SuggestionController",
			resolve: SuggestionsData
		}).
		when("/suggestions/create", {
			templateUrl: "js/suggestions/views/create.html",
			controller: "CreateSuggestionController",
			resolve: SuggestionData
		}).
		when("/suggestions/edit/:id", {
			templateUrl: "js/suggestions/views/create.html",
			controller: "CreateSuggestionController",
			resolve: SuggestionData
		}).
		when("/suggestions/:page", {
			templateUrl: "js/suggestions/views/suggestions.html",
			controller: "SuggestionController",
			resolve: SuggestionsData
		}).

		/** ISSUES ****/
		when("/issues", {
			templateUrl: "js/parameters/views/issues.html",
			controller: "ParametersController",
			resolve: ParametersData
		}).

		/** USERS ****/
		when("/users", {
			templateUrl: "js/users/views/list.html",
			controller: "TeamController",
			resolve: TeamData
		}).
		when("/users/detail/:id", {
			templateUrl: "js/users/views/detail.html",
			controller: "UserDetailController",
			resolve: UserDetailData
		}).
		when("/users/profile", {
			templateUrl: "js/app/profile/views/profile.html",
			controller: "ProfileController",
			resolve: ProfileData
		}).

		/** DEFAULT ****/
		when("/", {
			redirectTo: "home"
		}).
		otherwise({
			redirectTo: "home"
		});
	}
]);

//Setting HTML5 Location Mode
angular.module("mean").config(["$locationProvider",
	function($locationProvider) {
		$locationProvider.hashPrefix("!");
	}
]);

angular.module("mean").config(["$translateProvider",
	function($translateProvider) {

		$translateProvider.useStaticFilesLoader({
			prefix: "translations/translation_",
			suffix: ".json"
		});

		$translateProvider.preferredLanguage("fr");
		moment.locale("fr", {
		    months : "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
		    monthsShort : "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
		    weekdays : "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
		    weekdaysShort : "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
		    weekdaysMin : "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
		    longDateFormat : {
		        LT : "HH:mm",
		        LTS : "HH:mm:ss",
		        L : "DD/MM/YYYY",
		        LL : "D MMMM YYYY",
		        LLL : "D MMMM YYYY LT",
		        LLLL : "dddd D MMMM YYYY LT"
		    },
		    calendar : {
		        sameDay: "[Aujourd'hui à] LT",
		        nextDay: "[Demain à] LT",
		        nextWeek: "dddd [à] LT",
		        lastDay: "[Hier à] LT",
		        lastWeek: "dddd [dernier à] LT",
		        sameElse: "L"
		    },
		    relativeTime : {
		        future : "dans %s",
		        past : "il y a %s",
		        s : "quelques secondes",
		        m : "une minute",
		        mm : "%d minutes",
		        h : "une heure",
		        hh : "%d heures",
		        d : "un jour",
		        dd : "%d jours",
		        M : "un mois",
		        MM : "%d mois",
		        y : "une année",
		        yy : "%d années"
		    },
		    ordinalParse : /\d{1,2}(er|ème)/,
		    ordinal : function (number) {
		        return number + (number === 1 ? "er" : "ème");
		    },
		    meridiemParse: /PD|MD/,
		    isPM: function (input) {
		        return input.charAt(0) === "M";
		    },
		    // in case the meridiem units are not separated around 12, then implement
		    // this function (look at locale/id.js for an example)
		    // meridiemHour : function (hour, meridiem) {
		    //     return /* 0-23 hour, given meridiem token and hour 1-12 */
		    // },
		    meridiem : function (hours, minutes, isLower) {
		        return hours < 12 ? "PD" : "MD";
		    },
		    week : {
		        dow : 1, // Monday is the first day of the week.
		        doy : 4  // The week that contains Jan 4th is the first week of the year.
		    }
		});

	}
]);