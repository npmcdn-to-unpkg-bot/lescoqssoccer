'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Article Schema
 */
var ArticleSchema = new Schema({
    	created: {
        		type: Date,
        		default: Date.now
    	},
    	title: {
        		type: String,
        		default: '',
        		trim: true
    	},
    	content: {
        		type: String,
        		default: '',
        		trim: true
    	},
    	category: {
        		type: String,
        		default: ''
    	},
    	image: {
        		type: String,
        		default: ''
    	},
    	user: {
        		type: Schema.ObjectId,
        		ref: 'User'
    	},
    	comments: [ new Schema({
    		created: {
	        		type: Date,
	        		default: Date.now
	    	},
    		user: {
	        		type: Schema.Types.ObjectId,
	        		ref: 'User'
	    	},
	    	content: {
	        		type: String,
	        		default: ''
	    	}
	})]
});
/**
 * Validations
 */
ArticleSchema.path('title').validate(function(title) {
    	return title.length;
}, 'Title cannot be blank');
/**
 * Statics
 */
ArticleSchema.statics.load = function(id, cb) {
   	this.findOne({
        _id: id
    }).populate('user', 'name username').populate( 'comments.user', 'name username avatar', null, { sort: { 'created': -1 } }).exec(cb);
};

mongoose.model('Article', ArticleSchema);