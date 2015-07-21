'use strict';

angular.module('mean.suggestions').controller('SuggestionController', ['$scope', '$location', 'Global', 'SuggestionsCollection', 'SideMenu',
	function ($scope, $location, Global, SuggestionsCollection, SideMenu) {

		$scope.global = Global;
		$scope.dateFormat = "dd/MM/yyyy";
		$scope.SuggestionsCollection = SuggestionsCollection;

		SideMenu.hasSearch(false);
		SideMenu.setMenu({
			middle: [{
				link: "#!/suggestions/create",
				image: "img/Draw_Adding_Cross_64.png",
				tooltip: "C'est plus!!",
				type: "link"
			}]
		});

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