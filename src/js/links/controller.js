'use strict';

angular.module('mean.links').controller('LinkController', ['$scope', 'Global', 'LinksCollection', 'SubMenu',
	function ($scope, Global, LinksCollection, SubMenu) {

		$scope.global = Global;
		$scope.dateFormat = "dd/MM/yyyy 'à' H'h'mm";
		$scope.LinksCollection = LinksCollection;
		$scope.content;

		SubMenu.setMenu({});

		$scope.links = {
			joan: {
				author: "Jo",
				adress: "http://objectifjapon.wordpress.com",
				image: "img/jojo.jpg",
				title: "objectifjapon TKT"
			},
			nico: {
				author: "Nico et Amélie",
				adress: "http://deux-noix-nz.blogspot.fr",
				image: "img/nico.jpg",
				title: "Deux noix au pays des kiwis"
			},
			momo:{
				author: "Momo et Céline",
				adress: "http://bandedemickeysen4l.com/",
				image: "img/momo.jpeg",
				title: "Bande de Mickeys en 4L"
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