'use strict';

angular.module('mean.system').controller( 'LoginController', ['$scope', '$http', 'Global',
	 function($scope, $http, Global){

	 	$scope.isValid;
	 	$scope.showSignin = true;

		$scope.signin = function($form) {

			$scope.showSignin = false;

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

						$scope.isValid = true;
						
						setTimeout(function(){
							$('form').submit();
						}, 1000);

					} else{

						$scope.isValid = false;

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

					setTimeout(function() {
						$(".login_inner__check").css({
							'animation': 'spinner 2s 0s linear',
							'transition': 'all ease 3s'
						});
					});

					$(".login_inner__check").find('i').css('display', 'inline').animate({
						'opacity': '1'
					}, 500);
							
				}, function errorCallback(response) {

					$scope.isValid = false;
					$scope.errorMessage = "Pas marché...";

					$(".login_inner__check").find('i').css('display', 'inline').animate({
						'opacity': '1'
					}, 500);

				});

			}, 1000);
		};

		$scope.signup = function(){

		};

		$scope.showLogin = function(){
			$scope.showSignin = true;
			$scope.errorMessage = null;
			$scope.isValid = null;
		};

		$scope.showSignup = function(){
			$scope.showSignin = true;
			$scope.errorMessage = null;
			$scope.isValid = null;
		};
	}
] );