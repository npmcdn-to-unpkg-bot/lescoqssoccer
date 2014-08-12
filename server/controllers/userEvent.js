'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    UserEvent = mongoose.model('UserEvent'),
    _ = require('lodash');


/**
 * Find event by id
 */
exports.userEvent = function(req, res, next, id) {
    UserEvent.load(id, function(err, userEvent) {
        if (err) return next(err);
        if (!userEvent) return next(new Error('Failed to load event ' + id));
        req.userEvent = userEvent;
        next();
    });
};

/**
 * Create a userEvent
 */
exports.create = function(req, res) {

    var userEvent = new UserEvent(req.body);
    userEvent.user = req.user;
    
    userEvent.save(function(err) {
        if (err) {
            return res.send('agenda', {
                errors: err.errors,
                userEvent: userEvent
            });
        } else {
            res.jsonp(userEvent);
        }
    });
};

/**
 * Update a userEvent
 */
exports.update = function(req, res) {
    
    var userEvent = req.userEvent;
    var userEvent = _.extend(userEvent, req.body);

    userEvent.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                userEvent: userEvent
            });
        } else {
            res.jsonp(userEvent);
        }
    });
};

/**
 * Delete an userEvent
 */
exports.destroy = function(req, res) {
    var userEvent = req.userEvent;

    userEvent.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                userEvent: userEvent
            });
        } else {
            res.jsonp(userEvent);
        }
    });
};

/**
 * Show an userEvent
 */
exports.show = function(req, res) {
    res.jsonp(req.userEvent);
};

/**
 * List of userEvent
 */
exports.all = function(req, res) {
    UserEvent.find().sort('-created').exec(function(err, userEvent) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(userEvent);
        }
    });
};