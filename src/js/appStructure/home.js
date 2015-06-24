'use strict';

angular.module('mean.home').controller('HomeController', ['$scope', 'Global', 'TopMenu',
	function($scope, Global, TopMenu) {

		$scope.global = Global;

		$scope.isCurrentPath = function (path) {
			var cur_path = "#!" + $location.path().substr(0, path.length);
			return (cur_path.indexOf(path) !== -1) || (path.indexOf('albums') !== -1 && cur_path.indexOf('gallery') !== -1);
		};

		$scope.menu = [{
			'title': 'home_title',
			'link': 'home',
			'icon': 'human_picto_163.png'
		}, {
			'title': 'agenda_title',
			'link': 'agenda',
			'icon': 'Time_left_64.png'
		}, {
			'title': 'article_title',
			'link': 'articles',
			'icon': 'News_over_the_radio_64.png'
		}, {
			'title': 'gallery_title',
			'link': 'albums',
			'icon': 'photo229.png'
		}, {
			'title': 'link_title',
			'link': 'links',
			'icon': 'Sandals_64.png'
		}, {
			'title': 'suggestions_title',
			'link': 'suggestions',
			'icon': 'light bulbs7.png'
		}];

		$scope.closeMenu = function(){
			TopMenu.close();
		};
	}
]);