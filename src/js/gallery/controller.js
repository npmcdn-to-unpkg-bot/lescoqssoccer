'use strict';

angular.module( 'mean.gallery' ).controller( 'GalleryController', [ '$scope', 'Global',
	function ( $scope, Global ) {

		$scope.global = Global;
		$scope.slides = [ {
			src: "img/9036958611_fa1bb7f827_m.jpg",
			text: "Image 1"
		}, {
			src: "img/9041440555_2175b32078_m.jpg",
			text: "Image 2"
		}, {
			src: "img/8985207189_01ea27882d_m.jpg",
			text: "Image 2"
		}, {
			src: "img/8962691008_7f489395c9_m.jpg",
			text: "Image 3"
		} ];

		// initializing the time Interval
		$scope.myInterval = 5000;
	}
] );

angular.module( 'mean.albums' ).controller( 'modalInstanceCtrl', [ '$scope', '$modalInstance', 'photos', 'albums',

	function ( $scope, $modalInstance, photos, albums ) {

		$scope.photos = photos;
		$scope.albums = albums;

		$scope.ok = function ( result ) {
			$modalInstance.close( result );
		};

		$scope.cancel = function () {
			$modalInstance.dismiss( 'cancel' );
		};
	}
] );

angular.module( 'mean.albums' ).controller( 'deleteAlbumModalCtrl', [ '$scope', '$modalInstance', 'album',

	function ( $scope, $modalInstance, album ) {

		$scope.album = album;

		$scope.ok = function ( result ) {
			$modalInstance.close( result );
		};

		$scope.cancel = function () {
			$modalInstance.dismiss( 'cancel' );
		};
	}
] );

angular.module( 'mean.albums' ).controller( 'deletePhotoModalCtrl', [ '$scope', '$modalInstance', 'photo',

	function ( $scope, $modalInstance, photo ) {

		$scope.photo = photo;

		$scope.ok = function ( result ) {
			$modalInstance.close( result );
		};

		$scope.cancel = function () {
			$modalInstance.dismiss( 'cancel' );
		};
	}
] );

angular.module( 'mean.albums' ).controller( 'AlbumCtrl', [ '$location', '$scope', '$modal', 'PhotoMgrService', 'album', 'albums', 'view', 'FileUploader',

	function ( $location, $scope, $modal, PhotoMgrService, album, albums, view, FileUploader ) {

		// create a uploader with options
		$scope.uploader = new FileUploader( {
			scope: $scope,
			url: '/upload/photo',
			autoUpload: true,
			formData: [ {
				key: 'value'
			} ]
		} );

		$scope.uploader.onCompleteItem = function ( item, response, status, headers ) {
			console.info( 'Complete', item, response );

			$scope.photo = PhotoMgrService.newPhoto( {
				filepath: response.path,
				name: response.name
			} );

			$scope.pmSvc.savePhoto( $scope.photo ).then( function ( photo ) {
				return photo;
			} ).then( function ( photo ) {
				$scope.addPhotoToAlbum( photo );
			} );
		};

		$scope.clickPhoto = function ( p ) {
			$scope.displayPhoto = p;
		};

		$scope.setCoverPic = function ( p ) { //used by select to set photoId and path of the album's cover photo
			$scope.album.coverPicPath = p.filepath;
			$scope.album.coverPic = p._id;
		};

		$scope.clickEnabled = function ( index ) { // when user clicks film icon in list view
			$scope.albums[ index ].enabled = !$scope.albums[ index ].enabled;
			$scope.pmSvc.saveAlbum( $scope.albums[ index ] );
		};

		$scope.saveAlbum = function ( album, redirect ) {

			if ( !album._id ) { //album is new
				album.photos = [];
				album.order = albums.length;
			}

			$scope.pmSvc.saveAlbum( album ).then( function ( data ) {
				$scope.albums.push( data ); //add new album to list &  clear form

				if ( redirect ) {
					$location.path( '/albums/detail/' + data._id );
				} else {
					$scope.newAlbum = $scope.pmSvc.newAlbum();
				}
			} );
		};

		$scope.deleteAlbum = function ( deletedAlbum, redirect ) {

			var modalInstance = $modal.open( {
				templateUrl: 'js/gallery/views/modal/deleteAlbumModal.html',
				controller: 'deleteAlbumModalCtrl',
				resolve: {
					album: function () {
						return deletedAlbum;
					}
				}
			} );

			modalInstance.result.then( function () {

				// Delete the album and either update album list or redirect to it
				$scope.pmSvc.deleteAlbum( deletedAlbum ).then( function () {
					if ( redirect ) {
						$location.path( '/albums' );
					} else {
						$scope.albums.splice( window._.indexOf( $scope.albums, deletedAlbum ), 1 ); //remove from list
						reNumberAlbums();
					}
				} );
			}, function () {
				console.log( 'Modal dismissed' );
			} );
		};

		var reNumberAlbums = function () {

			$( ".album-list-table" ).children( '.sortable' ).each( function ( index ) {

				// get old item index
				var oldIndex = parseInt( $( this ).attr( "data-ng-album-order" ), 10 );
				if ( $scope.albums[ oldIndex ] ) {
					$scope.albums[ oldIndex ].order = index;
					$scope.pmSvc.saveAlbum( $scope.albums[ oldIndex ] );
				}
			} );
		};

		$scope.sortAlbums = { //used by sortable album list element
			cancel: '.nonsortable',
			items: '.sortable',
			stop: function () {
				reNumberAlbums()
			}
		};

		var reNumberPhotos = function () {

			//update display
			$( ".photo-list-table" ).children( '.sortable' ).each( function ( index ) {
				//get old item index
				var oldIndex = parseInt( $( this ).attr( "data-ng-photo-order" ), 10 );
				if ( $scope.displayPhotos[ oldIndex ] ) {
					$scope.displayPhotos[ oldIndex ].order = index;
				}
			} );

			//reorder the album photos in the same order & save album
			$scope.pmSvc.getAlbum( album._id ).$promise.then( function ( album ) {
				album.photoList = [];
				window._.each( $scope.displayPhotos, function ( photo, index ) {
					album.photoList[ index ] = window._.pick( photo, '_id', 'order' );
				} );
				$scope.pmSvc.saveAlbum( album );
			} );
		};

		$scope.sortPhotos = { //used by sortable photo list element
			cancel: '.nonsortable',
			items: '.sortable',
			stop: function () {
				reNumberPhotos();
			}
		}

		$scope.addPhotoToAlbum = function ( addedPhoto ) {

			$scope.pmSvc.editAlbumPhotos( 'add', addedPhoto, album ).$promise.then( function ( data ) {
				$scope.displayPhotos.push( data.photo );
				$scope.displayPhoto = data.photo;
			} );
		};

		$scope.removePhotoFromAlbum = function ( removedPhoto ) {
			$scope.displayPhotos.splice( window._.indexOf( $scope.displayPhotos, removedPhoto ), 1 );
			$scope.pmSvc.editAlbumPhotos( 'remove', removedPhoto, album );
		};

		$scope.pmSvc = PhotoMgrService;
		$scope.view = view ? view : 'list'; //if view not set in route params,view = list
		$scope.album = album;
		$scope.newAlbum = $scope.pmSvc.newAlbum()
		$scope.albums = albums;
		$scope.pmSvc.filter = '';
		$scope.section = {
			'name': 'Album',
			'url': '/albums'
		}; //used in subnav.html

		if ( view === 'detail' ) {
			console.log( album );

			$scope.displayPhotos = [];
			window._.each( album.photoList, function ( entry ) {
				$scope.displayPhotos.push( entry._id );
			} );

			if ( $scope.displayPhotos.length > 0 ) {
				$scope.displayPhoto = $scope.displayPhotos[ 0 ];
				$scope.coverPic = window._.findWhere( $scope.displayPhotos, {
					_id: album.coverPic
				} )
			}
		};
	}
] );

