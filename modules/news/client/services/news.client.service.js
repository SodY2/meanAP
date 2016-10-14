// News service used to communicate News REST endpoints
(function () {
  'use strict';

  angular
    .module('news')
    .factory('NewsService', NewsService);

  NewsService.$inject = ['$resource'];

  function NewsService($resource) {
    return $resource('api/news/:newsId', {
      newsId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
