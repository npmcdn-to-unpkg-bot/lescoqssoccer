"use strict";

/**
 * Module dependencies.
 */
var mongoose = require("mongoose"),
	Schema = mongoose.Schema;


/**
 * Article Schema
 */
var CommunitySchema = new Schema({
	name: String,
	users: [{
		user: {
			type: Schema.ObjectId,
			ref: "User"
		}
	}]
});

/**
 * Statics
 */
CommunitySchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).populate("user", "name username").exec(cb);
};

mongoose.model("Community", CommunitySchema);