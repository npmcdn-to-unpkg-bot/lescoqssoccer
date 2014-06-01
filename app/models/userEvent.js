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
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: Date.now,
        trim: true
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    title: {
        type: String,
        default: '',
        trim: true
    },
    user: {
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