'use strict';

angular.module('mean.suggestions').controller('SuggestionController', ['$scope', '$location', 'Global', 'SuggestionsCollection',
	function ($scope, $location, Global, SuggestionsCollection) {

		$scope.global = Global;
		$scope.dateFormat = "dd/MM/yyyy";
		$scope.SuggestionsCollection = SuggestionsCollection;
		$scope.view = ($location.path().substr(1, $location.path().length) === 'suggestions') ? 'suggestions' : 'create';

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

		$scope.$parent.menu = {
			middle: [{
				link: "#!/suggestions/create",
				image: "img/Checklist_paper_sheet_handmade_symbol_64.png",
				tooltip: "Ajouter un postit",
				type: "link"
			}]
		};
	}
]);