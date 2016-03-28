'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	_ = require('lodash'),
	User = mongoose.model('User');

/**
 * Auth callback
 */
exports.authCallback = function(req, res) {
	res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
	res.render('users/signin', {
		title: 'Signin',
		message: req.flash('error')
	});
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
	res.render('users/signup', {
		title: 'Sign up',
		user: new User()
	});
};

/**
 * Logout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};

/**
 * Session
 */
exports.session = function(req, res) {

	//Update the last connection date of user when creating session
	User.update({_id: req.user._id}, 
		{$set: { lastConnectionDate: new Date()}}, 
		{upsert: false}, function(err){
			res.redirect('/');
	});
};

/**
 * Create user
 */
exports.create = function(req, res, next) {
	var user = new User(req.body);
	var message = null;

	user.provider = 'local';
	user.save(function(err) {
		if (err) {
			switch (err.code) {
				case 11000:
				case 11001:
					message = "Pseudo déjà utilisé";
					break;
				default:
					message = "Veuillez renseigner l'ensemble des champs";
			}

			return res.render('users/signup', {
				message: message,
				user: user
			});
		}
		req.logIn(user, function(err) {
			if (err) return next(err);
			return res.redirect('/');
		});
	});
};

exports.update = function(req, res, next) {

	var user = req.user;

	user = _.extend(user, req.body);
	user.save(function(err) {
		if (err) {
			return res.send('users/signup', {
				errors: err.errors,
				user: user
			});
		} else {
			res.jsonp(user);
		}
	});
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
	User.findOne({
		_id: id
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.profile = user;
		next();
	});
};

exports.findOne = function(req, res) {
	res.jsonp(req.profile);
};

/**
 * Return all users
 */
exports.team = function(req, res) {

	User.find({}, '-password -salt -hashed_password -__v -provider').exec(function(err, users) {
		if (err) {
			res.render('error', {
				status: 500
			});
		} else {
			res.jsonp(users);
		}
	});

};

/**
 * Increment coins of all users (call by cron)
 ***/
exports.incrementUsersPoints = function() {

	User.update({}, {
		$inc: {
			coins: 10
		}
	}, function(err, affectedRows) {

		if (err) {
			console.warn("err: " + err);
		} else {
			console.warn("Count of updated users " + affectedRows);
		}

	});

};


/**
 * Calculate popularity of users (call by cron)
 ***/
exports.calculatePopularity = function() {

	User.find({}).exec(function(err, users) {

		if (err) {
			console.warn("err: " + err);
		} else {

			_.each(users, function(user){
				var newVal = "30";
				user.popularity = newVal;
			});
		}
	});

};