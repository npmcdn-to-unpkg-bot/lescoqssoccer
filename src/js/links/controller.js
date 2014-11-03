'use strict';

angular.module('mean.links').controller('LinkController', ['$scope', 'Global', 'LinksCollection',
	function ($scope, Global, LinksCollection) {

		$scope.global = Global;
		$scope.dateFormat = "dd/MM/yyyy 'à' H'h'mm";
		$scope.LinksCollection = LinksCollection;
		$scope.content;

		//$scope.LinksCollection.load();
		$scope.links = {
			joan: {
				author: "Jo",
				adress: "http://objectifjapon.wordpress.com"
			},
			nico: {
				author: "Nico",
				adress: "http://deux-noix-nz.blogspot.fr"
			},
			momo:{
				author: "Momo",
				adress: "http://google.fr"
			}
		};

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