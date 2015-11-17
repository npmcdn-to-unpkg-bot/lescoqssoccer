'use strict';

// userEvent routes use userEvent controller
var userEvent = require('../controllers/userEvent');
var authorization = require('./middlewares/authorization');

// userEvent authorization helpers
var hasAuthorization = function(req, res, next) {
	if (req.userEvent.user.toString() !== req.user._id.toString()) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(app) {

    app.get('/userEvent', userEvent.all);
    app.post('/userEvent', authorization.requiresLogin, userEvent.create);
    app.get('/userEvent/:userEventId', userEvent.show);
    app.put('/userEvent/:userEventId', userEvent.update);
    app.del('/userEvent/:userEventId', userEvent.destroy);

    // Finish with setting up the userEventId param
    app.param('userEventId', userEvent.userEvent);

};