"use strict";

// Articles routes use articles controller
var albums = require( "../controllers/albums" );
var authorization = require( "./middlewares/authorization" );

// Albums authorization helpers
var hasAuthorization = function ( req, res, next ) {
	if ( req.album.user.id !== req.user.id ) {
		return res.send( 401, "User is not authorized" );
	}
	next();
};

module.exports = function ( app ) {

	/** Album C.R.U.D. **/
	app.post( "/albums", albums.addAlbum );
	app.get( "/albums", albums.findAllAlbums );
	app.get( "/albums/:id", albums.findAlbumById );
	app.put( "/albums/:id", albums.updateAlbum );
	app.post( "/albums/:id", albums.updateAlbum );
	app.delete( "/albums/:id", albums.deleteAlbum );

	//get albums count
    	app.get("/albumsCount", albums.getItemsCount);

	/**Download**/
	app.post("/download/:id", albums.download);
	app.get("/file/:id", albums.getZipFile);

	// Finish with setting up the albumId param
	app.param("id", albums.album);
};