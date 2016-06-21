"use strict";

//Suggestions service used for suggestions REST endpoint
angular.module("mean.suggestions").factory("Suggestions", ["$resource",
	function($resource) {
		return $resource("suggestions/:suggestionId", {
			suggestionId: "@_id"
		}, {
			"save": {
				method: "POST"
			},
			"update": {
				method: "PUT",
				params: {
					suggestionId: "@suggestionId"
				}
			},
			"query": {
				method: "GET",
				isArray: true
			}
		});
	}
]);

/**
 * suggestionModel service
 **/
angular.module("mean.suggestions").service("SuggestionsCollection", ["Global", "Suggestions",
	function(Global, Suggestions) {
		var SuggestionsCollection = {

			all: [],
			itemsPerPage: 12,

			load: function(page) {
				return Suggestions.query({
					perPage: SuggestionsCollection.itemsPerPage,
					page: page - 1
				}, function(suggestions) {
					return suggestions;
				}).$promise;
			},

			getAll: function() {
				return Suggestions.query({}, function(suggestions) {
					SuggestionsCollection.all = suggestions;
					return suggestions.length;
				}).$promise;
			},

			findOne: function(suggestionId) {
				return Suggestions.get({
					suggestionId: suggestionId
				}, function(suggestion) {
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

			remove: function(suggestionId) {
				return Suggestions.delete({
					suggestionId: suggestionId
				}, function(data) {
					return data;
				}).$promise;
			}
		}

		return SuggestionsCollection;
	}
]);