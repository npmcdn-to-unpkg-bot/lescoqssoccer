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
	Parameter = mongoose.model('Parameter'),
	User = mongoose.model('User'),
	Match = mongoose.model('Match'),
	EuroData = require('./euro.json');

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

var addParameters = function() {
	var parameter = new Parameter({
		articleCategories: [{
			id: "1",
			value: "Info",
			active: true
		}, {
			id: "2",
			value: "Connerie",
			active: true
		}, {
			id: "3",
			value: "Sport",
			active: true
		}, {
			id: "4",
			value: "Art",
			active: true
		}, {
			id: "5",
			value: "Trompette",
			active: true
		}, {
			id: "6",
			value: "Poney",
			active: true
		}]
	});
	parameter.save(function(err) {
		if (err) {
			console.warn("Error when adding params: " + err);
		} else {
			console.warn("Successfuly add params");
		}
	});
};

var addMatchs = function() {
	var matchs = EuroData.matchs;
	var teams = EuroData.teams;
	var currentMatch;
	var userEvent;
	_.each(matchs, function(match) {
		currentMatch = new Match(match);
		currentMatch.save(function(err, _matchObject) {
			if (err) {
				console.warn("Error when adding match: " + err);
			} else {
				console.warn("Successfuly add match");
				var homeName = getNameOfCountryCode(teams, match.home);
				var awayName = getNameOfCountryCode(teams, match.away);
				var userEvent = new UserEvent({
					title:  homeName + " - " + awayName,
					type: 'inverse',
					eventType: "other",
					content: "Match de l'euro 2016 du groupe " + match.type,
					startsAt: match.startsAt,
					endsAt: match.startsAt,
					editable: false,
					deletable: false,
					incrementsBadgeTotal: true,
					guest: [],
					subType: "euroMatch",
					matchId: _matchObject._id

				});
				userEvent.save(function(err) {
					if (err) {
						console.warn("Error when adding userEvent: " + err);
					} else {
						console.warn("Successfuly add userEvent");
					}
				});
			}
		});
	});
};

var getNameOfCountryCode = function(teams, code){
	var name = "";
	_.each(teams, function(team){
		if(team.code == code){
			name = team.name;
		}
	});

	return name;
};

// addParameters();
addMatchs();