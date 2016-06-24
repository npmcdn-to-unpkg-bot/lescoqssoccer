"use strict";

/**
 * Module dependencies.
 */
var mongoose = require("mongoose"),
	Article = mongoose.model("Article"),
	Album = mongoose.model("Album"),
	UserEvent = mongoose.model("UserEvent"),
	User = mongoose.model("User"),
	Suggestion = mongoose.model("Suggestion"),
	Comment = mongoose.model("Comment"),
	_ = require("lodash");

/**
 * User data
 */
exports.getAllUserData = function(req, res) {

	var query = (req.query.userId) ? {
		user: req.query.userId
	} : {};

	var userData = {
		albums: [],
		articles: [],
		userEvents: [],
		suggestions: [],
		comments: []
	};

	var responseObject = {
		content: [],
		users: []
	}

	Article.find(query, "-comments")
		.sort("-created")
		.populate("user", "_id name username avatar").exec()
		.then(function(articles, err) {
			if (err) {
				res.render("error", {
					status: 500
				});
			} else {
				userData.articles = articles;
				return Album.find(query, "-comments")
					.sort("-created")
					.populate("user", "_id name username avatar").exec();
			}
		}).then(function(albums, err) {
			if (err) {
				res.render("error", {
					status: 500
				});
			} else {
				userData.albums = albums;
				return UserEvent.find(query, "-comments")
					.sort("-created")
					.populate("user", "_id name username avatar").exec();
			}
		}).then(function(userEvent, err) {
			if (err) {
				res.render("error", {
					status: 500
				});
			} else {
				userData.userEvents = userEvent;
				return Suggestion.find(query)
					.sort("-created")
					.populate("user", "_id name username avatar").exec();
			}
		}).then(function(suggestions, err) {
			if (err) {
				res.render("error", {
					status: 500
				});
			} else {
				userData.suggestions = suggestions;
				return User.find({}, "-password -salt -hashed_password -__v -provider -readAlbums -readVotes -conversations").exec();
			}
		}).then(function(users, err) {
			if (err) {
				res.render("error", {
					status: 500
				});
			} else {

				responseObject.users = users;
				return Comment.find({}).populate("user", "_id name username avatar").exec();
			}
		}).then(function(comments, err) {
			if (err) {
				res.render("error", {
					status: 500
				});
			} else {
				if (!req.query.userId) {
					userData.comments = comments;
				}
				responseObject.content = formatUserData(userData);
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

	_.each(userData.comments, function(comment) {
		formattedDatas.content.push(_.defaults({
			type: "comment"
		}, comment._doc));
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

	return sortedDatas.content.slice(Math.max(sortedDatas.content.length - 31, 0), sortedDatas.content.length);
};
