'use strict';

angular.module('mean.suggestions').controller('SuggestionController', ['$scope', 'Global', 'SuggestionsCollection',
	function ($scope, Global, SuggestionsCollection) {

		$scope.global = Global;
		$scope.dateFormat = "dd/MM/yyyy 'à' H'h'mm";
		$scope.SuggestionsCollection = SuggestionsCollection;
		$scope.content;

		$scope.SuggestionsCollection.load();

		$scope.add = function () {

			var suggestion = {
				content: this.content
			}

			$scope.SuggestionsCollection.add(suggestion, function () {
				$scope.content = "";
			});
		}

	}
]);