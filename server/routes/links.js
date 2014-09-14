'use strict';

// Articles routes use links controller
var links = require('../controllers/links');
var authorization = require('./middlewares/authorization');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
	if (req.link.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(app) {

    app.get('/links', links.all);
    app.post('/links', authorization.requiresLogin, links.create);
    app.get('/links/:linkId', links.show);
    app.put('/links/:linkId', authorization.requiresLogin, hasAuthorization, links.update);
    app.del('/links/:linkId', authorization.requiresLogin, hasAuthorization, links.destroy);

    // Finish with setting up the linkId param
    app.param('linkId', links.link);

};