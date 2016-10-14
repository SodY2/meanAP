'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  News = mongoose.model('News'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a News
 */
exports.create = function(req, res) {
  var news = new News(req.body);
  news.user = req.user;

  news.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(news);
    }
  });
};

/**
 * Show the current News
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var news = req.news ? req.news.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  news.isCurrentUserOwner = req.user && news.user && news.user._id.toString() === req.user._id.toString();

  res.jsonp(news);
};

/**
 * Update a News
 */
exports.update = function(req, res) {
  var news = req.news;

  news = _.extend(news, req.body);

  news.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(news);
    }
  });
};

/**
 * Delete an News
 */
exports.delete = function(req, res) {
  var news = req.news;

  news.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(news);
    }
  });
};

/**
 * List of News
 */
exports.list = function(req, res) {
  News.find().sort('-created').populate('user', 'displayName').exec(function(err, news) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(news);
    }
  });
};

/**
 * News middleware
 */
exports.newsByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'News is invalid'
    });
  }

  News.findById(id).populate('user', 'displayName').exec(function (err, news) {
    if (err) {
      return next(err);
    } else if (!news) {
      return res.status(404).send({
        message: 'No News with that identifier has been found'
      });
    }
    req.news = news;
    next();
  });
};
