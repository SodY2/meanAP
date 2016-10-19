(function () {
  'use strict';

  angular
    .module('shouts')
    .controller('ShoutsListController', ShoutsListController);

  ShoutsListController.$inject = ['ShoutsService'];

  function ShoutsListController(ShoutsService) {
    var vm = this;

    vm.shouts = ShoutsService.query();
  }
}());
