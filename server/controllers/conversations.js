'use strict';

/**
 * Module dependencies.
 */
var mongoose = require( 'mongoose' ),
	Conversation = mongoose.model( 'Conversation' ),
	_ = require( 'lodash' );

/**
 * Find link by id
 */
exports.conversation = function ( req, res, next, id ) {
	conversation.load( id, function ( err, conversation ) {
		if ( err ) return next( err );
		if ( !conversation ) return next( new Error( 'Failed to load conversation ' + id ) );
		req.conversation = conversation;
		next();
	} );
};

/**
 * Create a conversation
 */
exports.create = function ( req, res ) {

	var conversation = new Conversation( req.body );

	conversation.save( function ( err ) {
		console.log( "Error when create conversation: " + err );
		if ( err ) {
			return res.send( 'users/signup', {
				errors: err.errors,
				conversation: conversation
			} );
		} else {
			res.jsonp( conversation );
		}
	} );
};

/**
 * Update a conversation
 */
exports.update = function ( req, res ) {
	var conversation = req.conversation;

	conversation = _.extend( conversation, req.body );
	conversation.save( function ( err ) {
		if ( err ) {
			return res.send( 'users/signup', {
				errors: err.errors,
				conversation: conversation
			} );
		} else {
			res.jsonp( conversation );
		}
	} );
};

/**
 * Delete an conversation
 */
exports.destroy = function ( req, res ) {
	var conversation = req.conversation;

	conversation.remove( function ( err ) {
		if ( err ) {
			return res.send( 'users/signup', {
				errors: err.errors,
				conversation: conversation
			} );
		} else {
			res.jsonp( conversation );
		}
	} );
};

/**
 * Show an conversation
 */
exports.show = function ( req, res ) {
	res.jsonp( req.conversation );
};

/**
 * List of links
 */
exports.all = function ( req, res ) {
	Conversation.find({users: req.user.id}).sort( '-created' ).populate( 'users').exec( function ( err, links ) {
		if ( err ) {
			res.render( 'error', {
				status: 500
			} );
		} else {
			res.jsonp( links );
		}
	} );
};