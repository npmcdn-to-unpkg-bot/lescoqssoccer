'use strict';

angular.module('mean.system').controller('SidebarController', ['$scope', 'Global', '$location',

	function ($scope, Global, $location) {
		$scope.global = Global;

		$scope.isCurrentPath = function (path) {

			var cur_path = "#!" + $location.path().substr(0, path.length);
			if (cur_path.indexOf(path) !== -1) {
				return true;
			} else {
				return false;
			}
		};

		$scope.menu = [{
			'title': 'home_title',
			'link': 'home',
			'icon': 'fa fa-dashboard'
		}, {
			'title': 'agenda_title',
			'link': 'agenda',
			'icon': 'fa fa-calendar'
		}, {
			'title': 'article_title',
			'link': 'articles',
			'icon': 'fa fa-pencil-square-o'
		}, {
			'title': 'link_title',
			'link': 'links',
			'icon': 'fa fa-list'
		}, {
			'title': 'gallery_title',
			'link': 'albums/grid',
			'icon': 'fa fa-picture-o'
		}, {
			'title': 'suggestions_title',
			'link': 'suggestions',
			'icon': 'fa fa-font'
		}];

		$scope.isCollapsed = false;
	}
]);