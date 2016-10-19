'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Note = mongoose.model('Note'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Note
 */
exports.create = function(req, res) {
  var note = new Note(req.body);
  note.user = req.user;

  note.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(note);
    }
  });
};

/**
 * Show the current Note
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var note = req.note ? req.note.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  note.isCurrentUserOwner = req.user && note.user && note.user._id.toString() === req.user._id.toString();

  res.jsonp(note);
};

/**
 * Update a Note
 */
exports.update = function(req, res) {
  var note = req.note;

  note = _.extend(note, req.body);

  note.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(note);
    }
  });
};

/**
 * Delete an Note
 */
exports.delete = function(req, res) {
  var note = req.note;

  note.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(note);
    }
  });
};

/**
 * List of Notes
 */
exports.list = function(req, res) {
  Note.find().sort('-created').populate('user', 'displayName').exec(function(err, notes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(notes);
    }
  });
};

/**
 * Note middleware
 */
exports.noteByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Note is invalid'
    });
  }

  Note.findById(id).populate('user', 'displayName').exec(function (err, note) {
    if (err) {
      return next(err);
    } else if (!note) {
      return res.status(404).send({
        message: 'No Note with that identifier has been found'
      });
    }
    req.note = note;
    next();
  });
};
