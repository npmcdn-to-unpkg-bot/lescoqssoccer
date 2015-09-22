'use strict';

angular.module('mean.albums').factory('AlbumsCollection', ['$resource',
	function($resource) {

		return $resource('albums/:id/', {
			id: '@_id'
		}, {
			query: {
				method: 'GET',
				isArray: true
			},
			update: {
				method: 'PUT',
				params: {
					_id: '@_id'
				}
			}
		});

	}
]);

angular.module('mean.albums').factory('Photos', ['$resource',
	function($resource) {

		return $resource('photos/:id/', {
			id: '@_id'
		}, {
			uploadPhoto: {
				method: 'POST',
				url: '/upload/photo',
				headers: {
					'Content-Type': undefined
				},
				transformRequest: angular.identity
			}
		});
	}
]);

angular.module('mean.albums').service('AlbumService', ['AlbumsCollection', 'Photos',
	function(AlbumsCollection, Photos) {

		var AlbumService = {

			getAlbum: function(id) {
				return AlbumsCollection.get({
					id: id
				}, function(data) {
					return data;
				}).$promise;
			},

			getAllAlbums: function() {
				return AlbumsCollection.query({}, function(data) {
					return data;
				}).$promise;
			},

			saveAlbum: function(album) {
				return AlbumsCollection.save({}, album, function(data) {
					return data;
				}).$promise;
			},

			updateAlbum: function(album) {
				return AlbumsCollection.update({
					_id: album._id
				}, album, function(data) {
					return data;
				}).$promise;
			},

			deleteAlbum: function(album) {
				return AlbumsCollection.delete({}, album, function(data) {
					return data;
				}).$promise;
			},

			uploadFile: function(formData) {
				return Photos.uploadPhoto({}, formData).$promise;
			}
		};

		return AlbumService;
	}
]);