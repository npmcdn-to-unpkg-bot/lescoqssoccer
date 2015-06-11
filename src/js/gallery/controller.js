'use strict';

angular.module('mean.albums').controller('AlbumCtrl', ['$location', '$scope', '$modal', 'PhotoMgrService', 'album', 'albums', 'view', 'FileUploader',

    function($location, $scope, $modal, PhotoMgrService, album, albums, view, FileUploader) {

        //used in subnav.html
        $scope.view = "add";
        $scope.section = {
            'name': 'Album',
            'url': '/albums'
        };

        $scope.pmSvc = PhotoMgrService;
        $scope.newAlbum = $scope.pmSvc.newAlbum();
        $scope.pmSvc.filter = '';
        $scope.album = album;
        $scope.displayPhotos = [];

        window._.each(album.photoList, function(entry) {
            $scope.displayPhotos.push(entry._id);
        });

        if ($scope.displayPhotos.length > 0) {
            $scope.displayPhoto = $scope.displayPhotos[0];
            $scope.coverPic = window._.findWhere($scope.displayPhotos, {
                _id: album.coverPic
            })
        };

        $scope.saveAlbum = function(album, redirect) {

            if (!album._id) { //album is new
                album.photos = [];
                album.order = albums.length;
            }

            $scope.pmSvc.saveAlbum(album).then(function(data) {

                if (redirect) {
                    $location.path('/albums/detail/' + data._id);
                } else {
                    $scope.newAlbum = $scope.pmSvc.newAlbum();
                }
            });
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

                $scope.photo = PhotoMgrService.newPhoto({
                    filepath: response.path,
                    name: response.name
                });

                $scope.pmSvc.savePhoto($scope.photo).then(function(photo) {
                    return photo;
                }).then(function(photo) {
                    $scope.addPhotoToAlbum(photo);
                });
            };
        };

        $scope.setCoverPic = function(photo) { //used by select to set photoId and path of the album's cover photo
            $scope.album.coverPicPath = photo.filepath;
            $scope.album.coverPic = photo._id;
        };

        $scope.addPhotoToAlbum = function(addedPhoto) {

            $scope.pmSvc.editAlbumPhotos('add', addedPhoto, album).$promise.then(function(data) {

                $scope.displayPhotos.push(data.photo);
                $scope.displayPhoto = data.photo;

                if (!albums.coverPicPath) {
                    $scope.setCoverPic(data.photo);
                }
            });
        };

        $scope.deletePhoto = function(removedPhoto) {
            $scope.displayPhotos.splice(window._.indexOf($scope.displayPhotos, removedPhoto), 1);
            $scope.pmSvc.editAlbumPhotos('remove', removedPhoto, album);
        };
    }
]);

angular.module('mean.albums').controller('GalleryCtrl', ['$scope', 'Global', '$location', '$modal', 'PhotoMgrService', 'albums', 'AlbumsCollection', 'Gamma',

    function($scope, Global, $location, $modal, PhotoMgrService, albums, AlbumsCollection, Gamma) {

        //used in subnav
        $scope.view = 'grid';
        $scope.section = {
            'name': 'Album',
            'url': '/albums'
        };

        $scope.global = Global;
        $scope.pmSvc = PhotoMgrService;
        $scope.albums = albums;

        // $scope.paginationMin = 0;
        // $scope.paginationMax = 15;
        // $scope.prev = 0;
        // $scope.next = 1;

        $scope.loadPhotos = function(album, index) {

            $scope.index = index;

            var album = AlbumsCollection.get({
                id: album._id
            }).$promise;

            album.then(function(album) {

                window._.each(album.photoList, function(p) {
                    $("ul.gamma-gallery").append(
                        '<li><div data-alt="img03" data-description="<h3>' + p._id.name + '</h3>" data-max-width="1800" data-max-height="1350">' +
                        '<div data-src="' + p._id.filepath + '"></div></div></li>'
                    );
                });

                var GammaSettings = {

                    // order is important!
                    viewport: [{
                        width: 1200,
                        columns: 5
                    }, {
                        width: 900,
                        columns: 4
                    }, {
                        width: 500,
                        columns: 3
                    }, {
                        width: 320,
                        columns: 2
                    }, {
                        width: 0,
                        columns: 2
                    }]
                };

                Gamma.init(GammaSettings, index);
            });
        };

        $scope.deleteMasonry = function() {
            $("ul.gamma-gallery").find("li").remove();
        };

        $scope.editAlbum = function(album, evt) {

            evt.preventDefault();
            evt.stopPropagation();

            $location.path("/albums/edit/" + album._id);
        };

        $scope.deleteAlbum = function(deletedAlbum, evt) {

            evt.preventDefault();
            evt.stopPropagation();

            var modalInstance = $modal.open({
                templateUrl: 'js/gallery/views/modal/deleteAlbumModal.html',
                controller: 'deleteAlbumModalCtrl',
                resolve: {
                    album: function() {
                        return deletedAlbum;
                    }
                }
            });

            modalInstance.result.then(function() {

                // Delete the album and either update album list or redirect to it
                $scope.pmSvc.deleteAlbum(deletedAlbum).then(function() {
                    $scope.albums.splice(window._.indexOf($scope.albums, deletedAlbum), 1); //remove from list
                });

            });

        };
    }
]);

//To Pre-load Album & Photo data before route change
var PhotoMgrData = {

    album: function(AlbumsCollection, $route) {
        return $route.current.params.albumId ? AlbumsCollection.get({
            id: $route.current.params.albumId
        }).$promise : new AlbumsCollection();
    },

    photo: function(PhotosCollection, $route) {
        return $route.current.params.photoId ? Photo.get({
            id: $route.current.params.photoId
        }).$promise : new PhotosCollection();
    },

    albums: function(AlbumsCollection, $route, $location) { //return all albums only if URL /albums/* but not /albums/add
        if (RegExp('\/albums').test($location.path()) && $route.current.params.view !== 'add') {
            return AlbumsCollection.query().$promise;
        } else {
            return [];
        }
    },

    photos: function(PhotosCollection, $route, $location) { //return all photos only if URL /photos/* but not /photos/add
        if (RegExp('\/photos').test($location.path()) && $route.current.params.view !== 'add') {
            return PhotosCollection.query().$promise;
        } else {
            return [];
        }
    },

    view: function($route) {
        return $route.current.params.view;
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