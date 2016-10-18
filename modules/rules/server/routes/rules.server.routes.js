'use strict';

/**
 * Module dependencies
 */
var rulesPolicy = require('../policies/rules.server.policy'),
  rules = require('../controllers/rules.server.controller');

module.exports = function(app) {
  // Rules Routes
  app.route('/api/rules').all(rulesPolicy.isAllowed)
    .get(rules.list)
    .post(rules.create);

  app.route('/api/rules/:ruleId').all(rulesPolicy.isAllowed)
    .get(rules.read)
    .put(rules.update)
    .delete(rules.delete);

  // Finish by binding the Rule middleware
  app.param('ruleId', rules.ruleByID);
};
