'use strict';

angular.module('mean.albums').factory('PhotosCollection', ['$resource',
	function ($resource) {

		return $resource('photos/:id/', {
			id: '@_id'
		}, {
			query: {
				method: 'GET',
				isArray: true
			},
			uploadPhoto: {
				method: 'POST',
				url: '/upload',
				headers: {
					'Content-Type': undefined
				},
				transformRequest: angular.identity
			}
		});

	}
]);

angular.module('mean.albums').factory('AlbumsCollection', ['$resource',
	function ($resource) {

		return $resource('albums/:id/', {
			id: '@_id'
		}, {
			query: {
				method: 'GET',
				isArray: true
			},
			getPhotos: {
				method: 'GET',
				isArray: true,
				url: '/gallery/:id/'
			},
			editAlbumPhotos: {
				method: 'POST',
				params: {
					photoId: '@photoId',
					action: '@action'
				},
				isArray: false,
				url: '/albums/:id/:action/:photoId/'
			}
		});

	}
]);

angular.module('mean.albums').service('PhotoMgrService', ['Global', 'AlbumsCollection', 'PhotosCollection',
	function (Global, AlbumsCollection, Photo) {

		var global = Global;
		var pmSvc = {};

		pmSvc.editAlbumPhotos = function (action, photo, album) {
			return AlbumsCollection.editAlbumPhotos({
				action: action,
				_id: album._id,
				photoId: photo._id
			}, function (data) {
				return data;
			});
		}

		pmSvc.getAlbum = function (id) {
			return AlbumsCollection.get({
				id: id
			}, function (data) {
				return data;
			}).$promise;
		}

		pmSvc.getPhoto = function (id) {
			return Photo.get({
				id: id
			}, function (data) {
				return data;
			}).$promise;
		}

		pmSvc.getAllPhotos = function () {
			return Photo.query({}, function (data) {
				return data;
			}).$promise;
		}

		pmSvc.getAllAlbums = function () {
			return AlbumsCollection.query({}, function (data) {
				return data;
			}).$promise;
		}

		pmSvc.saveAlbum = function (album) {
			return AlbumsCollection.save({}, album, function (data) {
				return data;
			}).$promise;
		}

		pmSvc.savePhoto = function (photo) {
			return Photo.save({}, photo, function (data) {
				return data;
			}).$promise;
		}

		pmSvc.deleteAlbum = function (album) {
			return AlbumsCollection.delete({}, album, function (data) {
				return data;
			}).$promise;
		}

		pmSvc.deletePhoto = function (photo) {
			return Photo.delete({}, photo, function (data) {
				return data;
			}).$promise;
		}

		pmSvc.toggleEnabled = function (id) {
			return AlbumsCollection.get({
				id: id
			}, function (album) {
				album.enabled = (!album.enabled)
				album.$save();
			}).$promise;
		}

		pmSvc.getAlbumPhotos = function (id) {
			return AlbumsCollection.getPhotos({
				id: id
			}, function (data) {
				return data;
			}).$promise;
		}

		pmSvc.newAlbum = function () {
			return new AlbumsCollection();
		}

		pmSvc.newPhoto = function () {
			return new Photo();
		}

		pmSvc.uploadFile = function (formData) {
			return Photo.uploadPhoto({}, formData).$promise;
		}

		return pmSvc;

	}
]);