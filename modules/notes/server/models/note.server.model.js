'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Note Schema
 */
var NoteSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Note name',
        trim: true
    },
    note: {
        type: String,
        default: ''
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

mongoose.model('Note', NoteSchema);
