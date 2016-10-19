(function () {
  'use strict';

  angular
    .module('notes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('notes', {
        abstract: true,
        url: '/notes',
        template: '<ui-view/>'
      })
      .state('notes.list', {
        url: '',
        templateUrl: 'modules/notes/client/views/list-notes.client.view.html',
        controller: 'NotesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Notes List'
        }
      })
      .state('notes.create', {
        url: '/create',
        templateUrl: 'modules/notes/client/views/form-note.client.view.html',
        controller: 'NotesController',
        controllerAs: 'vm',
        resolve: {
          noteResolve: newNote
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Notes Create'
        }
      })
      .state('notes.edit', {
        url: '/:noteId/edit',
        templateUrl: 'modules/notes/client/views/form-note.client.view.html',
        controller: 'NotesController',
        controllerAs: 'vm',
        resolve: {
          noteResolve: getNote
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Note {{ noteResolve.name }}'
        }
      })
      .state('notes.view', {
        url: '/:noteId',
        templateUrl: 'modules/notes/client/views/view-note.client.view.html',
        controller: 'NotesController',
        controllerAs: 'vm',
        resolve: {
          noteResolve: getNote
        },
        data: {
          pageTitle: 'Note {{ noteResolve.name }}'
        }
      });
  }

  getNote.$inject = ['$stateParams', 'NotesService'];

  function getNote($stateParams, NotesService) {
    return NotesService.get({
      noteId: $stateParams.noteId
    }).$promise;
  }

  newNote.$inject = ['NotesService'];

  function newNote(NotesService) {
    return new NotesService();
  }
}());
