'use strict';

angular.module('mean.system').controller('EuroController', ['$scope', '$location', 'Global', 'Teams',
	function($scope, $location, Global, Teams) {

		$scope.global = Global;
		$scope.teams = Teams;

		$scope.selectTeam = function(evt, team) {
			if (evt) {
				evt.preventDefault();
				evt.stopPropagation();
			}
		};

		$scope.$parent.menu = {
			title: "Euro",
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