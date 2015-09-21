'use strict';

angular.module('mean.system').controller('SidebarController', ['$scope', 'Global', '$location',

	function($scope, Global, $location) {

		$scope.global = Global;

		$scope.menu = [{
			name: "Accueil",
			link: "#!/home",
			id: 'home'
		}, {
			name: "Blog",
			link: "#!/articles",
			id: 'articles'
		}, {
			name: "Agenda",
			link: "#!/agenda",
			id: 'agenda'
			// children: [{
			// 	name: "Planning",
			// 	link: "#!/agenda",
			// }, {
			// 	name: "Carte",
			// 	link: "#!/agenda/map",
			// }]
		}, {
			name: "Photos",
			link: "#!/albums",
			id: 'albums'
		}, {
			name: "Liens",
			link: "#!/links",
			id: 'links'
		}, {
			name: "Suggestions",
			link: "#!/suggestions",
			id: 'suggestions'
		}, {
			name: "Team",
			link: "#!/team",
			id: 'team'
		}];

		$scope.isCurrentPath = function(item) {

			if (item.children) {
				return false;
			}

			var cur_path = "#!" + $location.path().substr(0, item.link.length + 1);
			return (cur_path.indexOf(item.link) !== -1) || (item.link.indexOf('albums') !== -1 && cur_path.indexOf('gallery') !== -1);
		};

	}
]);