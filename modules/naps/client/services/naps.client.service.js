// Naps service used to communicate Naps REST endpoints
(function () {
  'use strict';

  angular
    .module('naps')
    .factory('NapsService', NapsService);

  NapsService.$inject = ['$resource'];

  function NapsService($resource) {
    return $resource('api/naps/:napId', {
      napId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
