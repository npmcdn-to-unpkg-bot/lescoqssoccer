
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Suggestion = mongoose.model('Suggestion'),
	_ = require('lodash');

exports.startScript = function() {
	Suggestion.find().exec(function(err, suggestions) {
		var no, blank;
		_.each(suggestions, function(suggestion){
			no = suggestion.no;
			suggestion.no = suggestion.blank;
			suggestion.blank = no;

			suggestion.save(function(err) {
				console.warn("mis à jour")			
			});
		});
	});
};