angular.module( 'mean.albums' ).controller( 'GalleryCtrl', [ '$scope', 'albums', 'photos', 'view',

	function ( $scope, albums, photos, view ) {

		$scope.clickPhoto = function ( albumID, index ) {
			if ( albumID !== $scope.album._id ) {
				$scope.album = window._.findWhere( $scope.albums, {
					_id: albumID
				} )
			}

			$scope.prev = ( index - 1 ) < 0 ? $scope.album.photoList.length - 1 : index - 1;
			$scope.next = ( index + 1 ) % $scope.album.photoList.length;
			$scope.photo = $scope.album.photoList[ index ];
		}

		$scope.clickAlbum = function ( i ) {

			$scope.albums[ i ].opened = !$scope.albums[ i ].opened;
			if ( $scope.albums[ i ].opened ) {
				$scope.album = $scope.albums[ i ]
				$scope.photo = $scope.album.photoList[ 0 ]
			}
		};

		$scope.getCarousel = function(){

			var slides = [];
			_.each($scope.album.photoList, function(photo, index){
				slides.push({
					filepath: photo.filepath,
					active: (photo._id === $scope.photo._id)
				});
			});

			return slides;
		};

		$scope.albums = window._.where( albums, {
			enabled: true
		} );

		if ( $scope.albums.length > 0 ) {

			//load photo data into $scope.albums
			window._.each( $scope.albums, function ( album ) {
				window._.each( album.photoList, function ( entry ) {
					window._.extend( entry, window._.findWhere( photos, {
						_id: entry._id
					} ) );
				} );
			} );

			$scope.album = $scope.albums[ 0 ];
			$scope.album.opened = true;
			$scope.photo = $scope.album.photoList[ 0 ];
			$scope.prev = $scope.album.photoList.length - 1;
			$scope.next = 1;
		}

		$scope.section = {
			'name': 'Album',
			'url': '/albums'
		};

		$scope.view = 'gallery';
	}
] );

//To Pre-load Album & Photo data before route change
var PhotoMgrData = {

	album: function ( AlbumsCollection, $route ) {
		return $route.current.params.albumId ? AlbumsCollection.get( {
			id: $route.current.params.albumId
		} ).$promise : new AlbumsCollection();
	},

	photo: function ( PhotosCollection, $route ) {
		return $route.current.params.photoId ? Photo.get( {
			id: $route.current.params.photoId
		} ).$promise : new PhotosCollection();
	},

	albums: function ( AlbumsCollection, $route, $location ) { //return all albums only if URL /albums/* but not /albums/add
		if ( RegExp( '\/albums' ).test( $location.path() ) && $route.current.params.view !== 'add' ) {
			return AlbumsCollection.query().$promise;
		} else {
			return [];
		}
	},

	photos: function ( PhotosCollection, $route, $location ) { //return all photos only if URL /photos/* but not /photos/add
		if ( RegExp( '\/photos' ).test( $location.path() ) && $route.current.params.view !== 'add' ) {
			return PhotosCollection.query().$promise;
		} else {
			return [];
		}
	},

	view: function ( $route ) {
		return $route.current.params.view;
	}
};

//Preload all photos and albums
var GalleryData = {

	albums: function ( AlbumsCollection ) {
		return AlbumsCollection.query().$promise;
	},

	photos: function ( PhotosCollection, $route ) {
		return $route.current.params.albumId ? AlbumsCollection.getPhotos( {
			id: $route.current.params.albumId
		} ).$promise : PhotosCollection.query().$promise;
	},

	view: function ( $route ) {
		return $route.current.params.view;
	}
};