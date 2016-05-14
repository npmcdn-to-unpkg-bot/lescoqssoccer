'use strict';

angular.module('mean.albums').controller('AlbumDetailController', ['$location', '$scope', 'Global', '$modal', 'AlbumService', 'album', 'FileUploader',

	function($location, $scope, Global, $modal, AlbumService, album, FileUploader) {

		$scope.global = Global;
		$scope.album = album;

		$scope.saveAlbum = function(evt) {

			evt.preventDefault();
			evt.stopPropagation();

			if ($scope.album.name && $scope.album.name !== "" && $scope.album.photoList.length > 0) {
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

			$scope.uploader.onCompleteAll = function(event, items) {
				console.info('Complete all', items);

				$(window).trigger('resize');
				modalInstance.dismiss('cancel');
			};
		};

		$scope.deletePhoto = function(removedPhoto) {
			$scope.album.photoList.splice(window._.indexOf($scope.album.photoList, removedPhoto), 1);
		};

		$scope.hideInfo = function() {
			$scope.showInfo = false;
		};

		$scope.$parent.menu = {
			title: "Nouvel album",
			items: [{
				link: '#!',
				info: 'Retour',
				icon: 'fa-arrow-left',
				callback: $scope.global.back
			}, {
				link: '#!',
				info: 'Sauvegarder',
				icon: 'fa-save',
				callback: $scope.saveAlbum
			}]
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

		$scope.$parent.menu = {
			title: "Albums",
			items: [{
				link: '#!/albums/create',
				info: 'Nouvel album',
				icon: 'fa-plus'
			}]
		};
	}
]);

angular.module('mean.albums').controller('PhotosController', ['$scope', 'Global', '$location', '$http', '$window', '$modal', 'AlbumService', 'album', 'UserService',

	function($scope, Global, $location, $http, $window, $modal, AlbumService, album, UserService) {

		$scope.global = Global;
		$scope.album = album;

		//set album like read
		UserService.addReadAlbum($scope.album._id);

		$scope.edit = function() {
			$location.path('/albums/edit/' + $scope.album._id);
		};

		$scope.remove = function(evt) {

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

		$scope.showUserDetail = function(evt, user) {

			evt.preventDefault();
			evt.stopPropagation();

			$modal.open({
				templateUrl: 'js/users/views/modal/userDetail.html',
				controller: 'UserDetailController',
				windowClass: 'userDetailPopup',
				resolve: {

					User: function(UserService) {
						return UserService.findOne(user._id);
					},

					Albums: function(AlbumService) {
						return AlbumService.getAlbumsByUser(user._id).then(function(albums) {
							return albums;
						});
					},

					UserArticles: function(ArticlesCollection) {
						return ArticlesCollection.getArticlesByUser(user._id).then(function(articles) {
							return articles;
						});
					},

				}
			});
		};

		$scope.backToList = function(evt) {
			evt.preventDefault();
			evt.stopPropagation();

			$location.path("/albums").replace();
		};

		$scope.showPrevious = function(evt) {
			evt.preventDefault();
			evt.stopPropagation();

			var previous = AlbumService.getPrevious($scope.album);
			$location.path("/albums/view/" + previous._id).replace();
		};

		$scope.showNext = function(evt) {
			evt.preventDefault();
			evt.stopPropagation();

			var next = AlbumService.getNext($scope.album);
			$location.path("/albums/view/" + next._id).replace();
		};

		$scope.updateMethod = function() {
			return AlbumService.updateAlbum($scope.album);
		};

		$scope.$watch('album.comments', function(newValue, oldValue) {
			collage()
		});

		angular.element($window).bind('resize', function() {
			collage();
		});

		$scope.$parent.menu = {
			title: "Albums > " + $scope.album.name,
			items: [{
				link: '#!',
				info: 'Editer',
				icon: 'fa-edit',
				callback: $scope.edit
			}, {
				link: '#!',
				info: 'Supprimer',
				icon: 'fa-times',
				callback: $scope.remove
			}, {
				link: '#!',
				info: 'Précédent',
				icon: 'fa-arrow-left',
				callback: $scope.showPrevious
			}, {
				link: '#!',
				info: 'Retour à la liste',
				icon: 'fa-list',
				callback: $scope.backToList
			}, {
				link: '#!',
				info: 'Suivant',
				icon: 'fa-arrow-right',
				callback: $scope.showNext
			}, {
				link: '#!',
				info: 'Télécharger',
				icon: 'fa-download',
				callback: $scope.download
			}]
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

var AlbumsData = {
	albums: function(AlbumService, $route, $location) { //return all albums only if URL /albums/* but not /albums/add
		return (RegExp('\/albums').test($location.path()) && $route.current.params.view !== 'add') ? AlbumService.getAllAlbums() : [];
	},
	Page: function($route) {
		return ($route.current.params.page) ? $route.current.params.page : 1;
	},
	ItemsCount: function(AlbumService) {
		return AlbumService.getItemsCount();
	}
};