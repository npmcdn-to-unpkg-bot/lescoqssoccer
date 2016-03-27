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

//Articles service used for get suggestions items count
angular.module('mean.suggestions').factory('SuggestionsCount', ['$resource',
	function($resource) {
		return $resource('suggestionsCount');
	}
]);

/**
 * suggestionModel service
 **/
angular.module('mean.suggestions').service('SuggestionsCollection', ['Global', 'Suggestions', 'SuggestionsCount',
	function(Global, Suggestions, SuggestionsCount) {

		var SuggestionsCollection = {

			all: [],
			itemsPerPage: 12,
			currentPage: 0,

			load: function(page) {

				SuggestionsCollection.currentPage = page;

				return Suggestions.query({
					perPage: SuggestionsCollection.itemsPerPage,
					page: page - 1
				}, function(suggestion) {
					Suggestions.all = suggestion;
					return suggestion;
				}).$promise;
			},

			getItemsCount: function() {
				return SuggestionsCount.get({}, function(result) {
					return result;
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