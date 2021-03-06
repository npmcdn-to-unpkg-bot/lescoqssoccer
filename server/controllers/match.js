var mongoose = require("mongoose");
var _ = require("underscore");
var Match = mongoose.model("Match");
var User = mongoose.model("User");

exports.match = function(req, res, next) {
	Match.findOne({
			_id: req.params.id
		})
		.populate("bets.user", "_id name username avatar")
		.populate("comments.user", "_id name username avatar")
		.populate("comments.replies.user", "_id name username avatar")
		.populate("user", "_id name username avatar")
		.exec(function(err, match) {
			if (err) return next(err);
			req.match = match;
			next();
		})
};

exports.findAllMatchs = function(req, res) {

	var query = (req.query.endedMatch === "true") ? {
		startsAt: {
			"$lt": new Date()
		}
	} : {};

	Match.find(query)
		.sort("startsAt")
		.populate("bets.user", "_id name username avatar")
		.populate("user", "_id name username avatar")
		.exec(function(err, matchs) {
			res.send(matchs);
		});
};

exports.findMatchById = function(req, res) {
	Match.findOne({
			_id: req.params.id
		})
		.populate("bets.user", "_id name username avatar")
		.populate("comments.user", "_id name username avatar")
		.populate("comments.replies.user", "_id name username avatar")
		.populate("user", "_id name username avatar")
		.exec(function(err, match) {
			if (err) console.log("error finding match: " + err);
			res.send(match);
		})
};

exports.addMatch = function(req, res) {
	var newMatch = req.body;
	newMatch.user = req.user;
	Match.create(newMatch, function(err, match) {
		if (err) console.log("error: " + err);
		res.send(match);
	});
};

exports.updateMatch = function(req, res) {
	var match = req.match;
	match = _.extend(match, req.body);
	match.save(function(err) {
		console.warn(err)
		if (err) {
			console.log("Error when trying to save match: " + err);
		}

		if (match.scoreHome !== undefined && match.scoreAway !== undefined) {
			updateUserScores();
		}

		res.send(match);
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

var updateUserScores = function() {
	var query = {};
	var _users = [];
	var canUpdateUsers = true;

	User.find({}).exec().then(function(users, err) {
		if (err) {
			console.warn("Error when trying to fetch users: " + err);
		} else {

			// keep users in array to updates
			_users = users;

			//fetch matchs
			return Match.find({
					startsAt: {
						"$lt": new Date()
					},
					scoresUpdated: {
						$exists: false
					}
				})
				.sort("-created")
				.exec()

		}
	}).then(function(matchs, err) {
		if (err) {
			console.warn("Error when trying to fetch matchs: " + err)
		} else {
			_.each(matchs, function(match) {

				if (match.scoreHome !== undefined && match.scoreAway !== undefined) {

					console.warn("Match to update")
					_.each(_users, function(user) {
						if (!user.euroPoints) {
							user.euroPoints = 0;
						}

						var userPointOfMatch = getPointsFromMatch(match, user);
						console.warn(userPointOfMatch);
						user.euroPoints += userPointOfMatch;
					});

					match.scoresUpdated = true;
					match.save(function(error) {
						if (err) {
							console.warn("Error when trying to update match... " + match.home + " - " + match.away);
							canUpdateUsers = false;
						} else {
							console.warn("Match updated succefully");
						}
					})

				} else {
					console.warn("Match: " + match.home + " - " + match.away + " has no scores yet!")
				}
			});

			if (canUpdateUsers) {
				_.each(_users, function(user) {
					user.save(function(err) {
						if (err) {
							console.warn("Error when trying to update user scores : " + err);
						} else {
							console.warn("User " + user.username + " has been updated successfully");
						}
					})
				});
			}
		}
	});

};

var getPointsFromMatch = function(match, user) {

	// Points distribution
	var MAX_GOAL_DIFFERENCE = 2;

	var GOOD_SCORE = 5;
	var GOOD_WINNER = 2;
	var ACCEPTED_GOAL_DIFFERENCE = 1;

	/* Winner code:
	 1 for home team
	 2 for away team
	 -1 for nul score
	*/

	var points = 0;
	var scoreHome = match.scoreHome;
	var scoreAway = match.scoreAway;
	var winner = (scoreHome > scoreAway) ? 1 : ((scoreHome < scoreAway) ? 2 : -1);
	var goalDifference = scoreHome - scoreAway;

	var _userbets = _.filter(match.bets, function(bet) {
		return bet.user.toString() === user._id.toString()
	});
	var userBet = (_userbets.length > 0) ? _userbets[_userbets.length - 1] : null

	if (userBet) {

		console.warn("User has bet on the match");

		var userScoreHome = userBet.homeScore;
		var userScoreAway = userBet.awayScore;
		var userWinner = (userScoreHome > userScoreAway) ? 1 : ((userScoreHome < userScoreAway) ? 2 : -1);
		var userGoalDifference = userScoreHome - userScoreAway;

		if (userScoreHome === scoreHome && userScoreAway === scoreAway) {
			points += GOOD_SCORE;
		} else {

			if (userWinner === winner) {
				points += GOOD_WINNER;
			}

			if (goalDifference === userGoalDifference) {
				points += ACCEPTED_GOAL_DIFFERENCE;
			}
		}

	} else {
		console.warn("User has not bet on the match");
	}

	if (match.type === "SF") {
		return points * 2;
	}

	if (match.type === "FINALE") {
		return points * 3;
	}

	return points;
};