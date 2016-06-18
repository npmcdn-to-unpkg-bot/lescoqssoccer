"use strict";

/**
 * Module dependencies.
 */
var mongoose = require("mongoose"),
	Schema = mongoose.Schema;

/**
 * Link Schema
 */
var ConversationSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	users: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		require: false
	}],
	messages: [new Schema({
		created: {
			type: Date,
			default: Date.now
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		content: {
			type: String,
			default: ""
		}
	})]
});

/**
 * Statics
 */
ConversationSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).populate("user").exec(cb);
};

mongoose.model("Conversation", ConversationSchema);