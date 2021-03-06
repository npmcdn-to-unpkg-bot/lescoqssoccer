"use strict";

// Articles routes use suggestions controller
var parameters = require("../controllers/parameters");
var authorization = require("./middlewares/authorization");

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
	if (req.suggestion.user.id !== req.user.id) {
		return res.send(401, "User is not authorized");
	}
	next();
};

module.exports = function(app) {
	app.get("/parameters", parameters.getAllParameters);
	app.put("/parameters", authorization.requiresLogin, parameters.update);
};