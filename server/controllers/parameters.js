"use strict";

/**
 * Module dependencies.
 */
var mongoose = require("mongoose"),
	Parameters = mongoose.model("Parameter"),
	_ = require("lodash");

/**
 * Get all parameters
 */
exports.getAllParameters = function(req, res) {

	Parameters.find().exec()
		.then(function(parameters, err) {
			if (err) {
				res.render("error", {
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
	var parameter = new Parameters(_parameter);
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
	var parameters = new Parameters(req.parameters);
	parameters = _.extend(parameters, req.body);
	Parameters.update({_id: parameters._id}, {
		$set: {
			articleCategories: parameters.articleCategories
		}
	}, function(err, affectedRows) {

		if (err) {
			console.warn("err: " + err);
		} else {
			res.jsonp({
				message: "Parameter update"
			})
		}

	});
};