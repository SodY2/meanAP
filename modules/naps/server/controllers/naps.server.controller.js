'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Nap = mongoose.model('Nap'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Nap
 */
exports.create = function(req, res) {
  var nap = new Nap(req.body);
  nap.user = req.user;

  nap.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(nap);
    }
  });
};

/**
 * Show the current Nap
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var nap = req.nap ? req.nap.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  nap.isCurrentUserOwner = req.user && nap.user && nap.user._id.toString() === req.user._id.toString();

  res.jsonp(nap);
};

/**
 * Update a Nap
 */
exports.update = function(req, res) {
  var nap = req.nap;

  nap = _.extend(nap, req.body);

  nap.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(nap);
    }
  });
};

/**
 * Delete an Nap
 */
exports.delete = function(req, res) {
  var nap = req.nap;

  nap.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(nap);
    }
  });
};

/**
 * List of Naps
 */
exports.list = function(req, res) {
  Nap.find().sort('-created').populate('user', 'displayName').exec(function(err, naps) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(naps);
    }
  });
};

/**
 * Nap middleware
 */
exports.napByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Nap is invalid'
    });
  }

  Nap.findById(id).populate('user', 'displayName').exec(function (err, nap) {
    if (err) {
      return next(err);
    } else if (!nap) {
      return res.status(404).send({
        message: 'No Nap with that identifier has been found'
      });
    }
    req.nap = nap;
    next();
  });
};
