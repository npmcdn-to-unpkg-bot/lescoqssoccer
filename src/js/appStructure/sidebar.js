'use strict';

angular.module('mean.system').controller('SidebarController', ['$scope', 'Global', '$location',

	function($scope, Global, $location) {

		$scope.global = Global;

		$scope.home = [{
			name: "Accueil",
			id: "home",
			link: "#!/home",
			icon: "home.jpg"
		}];

		$scope.menu1 = [{
			name: "Articles",
			id: "articles",
			link: "#!/articles",
			icon: "articles.jpg"
		}, {
			name: "Rencards",
			link: "#!/agenda",
			id: "agenda",
			icon: "agenda.jpg"
		}, {
			name: "Photos",
			link: "#!/albums",
			id: "albums",
			icon: "articles.jpg"
		},{
			name: "Copaings",
			link: "#!/users",
			id: "users",
			icon: "articles.jpg"
		},{
			name: "Votes",
			id: "suggestions",
			link: "#!/suggestions",
			icon: "suggestions.jpg"
		}];

		$scope.menu2 = [{
			name: "Bugs",
			id: "issues",
			link: "#!/issues",
			icon: "buggs.jpg"
		}];

		$scope.isCurrentPath = function(item) {

			var cur_path = "#!" + $location.path().substr(0, item.id.length + 1);
			return (cur_path.indexOf(item.id) !== -1) || (item.id.indexOf('albums') !== -1 && cur_path.indexOf('gallery') !== -1);

		};

		$scope.closeSidebar = function(evt, item) {

		};
	}
]);