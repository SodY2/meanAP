'use strict';

/**
 * Module dependencies
 */
var newsPolicy = require('../policies/news.server.policy'),
  news = require('../controllers/news.server.controller');

module.exports = function(app) {
  // News Routes
  app.route('/api/news').all(newsPolicy.isAllowed)
    .get(news.list)
    .post(news.create);

  app.route('/api/news/:newsId').all(newsPolicy.isAllowed)
    .get(news.read)
    .put(news.update)
    .delete(news.delete);

  // Finish by binding the News middleware
  app.param('newsId', news.newsByID);
};
