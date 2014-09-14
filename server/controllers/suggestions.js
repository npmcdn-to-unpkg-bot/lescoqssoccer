'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Suggestion = mongoose.model('Suggestion'),
    _ = require('lodash');


/**
 * Find suggestion by id
 */
exports.suggestion = function(req, res, next, id) {
    Suggestion.load(id, function(err, suggestion) {
        if (err) return next(err);
        if (!suggestion) return next(new Error('Failed to load suggestion ' + id));
        req.suggestion = suggestion;
        next();
    });
};

/**
 * Create a suggestion
 */
exports.create = function(req, res) {

    var suggestion = new Suggestion(req.body);
    suggestion.user = req.user;

    suggestion.save(function(err) {
        console.log(err);
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                suggestion: suggestion
            });
        } else {
            res.jsonp(suggestion);
        }
    });
};

/**
 * Update a suggestion
 */
exports.update = function(req, res) {
    var suggestion = req.suggestion;

    suggestion = _.extend(suggestion, req.body);
    suggestion.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                suggestion: suggestion
            });
        } else {
            res.jsonp(suggestion);
        }
    });
};

/**
 * Delete an suggestion
 */
exports.destroy = function(req, res) {
    var suggestion = req.suggestion;

    suggestion.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                suggestion: suggestion
            });
        } else {
            res.jsonp(suggestion);
        }
    });
};

/**
 * Show a suggestion
 */
exports.show = function(req, res) {
    res.jsonp(req.suggestion);
};

/**
 * List of suggestions
 */
exports.all = function(req, res) {
    Suggestion.find().sort('-created').populate('user', 'name username').exec(function(err, suggestions) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(suggestions);
        }
    });
};