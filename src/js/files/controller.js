'use strict';

angular.module('mean').controller('FileUploadController',  ['$scope', 'FileUploader',
	function ($scope, FileUploader) {

		// create a uploader with options
		$scope.uploader = new FileUploader({
			scope: $scope,
			url: '/upload/photo',
			autoUpload: true,
			formData: [{
				key: 'value'
			}]
		});

		// REGISTER HANDLERS
		$scope.uploader.onAfteraddingfile = function (event, item) {
			console.info('After adding a file', item);
		};

		$scope.uploader.onWhenaddingfilefailed = function (event, item) {
			console.info('When adding a file failed', item);
		};

		$scope.uploader.onAfteraddingall = function (event, items) {
			console.info('After adding all files', items);
		};

		$scope.uploader.onBeforeupload = function (event, item) {
			console.info('Before upload', item);
		};

		$scope.uploader.onProgress = function (event, item, progress) {
			console.info('Progress: ' + progress, item);
		};

		$scope.uploader.onSuccess = function (event, xhr, item, response) {
			console.info('Success', xhr, item, response);
		};

		$scope.uploader.onCancel = function (event, xhr, item) {
			console.info('Cancel', xhr, item);
		};

		$scope.uploader.onError = function (event, xhr, item, response) {
			console.info('Error', xhr, item, response);
		};

		$scope.uploader.onComplete = function (event, xhr, item, response) {
			console.info('Complete', xhr, item, response);
		};

		$scope.uploader.onProgressall = function (event, progress) {
			console.info('Total progress: ' + progress);
		};

		$scope.uploader.onCompleteall = function (event, items) {
			console.info('Complete all', items);
		};
	}
]);