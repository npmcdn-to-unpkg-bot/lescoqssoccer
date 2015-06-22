'use strict';

angular.module('mean.system').controller('SidebarController', ['$scope', 'Global', '$location',

	function ($scope, Global, $location) {
		$scope.global = Global;

		$scope.isCurrentPath = function (path) {
			var cur_path = "#!" + $location.path().substr(0, path.length);
			return (cur_path.indexOf(path) !== -1) || (path.indexOf('albums') !== -1 && cur_path.indexOf('gallery') !== -1);
		};

		$scope.linkFilter = function(item) {
			return !item.type || item.type === "link";
		};

		$scope.buttonFilter = function(item) {
			return item.type === "button";
		};

		$scope.callback = function(evt, title){

			evt.preventDefault();
			evt.stopPropagation();

			_.filter($scope.menu.middle, function(link){
				return link.title === title;
			})[0].callback();

		};

		setTimeout(function(){
			forkit();
		}, 500);
	}
]);