'use strict';

/**
 * Module dependencies
 */
var napsPolicy = require('../policies/naps.server.policy'),
  naps = require('../controllers/naps.server.controller');

module.exports = function(app) {
  // Naps Routes
  app.route('/api/naps').all(napsPolicy.isAllowed)
    .get(naps.list)
    .post(naps.create);

  app.route('/api/naps/:napId').all(napsPolicy.isAllowed)
    .get(naps.read)
    .put(naps.update)
    .delete(naps.delete);

  // Finish by binding the Nap middleware
  app.param('napId', naps.napByID);
};
