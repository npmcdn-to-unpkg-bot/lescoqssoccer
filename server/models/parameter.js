'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


/**
 * Parameter Schema
 */
var ParameterSchema = new Schema({
	articleCategories: [{
		id: {
			type: Number
		},
		value: {
			type: String,
			default: '',
			trim: true
		}
	}]
});

/**
 * Statics
 */
ParameterSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).exec(cb);
};

mongoose.model('Parameter', ParameterSchema);