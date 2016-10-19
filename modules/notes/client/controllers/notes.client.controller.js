(function () {
  'use strict';

  // Notes controller
  angular
    .module('notes')
    .controller('NotesController', NotesController);

  NotesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'noteResolve'];

  function NotesController ($scope, $state, $window, Authentication, note) {
    var vm = this;

    vm.authentication = Authentication;
    vm.note = note;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Note
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.note.$remove($state.go('notes.list'));
      }
    }

    // Save Note
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.noteForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.note._id) {
        vm.note.$update(successCallback, errorCallback);
      } else {
        vm.note.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('notes.view', {
          noteId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
