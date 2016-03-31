'use strict';

angular.module('mean.system').controller( 'LoginController', ['$scope', '$http', 'Global',
	 function($scope, $http, Global){

		$scope.submit = function($form) {

			$(".login_inner, .login_inner__avatar").animate({
				'opacity': '0'
			}, 500);

			setTimeout(function() {
				$(".login_inner__check").css({
					'opacity': '1',
					'animation': 'spinner 2s 0s linear',
					'transition': 'all ease 3s'
				});
			});

			setTimeout(function() {

				$http({
					method: 'POST',
					url: '/users/isFutureSessionValid',
					data: {
			            email : $scope.email,
			            password : $scope.password
			        }
				}).then(function successCallback(response) {
					
					if(response.data.authenticate){
						
						var icon = $(".login_inner__check").addClass('loginSucess').find('i:first');
						icon.css('display', 'inline').animate({
							'opacity': '1'
						}, 500);

						setTimeout(function(){
							$('form').submit();
						}, 600);

					} else{

						var icon = $(".login_inner__check").addClass('loginError').find('i:last');
						icon.css('display', 'inline').animate({
							'opacity': '1'
						}, 500);

						switch(response.data.info.message){
							case "Invalid password": 
								$scope.errorMessage = "Mot de passe invalide";
								break;
							case "Unknown user": 
								$scope.errorMessage = "Utilisateur inconnu";
								break;
							default: 
								$scope.errorMessage = "Pas marché...";
								break;
						}
					}
							
				}, function errorCallback(response) {

					$scope.errorMessage = "Pas marché...";

					var icon = $(".login_inner__check").addClass('loginError').find('i:last');
						icon.css('display', 'inline').animate({
						'opacity': '1'
					}, 500);

				});

			}, 1000);
		};

		$scope.showLogin = function(){
			$(".login_inner__check").css('opacity', '0');
			$(".login_inner, .login_inner__avatar").css('opacity','1');
			$scope.errorMessage = null;
		};
	}
] );