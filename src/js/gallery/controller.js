'use strict';

angular.module('mean.albums').controller('AlbumDetailController', ['$location', '$scope', 'Global', '$modal', 'AlbumService', 'album', 'FileUploader',

	function($location, $scope, Global, $modal, AlbumService, album, FileUploader) {

		$scope.global = Global;
		$scope.album = album;

		$scope.saveAlbum = function(evt) {

			evt.preventDefault();
			evt.stopPropagation();

			if($scope.album.photoList.length > 0){

				if(!$scope.album.coverPicPath){
					$scope.album.coverPicPath = $scope.album.photoList[0].filepath;
				}

				if ($scope.album._id) {
					AlbumService.updateAlbum($scope.album).then(function(data) {
						$location.path('/albums/view/' + data._id);
					});
				} else {
					AlbumService.saveAlbum($scope.album).then(function(data) {
						$location.path('/albums/view/' + data._id);
					});
				}

			} else {

				$scope.showInfo = true;

			}
		};

		$scope.uploadFiles = function() {

			var modalInstance = $modal.open({
				templateUrl: 'js/files/fileUpload.html',
				controller: 'modalInstanceCtrl',
				scope: $scope
			});

			// create a uploader with options
			$scope.uploader = new FileUploader({
				scope: $scope,
				url: '/upload/photo',
				autoUpload: true,
				formData: [{
					key: 'value'
				}]
			});

			$scope.uploader.onCompleteItem = function(item, response, status, headers) {
				console.info('Complete', item, response);

				$scope.album.photoList.push({
					id: $scope.global.guid(),
					filepath: response.path,
					name: response.name
				});

			};
		};

		$scope.deletePhoto = function(removedPhoto) {
			$scope.album.photoList.splice(window._.indexOf($scope.album.photoList, removedPhoto), 1);
		};

		$scope.hideInfo = function() {
			$scope.showInfo = false;
		};
	}
]);

angular.module('mean.albums').controller('AlbumsController', ['$scope', 'Global', '$http', '$window', '$modal', 'albums',

	function($scope, Global, $http, $window, $modal, albums) {

		$scope.global = Global;
		$scope.albums = albums;

	}
]);

angular.module('mean.albums').controller('PhotosController', ['$scope', 'Global', '$location', '$http', '$window', '$modal', 'AlbumService', 'album',

	function($scope, Global, $location, $http, $window, $modal, AlbumService, album) {

		$scope.global = Global;
		$scope.album = album;

		$scope.deleteAlbum = function(evt) {

			evt.preventDefault();
			evt.stopPropagation();

			var modalInstance = $modal.open({
				templateUrl: 'js/gallery/views/modal/deleteAlbumModal.html',
				controller: 'deleteAlbumModalCtrl',
				resolve: {
					album: function() {
						return $scope.album;
					}
				}
			});

			modalInstance.result.then(function() {

				// Delete the album and either update album list or redirect to it
				AlbumService.deleteAlbum($scope.album).then(function() {
					$location.path('/albums');
				});

			});

		};

		$scope.download = function(evt) {

			evt.preventDefault();
			evt.stopPropagation();

			$http.post('/download/' + $scope.album._id).success(function(data) {
				if (data.success) {
					$window.open('/file/' + $scope.album._id, "_blank");
				}
			}).error(function(data) {
				// Handle Error
			});
		};
	}
]);

//To Pre-load Album & Photo data before route change
var PhotoMgrData = {

	album: function(AlbumsCollection, $route) {
		return $route.current.params.albumId ? AlbumsCollection.get({
			id: $route.current.params.albumId
		}).$promise : {photoList: []};
	},

	albums: function(AlbumsCollection, $route, $location) { //return all albums only if URL /albums/* but not /albums/add
		if (RegExp('\/albums').test($location.path()) && $route.current.params.view !== 'add') {
			return AlbumsCollection.query().$promise;
		} else {
			return [];
		}
	}
};

angular.module('mean.albums').controller('modalInstanceCtrl', ['$scope', '$modalInstance',

	function($scope, $modalInstance) {

		$scope.ok = function(result) {
			$modalInstance.close(result);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}
]);

angular.module('mean.albums').controller('deleteAlbumModalCtrl', ['$scope', '$modalInstance', 'album',

	function($scope, $modalInstance, album) {

		$scope.album = album;

		$scope.ok = function(result) {
			$modalInstance.close(result);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}
]);