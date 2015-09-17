'use strict';

/**
 * Module dependencies.
 */
var mongoose = require( 'mongoose' ),
	Schema = mongoose.Schema;

/**
 * Link Schema
 */
var LinkSchema = new Schema( {
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true
	},
	image: {
		type: String,
		default: ''
	},
	adress: {
		type: String,
		default: ''
	},
	type: {
		type: String,
		default: ''
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
} );

/**
 * Validations
 */
LinkSchema.path( 'title' ).validate( function ( title ) {
	return title.length;
}, 'Title cannot be blank' );

/**
 * Statics
 */
LinkSchema.statics.load = function ( id, cb ) {
	this.findOne( {
		_id: id
	} ).populate( 'user', 'name username' ).exec( cb );
};

mongoose.model( 'Link', LinkSchema );