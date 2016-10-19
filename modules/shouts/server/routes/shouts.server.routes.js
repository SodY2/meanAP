'use strict';

/**
 * Module dependencies
 */
var shoutsPolicy = require('../policies/shouts.server.policy'),
  shouts = require('../controllers/shouts.server.controller');

module.exports = function(app) {
  // Shouts Routes
  app.route('/api/shouts').all(shoutsPolicy.isAllowed)
    .get(shouts.list)
    .post(shouts.create);

  app.route('/api/shouts/:shoutId').all(shoutsPolicy.isAllowed)
    .get(shouts.read)
    .put(shouts.update)
    .delete(shouts.delete);

  // Finish by binding the Shout middleware
  app.param('shoutId', shouts.shoutByID);
};
