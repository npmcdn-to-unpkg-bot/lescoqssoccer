'use strict';

angular.module('mean.system').controller('SidebarController', ['$scope', 'Global', '$location',
	
	function ($scope, Global, $location) {
		$scope.global = Global;

		$scope.isCurrentPath = function (path) {
			var cur_path = "#!" + $location.path().substr(0, path.length);
			if (cur_path == path) {
				if ($location.path().substr(0).length > 1 && path.length == 1)
					return false;
				else
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
			'link': 'externalLink',
			'icon': 'fa fa-list'
		}, {
			'title': 'gallery_title',
			'link': 'gallery',
			'icon': 'fa fa-picture-o'
		}, {
			'title': 'suggestions_title',
			'link': 'suggestions',
			'icon': 'fa fa-font'
		}];

		$scope.isCollapsed = false;
	}
]);