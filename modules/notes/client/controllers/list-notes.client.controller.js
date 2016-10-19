(function () {
  'use strict';

  angular
    .module('notes')
    .controller('NotesListController', NotesListController);

  NotesListController.$inject = ['NotesService'];

  function NotesListController(NotesService) {
    var vm = this;

    vm.notes = NotesService.query();
  }
}());
