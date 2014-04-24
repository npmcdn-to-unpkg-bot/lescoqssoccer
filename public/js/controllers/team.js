'use strict';

angular.module('mean.team').controller('TeamController', ['$scope', '$routeParams', '$location', 'Global', function ($scope, $routeParams, $location, Global) {
    
    $scope.global = Global;
   
    $scope.initialize = function() {
		$("#owl-demo").owlCarousel({
		    items : 3,
		    lazyLoad : true,
		    autoPlay : true,
		    navigation : true,
		    navigationText : ["",""],
		    rewindNav : false,
		    scrollPerPage : false,
		    pagination : true,
			paginationNumbers: false,
		});
	};

	$scope.users = [
		{'name' : 'Hong Kong Macau' , 'surname' : 'Bonus Extras!', 'avatar': 'images/1.jpg'},
		{'name' : 'Hong Kong Macau' , 'surname' : 'Bonus Extras!', 'avatar': 'images/2.jpg'},
		{'name' : 'Hong Kong Macau' , 'surname' : 'Bonus Extras!', 'avatar': 'images/3.jpg'},
		{'name' : 'Hong Kong Macau' , 'surname' : 'Bonus Extras!', 'avatar': 'images/4.jpg'},
		{'name' : 'Hong Kong Macau' , 'surname' : 'Bonus Extras!', 'avatar': 'images/5.jpg'},
		{'name' : 'Hong Kong Macau' , 'surname' : 'Bonus Extras!', 'avatar': 'images/6.jpg'}
	];

	setTimeout(function(){
		$scope.initialize();
	});
}]);