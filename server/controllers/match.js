var mongoose = require('mongoose');
var _ = require('underscore');
var Match = mongoose.model('Match');
var User = mongoose.model('User');

exports.findAllMatchs = function(req, res) {
	var query = (req.query.userId) ? {
		user: req.query.userId
	} : {};

	Match.find(query)
		.sort('startsAt')
		.populate('bets.user', '_id name username avatar')
		.populate('user', '_id name username avatar')
		.exec(function(err, matchs) {
			res.send(matchs);
		});
};

exports.findEndMatchs = function(req, res) {
	Match.find({
			startsAt: {
				"$gte": new Date()
			}
		})
		.sort('startsAt')
		.populate('bets.user', '_id name username avatar')
		.populate('user', '_id name username avatar')
		.exec(function(err, matchs) {
			res.send(matchs);
		});
};

exports.findMatchById = function(req, res) {
	Match.findOne({
			_id: req.params.id
		})
		.populate('bets.user', '_id name username avatar')
		.populate('comments.user', '_id name username avatar')
		.populate('comments.replies.user', '_id name username avatar')
		.populate('user', '_id name username avatar')
		.exec(function(err, match) {
			if (err) console.log("error finding match: " + err);
			res.send(match);
		})
};

exports.addMatch = function(req, res) {
	var newMatch = req.body;
	newMatch.user = req.user;

	console.log("Adding Match: " + JSON.stringify(newMatch));
	Match.create(newMatch, function(err, match) {
		if (err) console.log("error: " + err);
		res.send(match);
	});
};

exports.updateMatch = function(req, res) {
	Match.findById(req.params.id, function(err, match) {
		if (err) {
			console.log("error: " + err)
			res.send({
				error: err
			});
		} else {
			delete req.body._id;
			delete req.body.user;

			var bets = [];
			_.each(req.body.bets, function(bet) {
				if (bet.user._id) {
					bets.push({
						_id: bet._id,
						awayScore: bet.awayScore,
						created: bet.created,
						homeScore: bet.homeScore,
						user: bet.user._id
					})
				} else {
					bets.push(bet);
				}
			});
			req.body.bets = bets;
			match = _.extend(match, req.body);
			match.save(function(err, match, numAffected) {
				console.warn(err)
				if (err) {
					console.log("Error when trying to save match: " + err);
				}
				res.send(match);
			});
		}
	});
};

exports.deleteMatch = function(req, res) {
	Match.findById(req.params.id, function(err, doc) {
		if (!err) {
			res.send(req.body);
		} else {
			console.log("error: " + err);
		}
	})
};

exports.updateUserScores = function() {
	var query = {};

	Match.find({
			startsAt: {
				"$gte": new Date()
			}
		})
		.sort('-created')
		.exec(function(err, matchs) {

			User.find({}).exec(function(err, users) {
				if (err) {
					console.warn("err: " + err);
				} else {

					_.each(users, function(user) {
						var newVal = "30";
						user.popularity = newVal;
					});
				}
			});
		});
};