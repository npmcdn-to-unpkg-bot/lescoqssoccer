// imports
var mongoose = require('mongoose');
var _ = require('underscore');

var Schema = mongoose.Schema;

// Album Schema
var albumSchema = new Schema({
	name: { type: String, required: true},
	description: { type: String},
	order: { type: Number},
	enabled: { type: Boolean},
	coverPicPath: { type: String},
	photoList  : [ new Schema({
        id: {
            type: String
        },
        filepath: {
            type: String
        },
        name:{
        	type: String
        }
    }) ],
	user: {type : mongoose.Schema.ObjectId, ref : 'User'},
});

// Export album model
module.exports = mongoose.model('Album', albumSchema);