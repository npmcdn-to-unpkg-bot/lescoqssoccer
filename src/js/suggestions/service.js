'use strict';

//Suggestions service used for suggestions REST endpoint
angular.module('mean.suggestions').factory('Suggestions', ['$resource',
	function($resource) {
		return $resource('suggestions/:suggestionId', {
			suggestionId: '@_id'
		}, {
			'save': {
				method: 'POST'
			},
			'update': {
				method: 'PUT',
				params: {
					suggestionId: '@suggestionId'
				}
			},
			'query': {
				method: 'GET',
				isArray: true
			}
		});
	}
]);

/**
 * suggestionModel service
 **/
angular.module('mean.suggestions').service('SuggestionsCollection', ['Global', 'Suggestions',
	function(Global, Suggestions) {

		var SuggestionsCollection = {

			all: [],
			itemsPerPage: 12,
			currentPage: 0,

			load: function() {
				return Suggestions.query({
					perPage: Suggestions.itemsPerPage
				}, function(suggestion) {
					Suggestions.all = suggestion;
					return suggestion;
				}).$promise;
			},

			add: function(suggestion) {
				return Suggestions.save({}, suggestion, function(data) {
					return data;
				}).$promise;
			},

			update: function(suggestion) {
				return Suggestions.update({
					suggestionId: suggestion._id
				}, suggestion, function(data) {
					return data;
				}).$promise;
			},

			remove: function(suggestion) {
				return Suggestions.delete({}, suggestion, function(data) {
					return data;
				}).$promise;
			}
		}

		return SuggestionsCollection;
	}
]);