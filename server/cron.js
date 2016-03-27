'use strict';

var CronJob = require('cron').CronJob;
var users = require('./controllers/users');
var suggestions = require('./controllers/suggestions');

exports.startCron = function() {

	suggestions.closeVotes();

	new CronJob('00 30 00 * * 7', function() {

			// Runs every sunday at 00h30
			users.incrementUsersPoints();
			users.calculatePopularity();

			suggestions.closeVotes();

		}, function() {

			// This function is executed when the job stops
			console.warn("Cron job executed");

		},
		true /* Start the job right now */
		// timeZone /* Time zone of this job. */
	);

};