'use strict';
angular.module('mean.home').controller('HomeController', ['$scope', 'Global',
	function($scope, Global) {

		$scope.global = Global;

		$scope.activeItem = "";

		$scope.active = function(item){
			$scope.activeItem = item;
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

	}
]);