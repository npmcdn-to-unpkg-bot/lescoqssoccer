'use strict';

angular.module('mean.system').controller('SidebarController', ['$scope', 'Global', '$location',

	function($scope, Global, $location) {

		$scope.global = Global;

		$scope.menu = [{
			name: "ACCUEIL",
			link: "#!/home",
			id: 'home'
		}, {
			name: "ARTICLES",
			id: 'articles',
			link: "#!/articles"
		}, {
			name: "AGENDA",
			link: "#!/agenda",
			id: 'agenda'
		}, {
			name: "PHOTOS",
			link: "#!/albums",
			id: 'albums'
		}, {
			name: "L'EQUIPE",
			link: "#!/users",
			id: 'users'
		}, {
			name: "AUTRES",
			id: 'suggestions',
			children: [{
				name: "Suggestions",
				link: "#!/suggestions",
			}, {
				name: "Bugs",
				link: "#!/issues",
			}]
		}];

		$scope.isCurrentPath = function(item) {

			var cur_path = "#!" + $location.path().substr(0, item.id.length + 1);
			return (cur_path.indexOf(item.id) !== -1) || (item.id.indexOf('albums') !== -1 && cur_path.indexOf('gallery') !== -1);
		};

	}
]);