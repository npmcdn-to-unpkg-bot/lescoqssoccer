"use strict";

/**
 * Module dependencies.
 */
var mongoose = require("mongoose"),
	Article = mongoose.model("Article"),
	_ = require("lodash");

/**
 * Find article by id
 */
exports.article = function(req, res, next, id) {
	Article.findOne({
			"_id": id
		})
		.populate("user", "name username avatar")
		.populate("comments.user", "_id name username avatar")
		.populate("comments.replies.user", "_id name username avatar")
		.populate("yes.user", "name username avatar")
		.populate("no.user", "name username avatar")
		.populate("blank.user", "name username avatar").exec(function(err, article) {
			if (err) return next(err);
			req.article = article;
			next();
		});
};

/**
 * Create a article
 */
exports.create = function(req, res) {
	var article = new Article(req.body);
	article.user = req.user;
	article.save(function(err) {
		if (err) {
			return res.send("users/signup", {
				errors: err.errors,
				article: article
			});
		} else {
			res.jsonp(article);
		}
	});
};

/**
 * Update a article
 */
exports.update = function(req, res) {
	var article = req.article;
	article = _.extend(article, req.body);
	article.save(function(err) {
		if (err) {
			return res.send("users/signup", {
				errors: err.errors,
				article: article
			});
		} else {
			res.jsonp(article);
		}
	});
};

/**
 * Delete an article
 */
exports.destroy = function(req, res) {
	var article = req.article;
	article.remove(function(err) {
		if (err) {
			return res.send("users/signup", {
				errors: err.errors,
				article: article
			});
		} else {
			res.jsonp(article);
		}
	});
};

/**
 * Show an article
 */
exports.show = function(req, res) {
	res.jsonp(req.article);
};

/**
 * List of articles
 */
exports.all = function(req, res) {

	var query = (req.query.userId) ? {
		user: req.query.userId
	} : {};

	if (req.query.page) {
		var perPage = req.query.perPage;
		var page = req.query.page;
		Article.find(query)
			.sort("-created")
			.limit(perPage)
			.skip(perPage * page)
			.populate("user", "_id name username avatar").exec(function(err, articles) {
				if (err) {
					res.render("error", {
						status: 500
					});
				} else {
					res.jsonp(articles);
				}
			});
	} else {
		Article.find(query)
			.select('_id type')
			.sort("-created")
			.exec(function(err, articles) {
				if (err) {
					res.render("error", {
						status: 500
					});
				} else {
					res.jsonp(articles);
				}
			});
	}
};