'use strict';

// userEvent routes use userEvent controller
var userEvents = require('../controllers/userEvent');
var authorization = require('./middlewares/authorization');

// userEvent authorization helpers
var hasAuthorization = function(req, res, next) {
	if (req.userEvent.user.toString() !== req.user._id.toString()) {
		return res.send(401, 'User is not authorized');
	}
	next();
};

module.exports = function(app) {
	app.get('/userEvent/:userEventId', userEvents.show);
	app.get('/userEvent', userEvents.all);
	app.post('/userEvent', authorization.requiresLogin, userEvents.create);
	app.put('/userEvent/:userEventId', userEvents.update);
	app.del('/userEvent/:userEventId', userEvents.destroy);
};