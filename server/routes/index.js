'use strict';

module.exports = function(app) {

	// Home route
	var index = require('../controllers/index');
	app.get('/', function(req, res) {
		if (!req.isAuthenticated())
			res.render('users/signin.jade');
		else index.render(req, res);
	});
};