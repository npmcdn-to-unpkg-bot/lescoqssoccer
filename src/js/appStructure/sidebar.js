'use strict';

angular.module('mean.system').service('SideMenu',
	function() {

		var sideMenu = {

			menu: {},
			show: true,
			hasSearch: false,

			setMenu: function(menu){
				sideMenu.menu = menu;
				sideMenu.show = true;
			},

			setSearchInput: function(hasSearch){
				sideMenu.hasSearch = hasSearch;
			},

			hide: function(){
				sideMenu.show = false;
			}
		};

		return sideMenu;

	}
);

angular.module('mean.system').controller('SidebarController', ['$scope', 'Global', '$location', 'SideMenu',

	function($scope, Global, $location, SideMenu) {

		$scope.global = Global;
		$scope.sideMenu = SideMenu;

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

			_.filter($scope.sideMenu.menu.middle, function(link) {
				return link.title === title;
			})[0].callback();

		};
	}
]);