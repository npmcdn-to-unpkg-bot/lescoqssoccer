
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Article = mongoose.model('Article'),
	_ = require('lodash');

exports.startScript = function() {
	Article.find().exec(function(err, articles) {

		_.each(articles, function(article){

			if(article.videoLink){
				article.videoLink.replace('embed', 'v');
				article.save(function(err) {
					console.warn("mis à jour")			
				});
			}
		});
	});
};