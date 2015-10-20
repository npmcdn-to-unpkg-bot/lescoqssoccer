'use strict';

/**
 * Module dependencies.
 */
var mongoose = require( 'mongoose' ),
	Schema = mongoose.Schema;

/**
 * Link Schema
 */
var ConversationSchema = new Schema( {
	created: {
		type: Date,
		default: Date.now
	},
	users: [{
		type : mongoose.Schema.ObjectId, ref : 'User'
	}],
	messages: [{
		type : String
	}]
} );

/**
 * Statics
 */
ConversationSchema.statics.load = function ( id, cb ) {
	this.findOne( {
		_id: id
	} ).populate( 'user').exec( cb );
};

mongoose.model( 'Conversation', ConversationSchema );