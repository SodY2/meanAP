(function () {
  'use strict';

  // Shouts controller
  angular
    .module('shouts')
    .controller('ShoutsController', ShoutsController);

  ShoutsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'shoutResolve'];

  function ShoutsController ($scope, $state, $window, Authentication, shout) {
    var vm = this;

    vm.authentication = Authentication;
    vm.shout = shout;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Shout
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.shout.$remove($state.go('shouts.list'));
      }
    }

    // Save Shout
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.shoutForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.shout._id) {
        vm.shout.$update(successCallback, errorCallback);
      } else {
        vm.shout.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('shouts.view', {
          shoutId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
