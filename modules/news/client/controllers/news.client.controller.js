(function () {
  'use strict';

  // News controller
  angular
    .module('news')
    .controller('NewsController', NewsController);

  NewsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'newsResolve'];

  function NewsController ($scope, $state, $window, Authentication, news) {
    var vm = this;

    vm.authentication = Authentication;
    vm.news = news;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing News
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.news.$remove($state.go('news.list'));
      }
    }

    // Save News
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.newsForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.news._id) {
        vm.news.$update(successCallback, errorCallback);
      } else {
        vm.news.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('news.view', {
          newsId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
