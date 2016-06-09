'use strict';

var CronJob = require('cron').CronJob;
var users = require('./controllers/users');
var suggestions = require('./controllers/suggestions');
var matchs = require('./controllers/match');

exports.startCron = function() {

	// Runs every sunday at 00h30
	new CronJob('00 30 00 * * 7', function() {
			//users.incrementUsersPoints();
			//users.calculatePopularity();
			suggestions.closeVotes();
		}, function() {
			// This function is executed when the job stops
			console.warn("Cron job executed");
		},
		true /* Start the job right now */
		// timeZone /* Time zone of this job. */
	);

	// Runs every day at 00h33
	new CronJob('00 33 00 * * *', function() {
			matchs.updateUserScores();
		}, function() {
			console.warn("Cron job executed");
		},
		true
	);
};