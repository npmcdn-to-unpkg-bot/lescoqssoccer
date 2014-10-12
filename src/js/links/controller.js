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
				content: this.content
			}

			$scope.LinksCollection.add(link, function () {
				$scope.content = "";
			});
		}

	}
]);