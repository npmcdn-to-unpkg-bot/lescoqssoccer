'use strict';

angular.module('mean.articles').controller('FileUploadController', ['$scope', 'FileUploader',
	function ($scope, FileUploader) {

		// create a uploader with options
		$scope.uploader = new FileUploader({
			scope: $scope,
			url: '/upload/photo',
			formData: [{
				key: 'value'
			}],
			filters: [

				function (item) {
					console.info('filter1');
					return true;
				}
			]
		});

		// FAQ #1
		var item = {
			file: {
				name: 'Previously uploaded file',
				size: 1e6
			},
			progress: 100,
			isUploaded: true,
			isSuccess: true
		};

		item.remove = function () {
			uploader.removeFromQueue(this);
		};

		$scope.uploader.queue.push(item);
		$scope.uploader.progress = 100;

		// ADDING FILTERS
		$scope.uploader.filters.push(function (item) { // second user filter
			console.info('filter2');
			return true;
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