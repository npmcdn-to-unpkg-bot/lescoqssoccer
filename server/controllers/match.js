var mongoose = require('mongoose');
var _ = require('underscore');
var Match = mongoose.model('Match');

exports.findAllMatchs = function(req, res) {

	var perPage = req.query.perPage;
	var page = req.query.page;
	var query = (req.query.userId) ? {
		user: req.query.userId
	} : {};

	Match.find(query)
		.sort('-created')
		.populate('user', '_id name username avatar')
		.limit(perPage)
		.skip(perPage * page).exec(function(err, albums) {
			res.send(albums);
		});
};

exports.findMatchById = function(req, res) {
	Match.findOne({
			_id: req.params.id
		})
		.populate('comments.user', '_id name username avatar')
		.populate('comments.replies.user', '_id name username avatar')
		.populate('user').exec(function(err, match) {
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
			res.send({error: err});
		} else {
			delete req.body._id;
			delete req.body.user;

			_.extend(match, req.body);
			match.save(function(err, match, numAffected) {
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