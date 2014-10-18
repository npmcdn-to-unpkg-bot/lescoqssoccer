'use strict';

//Suggestions service used for suggestions REST endpoint
angular.module('mean.suggestions').factory('Suggestions', ['$resource',
	function ($resource) {
		return $resource('suggestions/:suggestionId', {
			suggestionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

/**
 * suggestionModel service
 **/
angular.module('mean.suggestions').service('SuggestionsCollection', ['Global', 'Suggestions',
	function (Global, Suggestions) {

		var global = Global;
		var SuggestionsCollection = {

			all: [],
			filtered: [],
			selected: null,
			selectedIdx: null,
			readCount: 0,
			starredCount: 0,

			load: function () {

				Suggestions.query(function (suggestions) {

					SuggestionsCollection.all = [];
					angular.forEach(suggestions, function (suggestion) {

						SuggestionsCollection.all.push(suggestion);
						SuggestionsCollection.all.sort(function (suggestionA, suggestionB) {
							return new Date(suggestionB.created).getTime() - new Date(suggestionA.created).getTime();
						});

						SuggestionsCollection.filtered = SuggestionsCollection.all;
						SuggestionsCollection.readCount = SuggestionsCollection.all.reduce(function (count, suggestion) {
							return suggestion.read ? count : count;
						}, 0);
						SuggestionsCollection.starredCount = SuggestionsCollection.all.reduce(function (count, suggestion) {
							return suggestion.starred ? count : count;
						}, 0);
						SuggestionsCollection.selected = SuggestionsCollection.selected ? SuggestionsCollection.all.filter(function (suggestion) {
							return suggestion.id == SuggestionsCollection.selected.id;
						})[0] : null;
					});
				});
			},

			add: function (suggestion, callback) {

				var suggestionModel = new Suggestions(suggestion);

				suggestionModel.$save(function (response) {
					SuggestionsCollection.load();
					callback.call();
				});
			},

			update: function (index, callback) {

				if (index) {
					SuggestionsCollection.filtered[index].$update(function (response) {
						SuggestionsCollection.filtered[index] = response;

						if (callback)
							callback.call();
					});
				} else {
					if (callback)
						callback.call();
				}
			},

			remove: function (index, callback) {
				if (index) {
					$scope.filtered[index].$remove(function (response) {
						if (callback)
							callback.call();
					});
				} else {
					if (callback)
						callback.call();
				}
			}
		}

		return SuggestionsCollection;
	}
]);