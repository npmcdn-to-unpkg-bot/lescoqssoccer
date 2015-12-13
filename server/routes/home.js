'use strict';

// Articles routes use suggestions controller
var home = require('../controllers/home');
var authorization = require('./middlewares/authorization');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
	if (req.suggestion.user.id !== req.user.id) {
		return res.send(401, 'User is not authorized');
	}
	next();
};

module.exports = function(app) {
	app.get('/home', home.getAllUserData);
};