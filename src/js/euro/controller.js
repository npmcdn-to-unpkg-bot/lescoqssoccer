'use strict';

angular.module('mean.euro').controller('EuroController', ['$scope', '$location', 'Global', 'Teams', 'MatchService', 'Matchs',
	function($scope, $location, Global, Teams, MatchService, Matchs) {

		$scope.global = Global;
		$scope.teams = Teams;
		$scope.matchs = Matchs;

		$scope.selectTeam = function(evt, team) {
			if (evt) {
				evt.preventDefault();
				evt.stopPropagation();
			}
		};

		$scope.selectTeam = function(){

		};

		$scope.updateBet = function(){

		};

		$scope.save = function() {

		};

		$scope.$parent.menu = {
			title: "Euro",
			items: [{
				link: '#!',
				info: 'Retour',
				icon: 'fa-arrow-left',
				callback: $scope.global.back
			}, {
				link: '#!',
				info: 'Sauvegarder',
				icon: 'fa-save',
				callback: $scope.create
			}]
		};
	}
]);

angular.module('mean.euro').controller('MatchController', ['$scope', '$location', 'Global', 'Match', 'MatchService',
	function($scope, $location, Global, Teams, Match, MatchService) {

		$scope.global = Global;
		$scope.match = Match;

		$scope.updateMethod = function() {
			return MatchService.updateMatch($scope.match);
		};

		$scope.$parent.menu = {
			title: "Euro / ",
			items: [{
				link: '#!',
				info: 'Retour',
				icon: 'fa-arrow-left',
				callback: $scope.global.back
			}]
		};
	}
]);

var EuroData = {

	Matchs: function(MatchService){
		return MatchService.load();
	},

	Teams: function() {
		return [{
			"code": "FRA",
			"name": "France"
		}, {
			"code": "ROU",
			"name": "Roumanie"
		}, {
			"code": "ALB",
			"name": "Albanie"
		}, {
			"code": "SUI",
			"name": "Suisse"
		}, {
			"code": "ENG",
			"name": "Angleterre"
		}, {
			"code": "RUS",
			"name": "Russie"
		}, {
			"code": "WAL",
			"name": "Pays de Galles"
		}, {
			"code": "SVK",
			"name": "Slovaquie"
		}, {
			"code": "GER",
			"name": "Allemagne"
		}, {
			"code": "UKR",
			"name": "Ukraine"
		}, {
			"code": "POL",
			"name": "Pologne"
		}, {
			"code": "NIR",
			"name": "Irlande du Nord"
		}, {
			"code": "ESP",
			"name": "Espagne"
		}, {
			"code": "CZE",
			"name": "Republique Tchèque"
		}, {
			"code": "TUR",
			"name": "Turquie"
		}, {
			"code": "CRO",
			"name": "Croatie"
		}, {
			"code": "BEL",
			"name": "Belgique"
		}, {
			"code": "ITA",
			"name": "Italie"
		}, {
			"code": "IRL",
			"name": "République d'Irlande"
		}, {
			"code": "SWE",
			"name": "Suède"
		}, {
			"code": "POR",
			"name": "Portugale"
		}, {
			"code": "ISL",
			"name": "Islande"
		}, {
			"code": "AUT",
			"name": "Autriche"
		}, {
			"code": "HUN",
			"name": "Hongrie"
		}]
	}
};

var MatchData = {
	Match: function($route, MatchService) {
		return MatchService.getMatch($route.current.params.matchId);
	}
};