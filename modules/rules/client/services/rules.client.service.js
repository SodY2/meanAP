// Rules service used to communicate Rules REST endpoints
(function () {
  'use strict';

  angular
    .module('rules')
    .factory('RulesService', RulesService);

  RulesService.$inject = ['$resource'];

  function RulesService($resource) {
    return $resource('api/rules/:ruleId', {
      ruleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
