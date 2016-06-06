'use strict';

angular.module('mean.euro').controller('EuroController', ['$scope', '$location', 'Global', '$modal', 'Teams', 'MatchService', 'Matchs', 'UserService',
	function($scope, $location, Global, $modal, Teams, MatchService, Matchs, UserService) {

		$scope.global = Global;
		$scope.teams = Teams;
		$scope.matchs = Matchs;

		$scope.getTeamName = function(code) {
			return _.findWhere($scope.teams, {
				code: code
			}).name;
		};

		$scope.selectTeam = function(evt, team) {
			if (evt) {
				evt.preventDefault();
				evt.stopPropagation();
			}

			$scope.global.user.favoriteEuroTeam = team.code;
			UserService.update($scope.global.user).then(function(user) {
				$scope.global.user = user;
			});
		};

		$scope.getBet = function(match) {
			var _bet = {
				homeScore: 0,
				awayScore: 0,
				empty: true
			};
			_.each(match.bets, function(bet) {
				if (bet.user === $scope.global.user._id || bet.user._id === $scope.global.user._id) {
					_bet = bet;
					_bet.empty = false;
				}
			});
			return _bet;
		};

		$scope.updateBet = function(evt, match) {
			if (evt) {
				evt.preventDefault();
				evt.stopPropagation();
			}

			var hasBet = false;
			_.each(match.bets, function(bet) {
				if (bet.user._id === $scope.global.user._id) {
					bet.homeScore = $("#" + match._id + "_home").val();
					bet.awayScore = $("#" + match._id + "_away").val();
					bet.user = $scope.global.user._id;
					hasBet = true;
				}
			});

			if (!hasBet) {
				match.bets.push({
					homeScore: $("#" + match._id + "_home").val(),
					awayScore: $("#" + match._id + "_away").val(),
					user: $scope.global.user._id
				});
			}

			MatchService.updateMatch(match).then(function() {
				var modalInstance = $modal.open({
					templateUrl: 'js/euro/views/betModal.html',
					controller: 'betCtrl',
					scope: $scope
				});
			});
		};

		$scope.isBetAuthorize = function(match) {
			return moment(match.startsAt).isAfter(new Date());
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

angular.module('mean.euro').controller('MatchController', ['$scope', '$location', 'Global', 'Teams', 'Match', 'MatchService',
	function($scope, $location, Global, Teams, Match, MatchService) {

		$scope.global = Global;
		$scope.match = Match;
		$scope.teams = Teams;

		$scope.getTeamName = function(code) {
			return _.findWhere($scope.teams, {
				code: code
			}).name;
		};

		$scope.updateMethod = function() {
			return MatchService.updateMatch($scope.match);
		};

		$scope.title = $scope.getTeamName($scope.match.home) + " - " + $scope.getTeamName($scope.match.away);
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

angular.module('mean.euro').controller('AdminMatchController', ['$scope', '$location', 'Global', '$modal', 'Teams', 'Matchs', 'MatchService',
	function($scope, $location, Global, $modal, Teams, Matchs, MatchService) {

		$scope.global = Global;
		$scope.matchs = Matchs;
		$scope.teams = Teams;

		$scope.getTeamName = function(code) {
			return _.findWhere($scope.teams, {
				code: code
			}).name;
		};

		$scope.updateScore = function(evt, match) {
			if (evt) {
				evt.preventDefault();
				evt.stopPropagation();
			}

			match.scoreHome = $("#" + match._id + "_home").val();
			match.scoreAway = $("#" + match._id + "_away").val();
			MatchService.updateMatch(match).then(function() {
				var modalInstance = $modal.open({
					templateUrl: 'js/euro/views/scoreUpdatedModal.html',
					controller: 'betCtrl',
					scope: $scope
				});
			});
		};

		$scope.$parent.menu = {
			title: "Euro scores",
			items: [{
				link: '#!',
				info: 'Retour',
				icon: 'fa-arrow-left',
				callback: $scope.global.back
			}]
		};
	}
]);

angular.module('mean.suggestions').controller('betCtrl', ['$scope', '$modalInstance',

	function($scope, $modalInstance) {

		$scope.ok = function(result) {
			$modalInstance.close(result);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}

]);

var EuroData = {
	Matchs: function(MatchService) {
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

var AdminEuroData = {
	Matchs: function(MatchService) {
		return MatchService.load();
		// return MatchService.getEndedMatchs();
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