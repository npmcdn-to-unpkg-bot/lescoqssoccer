'use strict';

angular.module('mean.home').controller('HomeController', ['$scope', 'Global', '$location', 'TopMenu',
	function($scope, Global, $location, TopMenu) {

		console.warn(Global.user);
		$scope.global = Global;
		$scope.date = new Date();
		$scope.dateFormat = "dd MMM yyyy";

		$scope.caption = "Hola senor! Ça y est le site tant désiré (ou pas) est là, j'ai essayé de faire quelque chose assez simple pour que même les plus mauvais d'entre vous (et la concurrence est rude) s'en sorte, alors maintenant à vous pour le contenu, ça donne!!!!";

		$scope.isCurrentPath = function(path) {
			var cur_path = "#!" + $location.path().substr(0, path.length + 1);
			return (cur_path.indexOf(path) !== -1) || (path.indexOf('albums') !== -1 && cur_path.indexOf('gallery') !== -1);
		};

		$scope.closeMenu = function(){
			TopMenu.close();
		};

		$scope.type = function() {
			if($scope.captionLength < $scope.caption.length){
				$('#caption').html($scope.caption.substr(0, $scope.captionLength++));
				setTimeout($scope.type, 70);
			} else {
				setTimeout(function(){
					$(".menu_cadonne").show();
				}, 70);
			}
		};

		if($scope.isCurrentPath('home')){
			setTimeout(function(){
				$scope.captionLength = 0;
				$scope.type();
			}, 700);
		} else {
			setTimeout(function(){
				$('#caption').html($scope.caption);
				$(".menu_cadonne").show();
			}, 700);
		}
	}
]);