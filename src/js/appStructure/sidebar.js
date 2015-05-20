'use strict';

angular.module('mean.system').controller('SidebarController', ['$scope', 'Global', '$location',

	function ($scope, Global, $location) {
		$scope.global = Global;

		$scope.isCurrentPath = function (path) {

			var cur_path = "#!" + $location.path().substr(0, path.length);
			return (cur_path.indexOf(path) !== -1);
		};

		$scope.menu = [{
			'title': 'home_title',
			'link': 'home',
			'icon': 'human_picto_163.png'
		}, {
			'title': 'agenda_title',
			'link': 'agenda',
			'icon': 'human_picto_300.png'
		}, {
			'title': 'article_title',
			'link': 'articles',
			'icon': 'human_picto_118.png'
		}, {
			'title': 'link_title',
			'link': 'links',
			'icon': 'human_picto_025.png'
		}, {
			'title': 'gallery_title',
			'link': 'albums/grid',
			'icon': 'human_picto_225.png'
		}, {
			'title': 'suggestions_title',
			'link': 'suggestions',
			'icon': 'human_picto_298.png'
		}];

		$scope.isCollapsed = false;
	}
]);