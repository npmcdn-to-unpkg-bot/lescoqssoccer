'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


/**
 * Suggestion Schema
 */
var SuggestionSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
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
	yes: [],
	no: [],
	blank: [],
});

/**
 * Statics
 */
SuggestionSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).populate('user', 'name username').exec(cb);
};

mongoose.model('Suggestion', SuggestionSchema);