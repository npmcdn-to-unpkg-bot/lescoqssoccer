'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Link = mongoose.model('Link'),
    _ = require('lodash');


/**
 * Find link by id
 */
exports.link = function(req, res, next, id) {
    link.load(id, function(err, link) {
        if (err) return next(err);
        if (!link) return next(new Error('Failed to load link ' + id));
        req.link = link;
        next();
    });
};

/**
 * Create a link
 */
exports.create = function(req, res) {

    var link = new Link(req.body);
    link.user = req.user;

    link.save(function(err) {
        console.log(err);
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                link: link
            });
        } else {
            res.jsonp(link);
        }
    });
};

/**
 * Update a link
 */
exports.update = function(req, res) {
    var link = req.link;

    link = _.extend(link, req.body);
    link.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                link: link
            });
        } else {
            res.jsonp(link);
        }
    });
};

/**
 * Delete an link
 */
exports.destroy = function(req, res) {
    var link = req.link;

    link.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                link: link
            });
        } else {
            res.jsonp(link);
        }
    });
};

/**
 * Show an link
 */
exports.show = function(req, res) {
    res.jsonp(req.link);
};

/**
 * List of links
 */
exports.all = function(req, res) {
    Link.find().sort('-created').populate('user', 'name username').exec(function(err, links) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(links);
        }
    });
};