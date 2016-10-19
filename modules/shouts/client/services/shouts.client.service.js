// Shouts service used to communicate Shouts REST endpoints
(function () {
  'use strict';

  angular
    .module('shouts')
    .factory('ShoutsService', ShoutsService);

  ShoutsService.$inject = ['$resource'];

  function ShoutsService($resource) {
    return $resource('api/shouts/:shoutId', {
      shoutId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
