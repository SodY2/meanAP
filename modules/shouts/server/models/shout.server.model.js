'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Shout Schema
 */
var ShoutSchema = new Schema({
    message: {
        type: String,
        default: '',
        required: 'Please fill Shout name',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Shout', ShoutSchema);
