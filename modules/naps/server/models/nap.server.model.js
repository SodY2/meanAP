'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Nap Schema
 */
var NapSchema = new Schema({
    clanname: {
        type: String,
        default: '',
        required: 'Please fill clanname'
    },
    clantag: {
        type: String,
        default: ''
    },
    typ: {
        type: String,
        type: [{
            type: String,
            enum: ['NAP', 'Assi']
        }],
        default: ['NAP'],
        required: 'Please provide NAP-Type'
    },
    ts: {
        type: String,
        default: '',
    },
    leader: {
        type: String,
        default: '',
        required: 'Please fill leader'
    },
    reason: {
        type: String,
        default: '',
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

mongoose.model('Nap', NapSchema);
