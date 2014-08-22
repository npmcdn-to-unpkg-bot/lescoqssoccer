'use strict';

angular.module('mean.users').controller('ProfileController', ['$scope', 'Global', 'FileUploader', function ($scope, Global, FileUploader) {

	$scope.global = Global;
    $scope.image;
    $scope.uploaderItem;

    $scope.uploader = new FileUploader({
        scope: $scope,
        url: '/upload/photo',
        autoUpload: true,
        formData: [
            { key: 'value' }
        ]
    });

    $scope.uploader.onAfterAddingFile = function(item) {
        console.info('After adding a file', item);
        $scope.uploaderItem = item;
    };

    $scope.uploader.onCompleteItem = function(item, response, status, headers) {
        console.info('Complete', item, response);
        $scope.image = response.path;
    };
}]);
 