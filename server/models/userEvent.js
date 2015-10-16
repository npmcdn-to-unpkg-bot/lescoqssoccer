'use strict';

/**
 * Module dependencies.
 */
var mongoose = require( 'mongoose' ),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var UserEventSchema = new Schema( {
	startsAt: {
		type: Date,
		default: Date.now
	},
	endsAt: {
		type: Date,
		default: Date.now,
		trim: true
	},
	title: {
		type: String,
		default: '',
		trim: true
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	type: {
		type: String,
		trim: true
	},
	eventType: {
		type: String,
		trim: true
	},
	recursOn: {
		type: String,
		trim: true
	},
	editable:{
		type: Boolean
	},
	deletable:{
		type: Boolean
	},
	incrementsBadgeTotal:{
		type: String,
		trim: true
	},
	location: {
		latitude: {
			type: String
		},
		longitude: {
			type: String
		}
	},
	guest: [{
		type : mongoose.Schema.ObjectId, ref : 'User'
	}]
} );

/**
 * Validations
 */
// UserEventSchema.path('content').validate(function(title) {
//     return title.length;
// }, 'Content cannot be blank');

/**
 * Statics
 */
UserEventSchema.statics.load = function ( id, cb ) {
	this.findOne( {
		_id: id
	} ).populate( 'userEvent', 'name username' ).exec( cb );
};

module.exports = mongoose.model( 'UserEvent', UserEventSchema );