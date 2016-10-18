(function () {
  'use strict';

  angular
    .module('rules')
    .controller('RulesListController', RulesListController);

  RulesListController.$inject = ['RulesService'];

  function RulesListController(RulesService) {
    var vm = this;

    vm.rules = RulesService.query();
  }
}());
