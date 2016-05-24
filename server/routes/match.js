'use strict';

// Articles routes use articles controller
var matchs = require( '../controllers/match' );
var authorization = require( './middlewares/authorization' );

// Albums authorization helpers
var hasAuthorization = function ( req, res, next ) {
	if ( req.match.user.id !== req.user.id ) {
		return res.send( 401, 'User is not authorized' );
	}
	next();
};

module.exports = function ( app ) {
	app.post( '/matchs', matchs.addMatch );
	app.get( '/matchs', matchs.findAllMatchs );
	app.get( '/matchs/:id', matchs.findMatchById );
	app.put( '/matchs/:id', matchs.updateMatch );
	app.post( '/matchs/:id', matchs.updateMatch );
	app.delete( '/matchs/:id', matchs.deleteMatch );
};