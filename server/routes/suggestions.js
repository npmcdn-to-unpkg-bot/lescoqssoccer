"use strict";

// Articles routes use suggestions controller
var suggestions = require("../controllers/suggestions");
var authorization = require("./middlewares/authorization");

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
	if (req.suggestion.user.id !== req.user.id) {
		return res.send(401, "User is not authorized");
	}
	next();
};

module.exports = function(app) {

	app.get("/suggestions", suggestions.all);
	app.post("/suggestions", authorization.requiresLogin, suggestions.create);
	app.get("/suggestions/:suggestionId", suggestions.show);
	app.put("/suggestions/:suggestionId", authorization.requiresLogin, suggestions.update);
	app.del("/suggestions/:suggestionId", authorization.requiresLogin, suggestions.destroy);

	//get suggestions count
	app.get("/suggestionsCount", suggestions.getItemsCount);

	// Finish with setting up the suggestionId param
	app.param("suggestionId", suggestions.suggestion);
};