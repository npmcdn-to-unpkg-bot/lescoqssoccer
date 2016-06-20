"use strict";

/**
 * Module dependencies.
 */
var mongoose = require("mongoose"),
	Suggestion = mongoose.model("Suggestion"),
	Article = mongoose.model("Article"),
	moment = require("moment"),
	_ = require("lodash");


/**
 * Find suggestion by id
 */
exports.suggestion = function(req, res, next, id) {
	Suggestion.load(id, function(err, suggestion) {
		if (err) return next(err);
		if (!suggestion) return next(new Error("Failed to load suggestion " + id));
		req.suggestion = suggestion;
		next();
	});
};

/**
 * Create a suggestion
 */
exports.create = function(req, res) {
	var suggestion = new Suggestion(req.body);
	suggestion.user = req.user;
	suggestion.save(function(err) {
		console.log(err);
		if (err) {
			return res.send("users/signup", {
				errors: err.errors,
				suggestion: suggestion
			});
		} else {
			res.jsonp(suggestion);
		}
	});
};

/**
 * Update a suggestion
 */
exports.update = function(req, res) {
	var suggestion = req.suggestion;
	suggestion = _.extend(suggestion, req.body);
	suggestion.save(function(err) {
		if (err) {
			return res.send("users/signup", {
				errors: err.errors,
				suggestion: suggestion
			});
		} else {
			res.jsonp(suggestion);
		}
	});
};

/**
 * Delete an suggestion
 */
exports.destroy = function(req, res) {
	var suggestion = req.suggestion;
	suggestion.remove(function(err) {
		if (err) {
			return res.send("users/signup", {
				errors: err.errors,
				suggestion: suggestion
			});
		} else {
			res.jsonp(suggestion);
		}
	});
};

/**
 * Show a suggestion
 */
exports.show = function(req, res) {
	res.jsonp(req.suggestion);
};

/**
 * List of suggestions
 */
exports.all = function(req, res) {

	var perPage = req.query.perPage;
	var page = req.query.page;

	Suggestion.find({})
		.sort("-created")
		.limit(perPage)
		.skip(perPage * page)
		.populate("user", "_id name username avatar")
		.exec(function(err, suggestions) {
			if (err) {
				res.render("error", {
					status: 500
				});
			} else {
				res.jsonp(suggestions);
			}
		});
};

/**
 * Create article from ended suggestion to see results
 **/
exports.closeVotes = function(req, res) {

	var article, yes = [],
		no = [],
		blank = [];
	var date = moment().subtract(1, "months").toISOString();

	Suggestion.find({
			"created": {
				"$lt": date
			}
		})
		.sort("-created")
		.exec(function(err, suggestions) {

			if (err) {
				console.warn("Error when to fetch suggestions " + err);
			} else {
				_.each(suggestions, function(suggestion) {

					article = new Article({
						title: "Vote",
						user: suggestion.user,
						content: suggestion.content,
						type: "quote",
						comments: []
					});

					_.each(suggestion.yes, function(userId) {
						yes.push({
							user: userId
						});
					});
					article.yes = yes;

					_.each(suggestion.blank, function(userId) {
						blank.push({
							user: userId
						});
					});
					article.blank = blank;

					_.each(suggestion.no, function(userId) {
						no.push({
							user: userId
						});
					});
					article.no = no;

					no = [];
					yes = [];
					blank = [];

					article.save(function(err) {

						if (err) {
							console.warn("Error when trying to save new article " + err);
						} else {

							suggestion.remove(function(err) {
								if (err) {
									console.warn("Error when trying to remove suggestion " + err);
								} else {
									console.warn("Suggestion removed with success");
								}
							});
						}
					});
				});
			}
		});
};