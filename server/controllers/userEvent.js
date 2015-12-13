'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var UserEvent = mongoose.model('UserEvent');
var _ = require('lodash');

/**
 * Find event by id
 */
exports.show = function(req, res) {
	UserEvent.findOne({
			"_id": req.params.userEventId
		})
		.populate('user', '_id name username avatar')
		.populate('guest', '_id name username avatar')
		.populate('guestUnavailable', '_id name username avatar')
		.populate('comments.user', '_id name username avatar')
		.populate('comments.replies.user', '_id name username avatar')
		.exec(function(err, userEvent) {
			if (err) return next(err);
			if (!userEvent) return next(new Error('Failed to load event ' + userEventId));
			res.jsonp(userEvent);
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
exports.update = function(req, res, next) {
	UserEvent.load(req.body._id, function(err, userEvent) {
		if (err) return next(err);

		delete req.body.user
		userEvent = _.extend(userEvent, req.body);
		userEvent.guest = _.pluck(req.body.guest, '_id');
		userEvent.guestUnavailable = _.pluck(req.body.guestUnavailable, '_id');

		userEvent.save(function(err) {
			if (err) {
				console.warn(err);
				return res.send('users/signup', {
					errors: err.errors,
					userEvent: userEvent
				});
			} else {
				res.jsonp(userEvent);
			}
		});
	});

};

/**
 * Delete an userEvent
 */
exports.destroy = function(req, res) {
	var userEvent = new UserEvent(req.userEvent);
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
 * List of userEvent
 */
exports.all = function(req, res) {
	UserEvent.find({
			startsAt: {
				"$gte": new Date()
			}
		})
		.sort('startsAt')
		.limit(40)
		.populate('user', 'name username avatar')
		.populate('guest', 'name username avatar')
		.populate('guestUnavailable', 'name username avatar')
		.exec(function(err, userEvent) {
			if (err) {
				res.render('error', {
					status: 500
				});
			} else {
				res.jsonp(userEvent);
			}
		});
};