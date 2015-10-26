'use strict';

angular.module('mean.suggestions').controller('SuggestionController', ['$scope', '$location', 'Global', 'SuggestionsCollection',
	function ($scope, $location, Global, SuggestionsCollection) {

		$scope.global = Global;
		$scope.dateFormat = "dd/MM/yyyy";
		$scope.SuggestionsCollection = SuggestionsCollection;

		$scope.content;
		$scope.SuggestionsCollection.load();

		$scope.add = function (evt) {

			evt.preventDefault();
			evt.stopPropagation();

			if(this.content !== ""){

				var suggestion = {
					content: this.content,
					limitDate: new Date(),
					yes: [],
					no: [],
					blank: []
				};

				$scope.SuggestionsCollection.add(suggestion, function () {
					$scope.content = "";
					$location.path( "/others/suggestions" );
				});
			}
		};

		$scope.vote = function(value){
			console.warn(value);
		};
	}
]);