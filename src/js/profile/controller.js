'use strict';

angular.module('mean.users').controller('ProfileController', ['$scope', 'Global', '$translate','FileUploader',
	function ($scope, Global, $translate, FileUploader) {

		$scope.global = Global;
		$scope.image;
		$scope.uploaderItem;

		$scope.uploader = new FileUploader({
			scope: $scope,
			url: '/upload/photo',
			autoUpload: true,
			formData: [{
				key: 'value'
			}]
		});

		$scope.uploader.onAfterAddingFile = function (item) {
			console.info('After adding a file', item);
			$scope.uploaderItem = item;
		};

		$scope.uploader.onCompleteItem = function (item, response, status, headers) {
			console.info('Complete', item, response);
			$scope.image = response.path;
		};

		$scope.rate = 7;
		$scope.percent = 70;
		$scope.max = 10;

		$scope.hoveringOver = function (value) {
			$scope.overStar = value;
			$scope.percent = 100 * (value / $scope.max);
		};

		$scope.changeLanguage = function (key) {
		    	$translate.use(key);
		};

	}
]);