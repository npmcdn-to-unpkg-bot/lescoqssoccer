'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Article Schema
 */
var UserEventSchema = new Schema({
    start: {
        type: Date,
        default: Date.now
    },
    end: {
        type: Date,
        default: Date.now,
        trim: true
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
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    community: {}
});

/**
 * Validations
 */
// UserEventSchema.path('content').validate(function(title) {
//     return title.length;
// }, 'Content cannot be blank');

/**
 * Statics
 */
UserEventSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('userEvent', 'name username').exec(cb);
};

module.exports = mongoose.model('UserEvent', UserEventSchema);