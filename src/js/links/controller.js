'use strict';

angular.module('mean.links').controller('LinkController', ['$scope', 'Global', 'LinksCollection',
	function ($scope, Global, LinksCollection) {

		$scope.global = Global;
		$scope.dateFormat = "dd/MM/yyyy 'à' H'h'mm";
		$scope.LinksCollection = LinksCollection;
		$scope.content;

		$scope.LinksCollection.load();

		$scope.add = function () {

			var link = {
				title: this.title,
				content: this.content,
				url: this.url
			}

			$scope.LinksCollection.add(link, function () {
				$scope.content = "";
			});
		}

	}
]);