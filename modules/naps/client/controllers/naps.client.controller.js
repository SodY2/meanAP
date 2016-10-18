(function() {
    'use strict';

    // Naps controller
    angular
        .module('naps')
        .controller('NapsController', NapsController);

    NapsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'napResolve'];

    function NapsController($scope, $state, $window, Authentication, nap) {
        var vm = this;

        vm.authentication = Authentication;
        vm.nap = nap;
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;
        vm.nap.typ = "NAP";
        $scope.choices = ["NAP", "Assi"];
        // Remove existing Nap
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.nap.$remove($state.go('naps.list'));
            }
        }

        // Save Nap
        function save(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.napForm');
                return false;
            }

            // TODO: move create/update logic to service
            if (vm.nap._id) {
                vm.nap.$update(successCallback, errorCallback);
            } else {
                vm.nap.$save(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.go('naps.list', {
                    napId: res._id
                });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
    }
}());
