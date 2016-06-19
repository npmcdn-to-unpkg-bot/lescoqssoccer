"use strict";

// Articles routes use articles controller
var articles = require("../controllers/articles");
var authorization = require("./middlewares/authorization");

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
	if (req.article.user.id !== req.user.id) {
		return res.send(401, "User is not authorized");
	}
	next();
};

module.exports = function(app) {

	app.get("/articles/:articleId", articles.show);
	app.get("/articles", articles.all);
	app.post("/articles", authorization.requiresLogin, articles.create);
	app.put("/articles/:articleId", authorization.requiresLogin, articles.update);
	app.delete("/articles/:articleId", authorization.requiresLogin, articles.destroy);

	//get articles count
	app.get("/articlesCount", articles.getItemsCount);

	// Finish with setting up the articleId param
	app.param("articleId", articles.article);

};