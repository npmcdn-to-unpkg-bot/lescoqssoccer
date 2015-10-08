'use strict';

angular.module('mean.albums').controller('AlbumDetailController', ['$location', '$scope', 'Global', '$modal', 'AlbumService', 'album', 'FileUploader',

	function($location, $scope, Global, $modal, AlbumService, album, FileUploader) {

		$scope.global = Global;
		$scope.album = album;

		$scope.saveAlbum = function(evt) {

			evt.preventDefault();
			evt.stopPropagation();

			if ($scope.album.name !== "" && $scope.album.photoList.length > 0) {

				if (!$scope.album.coverPicPath) {
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

		$scope.back = function() {
			window.location = "#!/albums";
		}

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

angular.module('mean.albums').controller('AlbumsController', ['$scope', 'Global', 'AlbumService', 'albums', 'Page', 'ItemsCount',

	function($scope, Global, AlbumService, albums, Page, ItemsCount) {

		$scope.global = Global;
		$scope.albums = albums;

		$scope.page = parseInt(Page);
		$scope.totalItems = ItemsCount.count;
		$scope.itemsPerPage = AlbumService.itemsPerPage;

		$scope.pageChanged = function(newPage) {
			if (newPage === 1) {
				$location.path("/albums");
			} else {
				$location.path("/albums/" + newPage);
			}
		};

		$scope.selectAlbum = function(albumId) {

			$scope.selectedAlbum = _.filter(albums, function(album) {
				return album._id === albumId;
			})[0];

			$scope.$apply();
		};
	}
]);

angular.module('mean.albums').controller('PhotosController', ['$scope', 'Global', '$location', '$http', '$window', '$modal', 'AlbumService', 'album',

	function($scope, Global, $location, $http, $window, $modal, AlbumService, album) {

		$scope.global = Global;
		$scope.album = album;

		$scope.showSlider = function(evt, currentIndex) {

			evt.preventDefault();
			evt.stopPropagation();

			$scope.showModal = true;

			var modalInstance = $modal.open({
				templateUrl: 'js/gallery/views/photosSlider.html',
				controller: 'PhotosSliderController',
				windowClass: "full-screen",
				resolve: {
					album: function() {
						return $scope.album;
					},
					currentIndex: function() {
						return currentIndex;
					}
				}
			});

			modalInstance.result.then(function() {

				$scope.showModal = false;
				$(window).trigger('resize');

				setTimeout(function(){
					Galleria.get(0).destroy();
				}, 500);

			});
		};

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

		$scope.update = function() {
			$location.path('/albums/edit/' + $scope.album._id);
		}

		$scope.back = function() {
			window.location = "#!/albums";
		}
	}
]);

angular.module('mean.albums').controller('PhotosSliderController', ['$scope', 'Global', '$modalInstance', 'album', 'currentIndex',

	function($scope, Global, $modalInstance, album, currentIndex) {

		$scope.global = Global;
		$scope.album = album;
		$scope.current = currentIndex;

		$scope.cancel = function() {
			$modalInstance.close('cancel');
		};
	}
]);

angular.module('mean.albums').controller('modalInstanceCtrl', ['$scope', '$modalInstance',

	function($scope, $modalInstance) {

		$scope.ok = function(result) {
			$modalInstance.close(result);
		};

		$scope.cancel = function() {
			$(window).trigger('resize');
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

//To Pre-load Album before route change
var AlbumData = {
	album: function(AlbumService, $route) {
		return $route.current.params.albumId ? AlbumService.getAlbum($route.current.params.albumId) : {
			photoList: []
		};
	}
};

var AlbumSliderData = {
	album: function(AlbumService, $route) {
		return $route.current.params.albumId ? AlbumService.getAlbum($route.current.params.albumId) : {
			photoList: []
		};
	},
	currentIndex: function($route) {
		return $route.current.params.currentIndex;
	}
};

var AlbumsData = {
	albums: function(AlbumService, $route, $location) { //return all albums only if URL /albums/* but not /albums/add
		return (RegExp('\/albums').test($location.path()) && $route.current.params.view !== 'add') ? AlbumService.getAllAlbums() : [];
	},
	Page: function($route) {
		return ($route.current.params.page) ? $route.current.params.page : 1;
	},
	ItemsCount: function(AlbumService){
		return AlbumService.getItemsCount();
	}
};