'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Parameters = mongoose.model('Parameter'),
	_ = require('lodash');

/**
 * Get all parameters
 */
exports.getAllParameters = function(req, res) {

	Parameters.find().exec()
		.then(function(parameters, err) {
			if (err) {
				res.render('error', {
					status: 500
				});
			} else {
				res.jsonp(parameters);
			}
		});
};

/**
 * Create parameters
 */
exports.create = function(_parameter) {
	var parameter = new Parameter(_parameter);
	parameter.save(function(err) {
		if (err) {
			console.warn("Error when adding params: " + err);
		} else {
			console.warn("Successfuly add params");
		}
	});
};

/**
 * Update parameters
 */
exports.update = function(req, res) {
	var parameters = req.parameters;
	parameters = _.extend(parameters, req.body);
	Parameters.save(function(err) {
		if (err) {
			return res.send('users/signup', {
				errors: err.errors,
				parameters: parameters
			});
		} else {
			res.jsonp(parameters);
		}
	});
};