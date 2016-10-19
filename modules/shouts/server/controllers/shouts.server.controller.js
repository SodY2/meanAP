'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Shout = mongoose.model('Shout'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a Shout
 */
exports.create = function(req, res) {
    var shout = new Shout(req.body);
    shout.user = req.user;
    shout.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(shout);
        }
    });
};

/**
 * Show the current Shout
 */
exports.read = function(req, res) {
    // convert mongoose document to JSON
    var shout = req.shout ? req.shout.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    shout.isCurrentUserOwner = req.user && shout.user && shout.user._id.toString() === req.user._id.toString();

    res.jsonp(shout);
};

/**
 * Update a Shout
 */
exports.update = function(req, res) {
    var shout = req.shout;

    shout = _.extend(shout, req.body);

    shout.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(shout);
        }
    });
};

/**
 * Delete an Shout
 */
exports.delete = function(req, res) {
    var shout = req.shout;

    shout.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(shout);
        }
    });
};

/**
 * List of Shouts
 */
exports.list = function(req, res) {
    Shout.find().sort('-created').populate('user', 'displayName').exec(function(err, shouts) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(shouts);
        }
    });
};

/**
 * Shout middleware
 */
exports.shoutByID = function(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Shout is invalid'
        });
    }

    Shout.findById(id).populate('user', 'displayName').exec(function(err, shout) {
        if (err) {
            return next(err);
        } else if (!shout) {
            return res.status(404).send({
                message: 'No Shout with that identifier has been found'
            });
        }
        req.shout = shout;
        next();
    });
};
