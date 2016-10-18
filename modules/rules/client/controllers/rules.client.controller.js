(function () {
  'use strict';

  // Rules controller
  angular
    .module('rules')
    .controller('RulesController', RulesController);

  RulesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'ruleResolve'];

  function RulesController ($scope, $state, $window, Authentication, rule) {
    var vm = this;

    vm.authentication = Authentication;
    vm.rule = rule;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Rule
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.rule.$remove($state.go('rules.list'));
      }
    }

    // Save Rule
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.ruleForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.rule._id) {
        vm.rule.$update(successCallback, errorCallback);
      } else {
        vm.rule.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('rules.view', {
          ruleId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
