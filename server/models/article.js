"use strict";
/**
 * Module dependencies.
 */
var mongoose = require("mongoose"),
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
		default: "",
		trim: true
	},
	type: {
		type: String,
		default: "standard"
	},
	content: {
		type: String,
		trim: true,
		default: ""
	},
	description: {
		type: String
	},
	linkAdress: [new Schema({
		value: {
			type: String
		},
		adress: {
			type: String
		}
	})],
	audioLink: {
		type: String,
	},
	videoLink: {
		type: String,
	},
	yes: [new Schema({
		created: {
			type: Date,
			default: Date.now
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User"
		}})
	],
	no: [new Schema({
		created: {
			type: Date,
			default: Date.now
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User"
		}})
	],
	blank: [new Schema({
		created: {
			type: Date,
			default: Date.now
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User"
		}})
	],
	categories: [new Schema({
		id: {
			type: String,
			default: ""
		},
		value: {
			type: String,
			default: ""
		}
	})],
	image: {
		type: String
	},
	user: {
		type: Schema.ObjectId,
		ref: "User"
	},
	comments: [new Schema({
		created: {
			type: Date,
			default: Date.now
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User"
		},
		content: {
			type: String,
			default: ""
		},
		replies: [new Schema({
			created: {
				type: Date,
				default: Date.now
			},
			user: {
				type: Schema.Types.ObjectId,
				ref: "User"
			},
			content: {
				type: String,
				default: ""
			}
		})]
	})]
});
/**
 * Validations
 */
ArticleSchema.path("title").validate(function(title) {
	return title.length;
}, "Title cannot be blank");
/**
 * Statics
 */
ArticleSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).populate("user", "name username").populate("comments.user", "name username avatar", null, {
		sort: {
			"created": -1
		}
	}).exec(cb);
};

mongoose.model("Article", ArticleSchema);