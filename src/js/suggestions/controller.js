'use strict';

angular.module('mean.suggestions').controller('SuggestionController', ['$scope', '$location', 'Global', 'Suggestions', 'SuggestionsCollection', '$modal',
	function($scope, $location, Global, Suggestions, SuggestionsCollection, $modal) {

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
					$location.path("/suggestions");
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
						if (!suggestion.blank) suggestion.blank = [];
						suggestion.blank.push($scope.global.user._id);
						break;
					case 3:
						if (!suggestion.no) suggestion.no = [];
						suggestion.no.push($scope.global.user._id);
						break;
				}

				SuggestionsCollection.update(suggestion).then(function(suggestion) {
					var modalInstance = $modal.open({
						templateUrl: 'js/suggestions/views/votedModal.html',
						controller: 'votedCtrl'
					});
				});

			} else {

				var modalInstance = $modal.open({
					templateUrl: 'js/suggestions/views/votedModal.html',
					controller: 'votedCtrl'
				});
				
			}

		};

		$scope.getSuggestionAnswerLength = function(suggestion, option) {
			return Math.round(suggestion[option].length / (suggestion.yes.length + suggestion.no.length + suggestion.blank.length) * 100);
		};

		$scope.hasAnswers = function(suggestion) {
			return suggestion.yes.length > 0 || suggestion.no.length > 0 || suggestion.blank.length > 0;
		};
	}
]);

angular.module('mean.suggestions').controller('votedCtrl', ['$scope', '$modalInstance',

	function($scope, $modalInstance) {

		$scope.ok = function(result) {
			$modalInstance.close(result);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}

]);

var SuggestionsData = {

	Suggestions: function(SuggestionsCollection) {
		return SuggestionsCollection.load();
	}

};