(function () {
  'use strict';

  angular
    .module('news')
    .controller('NewsListController', NewsListController);

  NewsListController.$inject = ['NewsService'];

  function NewsListController(NewsService) {
    var vm = this;

    vm.news = NewsService.query();
  }
}());
