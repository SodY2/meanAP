(function() {
    'use strict';

    angular
        .module('naps')
        .controller('NapsListController', NapsListController);

    NapsListController.$inject = ['NapsService', 'Authentication', '$window', '$state'];

    function NapsListController(NapsService, Authentication, $window, $state) {
        var vm = this;
        vm.user = Authentication.user;
        vm.diplos = NapsService.query();
        vm.naps = [];
        vm.assis = [];
        vm.diplos.$promise.then(function(result) {
            result.forEach(function(value) {
                if (value.typ[0] === "NAP") {
                    vm.naps.push(value)
                }
                if (value.typ[0] === "Assi") {
                    vm.assis.push(value)
                }
            })

        })

        vm.canEdit = vm.user.roles[0] === ("admin" || "leader")

        vm.remove = remove;

        function remove(nap) {
            if ($window.confirm('Are you sure you want to delete?')) {
                nap.$remove($state.go('naps.list'));
            }
        }
    }
}());
