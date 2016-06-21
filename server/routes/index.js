"use strict";

var mongoose = require("mongoose"),
	_ = require("lodash"),
	User = mongoose.model("User");

module.exports = function(app) {

	// Home route
	var index = require("../controllers/index");
	app.get("/", function(req, res) {
		if (!req.isAuthenticated()) {
			res.render("users/signin.jade");
		} else {
			User.findOne({
				_id: req.user._id
			}).exec(function(err, user) {
				if (user && user.exclude) {
					req.logout();
					res.redirect("/");
				} else {
					index.render(req, res);
				}
			});
		};
	});
}