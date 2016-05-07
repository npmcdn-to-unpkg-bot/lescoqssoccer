'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Article = mongoose.model('Article'),
	Album = mongoose.model('Album'),
	UserEvent = mongoose.model('UserEvent'),
	Suggestion = mongoose.model('Suggestion'),
	_ = require('lodash');

/**
 * User data
 */
exports.getAllUserData = function(req, res) {

	var userData = {
		albums: null,
		articles: null,
		userEvent: null,
		suggestions: null
	}

	Article.find()
		.sort('-created')
		.populate('user', 'name username avatar')
		.populate('comments.user', 'name username avatar')
		.populate('comments.replies.user', 'name username avatar').exec()
	.then(function(articles, err) {

		if (err) {

			res.render('error', {
				status: 500
			});

		} else {

			userData.articles = articles;

			return Album.find()
				.sort('-created')
				.populate('user').exec();
		}

	}).then(function(albums, err) {

		if (err) {

			res.render('error', {
				status: 500
			});

		} else {

			userData.albums = albums;

			return Album.find()
				.sort('-created')
				.populate('user').exec();
		}

	}).then(function(albums, err) {

		if (err) {

			res.render('error', {
				status: 500
			});

		} else {

			userData.albums = albums;

			return UserEvent.find()
				.sort('startsAt')
				.populate('user', 'name username avatar')
				.populate('guest', 'name username avatar')
				.populate('guestUnavailable', 'name username avatar')
				.exec();
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
				.populate('user', 'name username avatar')
				.exec();
		}

	}).then(function(suggestions, err) {

		if (err) {

			res.render('error', {
				status: 500
			});

		} else {

			userData.suggestions = suggestions;
			res.jsonp(formatUserData(userData));
		}
	});
};

var formatUserData = function(userData){

	var formattedDatas = {
		content: []
	}

	_.each(userData.articles, function(article){
		formattedDatas.content.push(article);
	});

	_.each(userData.albums, function(album){
		album.type = "album";
		formattedDatas.content.push(album);
	});

	_.each(userData.userEvents, function(userEvent){
		userEvent.type = "userEvent";
		formattedDatas.content.push(userEvent);
	});

	_.each(userData.suggestions, function(suggestion){
		suggestion.type = "suggestion";
		formattedDatas.content.push(suggestion);
	});

	_.sortBy(formattedDatas.content, function(item){
		return item.created;
	})

	return formattedDatas;
};