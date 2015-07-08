'use strict';

angular.module('mean.suggestions').controller('SuggestionController', ['$scope', '$location', 'Global', 'SuggestionsCollection', 'SubMenu',
	function ($scope, $location, Global, SuggestionsCollection, SubMenu) {

		$scope.global = Global;
		$scope.dateFormat = "dd/MM/yyyy";
		$scope.SuggestionsCollection = SuggestionsCollection;

		SubMenu.setMenu({
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