"use strict";

angular.module("mean.albums").factory("AlbumsCollection", ["$resource",
	function($resource) {

		return $resource("albums/:id/", {
			id: "@_id"
		}, {
			query: {
				method: "GET",
				isArray: true
			},
			update: {
				method: "PUT",
				params: {
					_id: "@_id"
				}
			}
		});

	}
]);

//Articles service used for get articles items count
angular.module("mean.albums").factory("AlbumsCount", ["$resource",
	function($resource) {
		return $resource("albumsCount");
	}
]);

angular.module("mean.albums").factory("Photos", ["$resource",
	function($resource) {

		return $resource("photos/:id/", {
			id: "@_id"
		}, {
			uploadPhoto: {
				method: "POST",
				url: "/upload/photo",
				headers: {
					"Content-Type": undefined
				},
				transformRequest: angular.identity
			}
		});
	}
]);

angular.module("mean.albums").service("AlbumService", ["AlbumsCollection", "Photos", "AlbumsCount",
	function(AlbumsCollection, Photos, AlbumsCount) {

		var AlbumService = {

			all: [],
			itemsPerPage : 12,

			getAlbum: function(id) {
				return AlbumsCollection.get({
					id: id,
				}, function(album) {
					return album;
				}).$promise;
			},

			getAllAlbums: function(page) {
				return AlbumsCollection.query({
					page: page - 1,
					perPage: AlbumService.itemsPerPage
				}, function(albums) {
					AlbumService.all = albums;
					return albums;
				}).$promise;
			},

			getAlbumsByUser: function(userId) {
				return AlbumsCollection.query({
					userId: userId
				}, function(albums) {
					return albums;
				}).$promise;
			},

			getPrevious: function(album) {

				var index = 0;
				for(var i=0; i < AlbumService.all.length; i++){
					if(album._id === AlbumService.all[i]._id) index = i;
				}

				return (index - 1 > 0) ? AlbumService.all[index - 1] : AlbumService.all[0];
			},

			getNext: function(album) {

				var index = 0;
				for(var i=0; i < AlbumService.all.length; i++){
					if(album._id === AlbumService.all[i]._id) index = i;
				};

				return (index + 1 > AlbumService.all.length - 1) ? AlbumService.all[AlbumService.all.length - 1] : AlbumService.all[index + 1];
			},

			getItemsCount: function() {
				return AlbumsCount.get({}, function(result) {
					return result;
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

			deleteAlbum: function(albumId) {
				return AlbumsCollection.delete({
					id: albumId
				}, function(data) {
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