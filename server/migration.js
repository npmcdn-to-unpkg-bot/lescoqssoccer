/**
 * Module dependencies.
 */
var express = require('express'),
	fs = require('fs'),
	passport = require('passport'),
	logger = require('mean-logger');

// Load configurations
// Set the node enviornment variable if not set before
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Initializing system variables
var config = require('../config/config'),
	mongoose = require('mongoose');
_ = require('lodash');

// Bootstrap db connection
var db = mongoose.connect(config.db);

// Bootstrap models
var models_path = __dirname + '/models';
var walk = function(path) {
	fs.readdirSync(path).forEach(function(file) {
		var newPath = path + '/' + file;
		var stat = fs.statSync(newPath);
		if (stat.isFile()) {
			if (/(.*)\.(js$|coffee$)/.test(file)) {
				require(newPath);
			}
		} else if (stat.isDirectory()) {
			walk(newPath);
		}
	});
};
walk(models_path);

// Bootstrap passport config
require('../config/passport')(passport);

var app = express();

// Express settings
require('../config/express')(app, passport, db);

var Article = mongoose.model('Article'),
	Suggestion = mongoose.model('Suggestion'),
	Album = mongoose.model('Album'),
	Conversation = mongoose.model('Conversation'),
	UserEvent = mongoose.model('UserEvent'),
	User = mongoose.model('User');

/*
Script de migration pour remplacer l'url des videos youtube de embed => v
*/
var migrateArticles = function() {
	Article.find().exec(function(err, articles) {
		_.each(articles, function(article) {
			if (article.videoLink) {
				article.videoLink.replace('embed', 'v');
				article.save(function(err) {
					if (err) {
						console.warn(err);
					} else {
						console.warn("Mise à jour de l'article " + JSON.stringify(article));
					}
				});
			}
		});
	});
};

/*
	Script de migration pour les suggestions, afin de remplacer l'id du user par une référence vers l'object id
*/
var migrateSuggestions = function() {
	Suggestion.find().exec(function(err, suggestions) {
		_.each(suggestions, function(suggestion) {

			var yes = [];
			var no = [];
			var blank = [];

			_.each(suggestion.yes, function(userId, ohers) {
				yes.push({
					user: userId
				});
			});
			suggestion.yes = yes;

			_.each(suggestion.blank, function(userId) {
				blank.push({
					user: userId
				});
			});
			suggestion.blank = blank;

			_.each(suggestion.no, function(userId) {
				no.push({
					user: userId
				});
			});
			suggestion.no = no;

			suggestion.save(function(err) {
				if (err) {
					console.warn(err);
				} else {
					console.warn("Mise à jour de la suggestion : " + JSON.stringify(suggestion));
				}
			});
		});
	});
};

migrateSuggestions();