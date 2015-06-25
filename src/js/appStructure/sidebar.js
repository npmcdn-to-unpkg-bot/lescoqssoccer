'use strict';

angular.module('mean.system').controller('SidebarController', ['$scope', 'Global', '$location', 'TopMenu', 'SubMenu',

	function($scope, Global, $location, TopMenu, SubMenu) {

		$scope.global = Global;
		$scope.subMenu = SubMenu;

		$scope.isCurrentPath = function(path) {
			var cur_path = "#!" + $location.path().substr(0, path.length + 1);
			return (cur_path.indexOf(path) !== -1) || (path.indexOf('albums') !== -1 && cur_path.indexOf('gallery') !== -1);
		};

		$scope.linkFilter = function(item) {
			return !item.type || item.type === "link";
		};

		$scope.buttonFilter = function(item) {
			return item.type === "button";
		};

		$scope.callback = function(evt, title) {

			evt.preventDefault();
			evt.stopPropagation();

			_.filter($scope.subMenu.menu.middle, function(link) {
				return link.title === title;
			})[0].callback();

		};

		setTimeout(function() {
			TopMenu.initialize();
		}, 500);

	}
]);