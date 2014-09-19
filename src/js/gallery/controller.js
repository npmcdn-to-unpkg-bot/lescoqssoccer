'use strict';

angular.module('mean.gallery').controller('GalleryController', ['$scope', 'Global', function ($scope, Global) {

	$scope.global = Global;
	$scope.slides = [
        {
            src : "img/9036958611_fa1bb7f827_m.jpg",
            text: "Image 1"
        },
        {
            src : "img/9041440555_2175b32078_m.jpg",
            text: "Image 2"
        },
        {
            src : "img/8985207189_01ea27882d_m.jpg",
            text: "Image 2"
        },
        {
            src : "img/8962691008_7f489395c9_m.jpg",
            text: "Image 3"
        }
    ];

    // initializing the time Interval
    $scope.myInterval = 5000;
}]);
 