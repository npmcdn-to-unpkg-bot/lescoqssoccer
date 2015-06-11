var mongoose = require( 'mongoose' );
var _ = require( 'underscore' );
var Album = mongoose.model( 'Album' );

exports.findAllAlbums = function ( req, res ) {
	Album.find( {}, null, {
		sort: {
			order: 1
		}
	}, function ( err, albums ) {
		res.send( albums );
	} )
};

exports.findAllPhotosInAlbum = function ( req, res ) {
	Album.findOne( {
		_id: req.params.id
	} ).populate( 'photoList._id' ).select( 'photoList._id' ).exec( function ( err, album ) {
		var photos = [];
		_.each( album.photoList, function ( entry ) {
			photos.push( entry._id ); //entry._id represents entire photo document
		} )
		res.send( photos )
	} )
};

exports.editAlbumPhotos = function ( req, res ) {

	var action = req.params.action;
	var albumId = req.params.id;
	var photoId = req.params.photoId;

	Album.findById( albumId, function ( err, album ) {
		if ( err ) console.log( "Error finding album: " + err )

		if ( action === 'add' ) {
			album.addPhoto( photoId, function ( data ) {
				res.send( data );
			} );
		} else { // action === 'remove'
			album.removePhoto( photoId, function ( data ) {
				res.send( data );
			} );
		}
	} )
};

exports.findAlbumById = function ( req, res ) {
	Album.findOne( {
		_id: req.params.id
	} ).populate( 'photoList._id' ).exec( function ( err, album ) {
		if ( err ) console.log( "error finding album: " + err )
		res.send( album );
	} )
};

exports.addAlbum = function ( req, res ) {

	var newAlbum = req.body;
	newAlbum.user = req.user;

	console.log( "Adding Album: " + JSON.stringify( newAlbum ) );
	Album.create( newAlbum, function ( err, album ) {
		if ( err ) console.log( "error: " + err );
		res.send( album );
	} );
};

exports.updateAlbum = function ( req, res ) {
	Album.findById( req.params.id, function ( err, album ) {
		delete req.body._id;
		delete req.body.photoList;
		if ( err ) console.log( "error: " + err )
		_.extend( album, req.body );
		album.save( function ( err, album, numAffected ) {
			if ( err ) console.log( "Error saving album: " + err )
			console.log( numAffected + " documents updated." )
			res.send( album )
		} );
	} );
};

exports.deleteAlbum = function ( req, res ) {
	Album.findById( req.params.id, function ( err, doc ) {
		if ( !err ) {
			doc.remove( function () {
				res.send( req.body );
			} );
		} else {
			console.log( "error: " + err );
		}
	} )
};