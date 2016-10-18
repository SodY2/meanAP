'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Rule = mongoose.model('Rule'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Rule
 */
exports.create = function(req, res) {
  var rule = new Rule(req.body);
  rule.user = req.user;

  rule.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(rule);
    }
  });
};

/**
 * Show the current Rule
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var rule = req.rule ? req.rule.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  rule.isCurrentUserOwner = req.user && rule.user && rule.user._id.toString() === req.user._id.toString();

  res.jsonp(rule);
};

/**
 * Update a Rule
 */
exports.update = function(req, res) {
  var rule = req.rule;

  rule = _.extend(rule, req.body);

  rule.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(rule);
    }
  });
};

/**
 * Delete an Rule
 */
exports.delete = function(req, res) {
  var rule = req.rule;

  rule.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(rule);
    }
  });
};

/**
 * List of Rules
 */
exports.list = function(req, res) {
  Rule.find().sort('-created').populate('user', 'displayName').exec(function(err, rules) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(rules);
    }
  });
};

/**
 * Rule middleware
 */
exports.ruleByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Rule is invalid'
    });
  }

  Rule.findById(id).populate('user', 'displayName').exec(function (err, rule) {
    if (err) {
      return next(err);
    } else if (!rule) {
      return res.status(404).send({
        message: 'No Rule with that identifier has been found'
      });
    }
    req.rule = rule;
    next();
  });
};
