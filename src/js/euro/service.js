'use strict';

angular.module('mean.euro').factory('MatchsCollection', ['$resource',
	function($resource) {

		return $resource('matchs/:id/', {
			id: '@_id'
		}, {
			query: {
				method: 'GET',
				isArray: true
			},
			update: {
				method: 'PUT',
				params: {
					_id: '@_id'
				}
			}
		});

	}
]);

angular.module('mean.euro').service('MatchService', ['MatchsCollection',
	function(MatchsCollection) {

		var MatchService = {

			all: [],

			getMatch: function(id) {
				return MatchsCollection.get({
					id: id
				}, function(match) {
					return match;
				}).$promise;
			},

			load: function() {
				return MatchsCollection.query({}, function(matchs) {
					MatchService.all = matchs;
					return matchs;
				}).$promise;
			},

			getMatchsByUser: function(userId) {
				return MatchsCollection.query({
					userId: userId
				}, function(matchs) {
					return matchs;
				}).$promise;
			},

			saveMatch: function(match) {
				return MatchsCollection.save({}, match, function(data) {
					return data;
				}).$promise;
			},

			updateMatch: function(match) {
				return MatchsCollection.update({
					_id: match._id
				}, match, function(data) {
					return data;
				}).$promise;
			},

			deleteMatch: function(match) {
				return MatchsCollection.delete({}, match, function(data) {
					return data;
				}).$promise;
			}
		};

		return MatchService;
	}
]);