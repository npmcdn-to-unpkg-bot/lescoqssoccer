'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Article = mongoose.model('Article'),
	Album = mongoose.model('Album'),
	UserEvent = mongoose.model('UserEvent'),
	User = mongoose.model('User'),
	Suggestion = mongoose.model('Suggestion'),
	_ = require('lodash');

/**
 * User data
 */
exports.getAllUserData = function(req, res) {

	var userData = {
		albums: null,
		articles: null,
		userEvents: null,
		suggestions: null
	};

	var responseObject = {
		content: [],
		users: null
	}

	Article.find()
		.sort('-created')
		.populate('user', '_id name username avatar').exec()
		.then(function(articles, err) {

			if (err) {

				res.render('error', {
					status: 500
				});

			} else {

				userData.articles = articles;

				return Album.find()
					.sort('-created')
					.populate('user', '_id name username avatar').exec();
			}

		}).then(function(albums, err) {

			if (err) {

				res.render('error', {
					status: 500
				});

			} else {

				userData.albums = albums;

				return UserEvent.find()
					.sort('-created')
					.populate('user', '_id name username avatar').exec();
			}

		}).then(function(userEvent, err) {

			if (err) {

				res.render('error', {
					status: 500
				});

			} else {

				userData.userEvents = userEvent;

				return Suggestion.find({})
					.sort('-created')
					.populate('user', '_id name username avatar').exec();
			}

		}).then(function(suggestions, err) {

			if (err) {

				res.render('error', {
					status: 500
				});

			} else {
				return User.find({}, '-password -salt -hashed_password -__v -provider').exec();
			}
		}).then(function(users, err) {
			if (err) {
				res.render('error', {
					status: 500
				});
			} else {

				responseObject.users = users;
				var formattedDatas = formatUserData(userData);
				responseObject.content = formattedDatas.content;
				res.jsonp(responseObject);
			}
		});
};

var formatUserData = function(userData) {

	var formattedDatas = {
		content: []
	};

	var sortedDatas = {
		content: []
	};

	_.each(userData.articles, function(article) {
		formattedDatas.content.push(article);
	});

	_.each(userData.albums, function(album) {
		formattedDatas.content.push(_.defaults({
			type: "album"
		}, album._doc));
	});

	_.each(userData.userEvents, function(userEvent) {
		if (userEvent._doc.subType !== "euroMatch") {
			formattedDatas.content.push(_.defaults({
				type: "userEvent"
			}, userEvent._doc));
		}
	});

	_.each(userData.suggestions, function(suggestion) {
		formattedDatas.content.push(_.defaults({
			type: "suggestion"
		}, suggestion._doc));
	});

	sortedDatas.content = _.sortBy(formattedDatas.content, function(item) {
		return item.created || item.startsAt;
	});

	sortedDatas.content.slice(0, 30);

	return sortedDatas;
};