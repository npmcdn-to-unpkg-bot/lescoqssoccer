var mongoose = require( 'mongoose' );
var _ = require( 'underscore' );
var Photo = mongoose.model( 'Photo' );

exports.findAllPhotos = function ( req, res ) {
	Photo.find( {} ).populate( 'albums', 'name' ).exec( function ( err, photos ) {
		res.send( photos );
	} )
};

exports.findPhotoById = function ( req, res ) {
	Photo.findOne( {
		_id: req.params.id
	} )
		.populate( 'albums', 'name' )
		.exec( function ( err, photo ) {
			if ( err ) console.log( "error finding photo: " + err )
			res.send( photo );
		} )
};

exports.addPhoto = function ( req, res ) {
	var newPhoto = req.body;
	console.log( "Adding Photo: " + JSON.stringify( newPhoto ) );
	Photo.create( newPhoto, function ( err, photo ) {
		if ( err ) console.log( "error: " + err );
		res.send( photo );
	} )
};

exports.updatePhoto = function ( req, res ) {
	Photo.findById( req.params.id, function ( err, photo ) {
		if ( err ) console.log( "error: " + err )
		_.extend( photo, req.body );
		photo.save( function ( err, photo, numAffected ) {
			if ( err ) console.log( "Error saving photo: " + err )
			console.log( numAffected + " documents updated." )
			res.send( photo )
		} );
	} );
};

exports.deletePhoto = function ( req, res ) {
	Photo.findById( req.params.id, function ( err, doc ) {
		if ( !err ) {
			doc.remove( function () {
				res.send( req.body );
			} );
		} else {
			console.log( "error: " + err );
		}
	} )
};