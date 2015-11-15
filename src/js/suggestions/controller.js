'use strict';

angular.module('mean.suggestions').controller('SuggestionController', ['$scope', '$location', 'Global', 'Suggestions', 'SuggestionsCollection',
	function($scope, $location, Global, Suggestions, SuggestionsCollection) {

		$scope.global = Global;
		$scope.suggestions = Suggestions;

		$scope.create = function(evt) {

			evt.preventDefault();
			evt.stopPropagation();

			if ($scope.content !== "") {

				var suggestion = {
					content: $scope.content,
					yes: [],
					no: [],
					blank: []
				};

				SuggestionsCollection.add(suggestion).then(function() {
					$scope.content = "";
					$location.path("/others/suggestions");
				});
			}
		};

		$scope.vote = function(suggestion, value) {

			var voted = _.contains(_.union(suggestion.yes, suggestion.no, suggestion.blank), $scope.global.user._id);

			if (!voted) {
				switch (value) {
					case 1:
						if (!suggestion.yes) suggestion.yes = [];
						suggestion.yes.push($scope.global.user._id);
						break;
					case 2:
						if (!suggestion.no) suggestion.no = [];
						suggestion.no.push($scope.global.user._id);
						break;
					case 3:
						if (!suggestion.blank) suggestion.blank = [];
						suggestion.blank.push($scope.global.user._id);
						break;
				}

				SuggestionsCollection.update(suggestion).then(function(suggestion) {
					console.warn('update')
				});
			}

		};

		$scope.getSuggestionAnswerLength = function(suggestion, option) {
			return suggestion[option].length / (suggestion.yes.length + suggestion.no.length + suggestion.blank.length) * 100;
		};

		$scope.hasAnswers = function(suggestion) {
			return suggestion.yes.length > 0 || suggestion.no.length > 0 || suggestion.blank.length > 0;
		};
	}
]);

var SuggestionsData = {

	Suggestions: function(SuggestionsCollection) {
		return SuggestionsCollection.load();
	}

};