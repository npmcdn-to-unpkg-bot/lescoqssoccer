'use strict';

angular.module('mean.suggestions').controller('SuggestionController', ['$scope', '$location', 'Global', 'SuggestionsCollection',
	function ($scope, $location, Global, SuggestionsCollection) {

		$scope.global = Global;
		$scope.dateFormat = "dd/MM/yyyy 'à' H'h'mm";
		$scope.SuggestionsCollection = SuggestionsCollection;
		$scope.content;

		$scope.SuggestionsCollection.load();

		$scope.add = function () {

			if(this.content !== ""){

				var suggestion = {
					content: this.content
				}

				$scope.SuggestionsCollection.add(suggestion, function () {
					$scope.content = "";
					$location.path( "/suggestions" );
				});
			}
		}
	}
]);