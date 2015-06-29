'use strict';

angular.module('mean.home').controller('HomeController', ['$scope', '$sce', 'Global', 'TopMenu',
	function($scope, $sce, Global, TopMenu) {

		$scope.global = Global;

		$scope.isCurrentPath = function (path) {
			var cur_path = "#!" + $location.path().substr(0, path.length);
			return (cur_path.indexOf(path) !== -1) || (path.indexOf('albums') !== -1 && cur_path.indexOf('gallery') !== -1);
		};

		$scope.menu = [{
			'title': 'home_title',
			'link': 'home',
			'icon': 'human_picto_163.png',
			'class': 'link link--kukuri color-1'
		}, {
			'title': 'Agenda',
			'link': 'agenda',
			'icon': 'Time_left_64.png',
			'class': 'link link--takiri color-2'
		}, {
			'title': '<span>Il</span><span>in</span>',
			'link': 'articles',
			'icon': 'News_over_the_radio_64.png',
			'class': 'link link--ilin color-3'
		}, {
			'title': 'gallery_title',
			'link': 'albums',
			'icon': 'photo229.png',
			'class': 'link link--nukun color-4'
		}, {
			'title': 'link_title',
			'link': 'links',
			'icon': 'Sandals_64.png',
			'class': 'link link--kumya color-5'
		}, {
			'title': 'suggestions_title',
			'link': 'suggestions',
			'icon': 'light bulbs7.png',
			'class': 'link link--yaku color-6'
		}];

		$scope.closeMenu = function(){
			TopMenu.close();
		};

		$scope.getFormattedContent = function(html) {
			console.warn(html);
			return $sce.trustAsHtml(html);
		};
	}
]);