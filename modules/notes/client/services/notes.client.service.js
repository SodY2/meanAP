// Notes service used to communicate Notes REST endpoints
(function () {
  'use strict';

  angular
    .module('notes')
    .factory('NotesService', NotesService);

  NotesService.$inject = ['$resource'];

  function NotesService($resource) {
    return $resource('api/notes/:noteId', {
      noteId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
