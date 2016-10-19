(function () {
  'use strict';

  angular
    .module('shouts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('shouts', {
        abstract: true,
        url: '/shouts',
        template: '<ui-view/>'
      })
      .state('shouts.list', {
        url: '',
        templateUrl: 'modules/shouts/client/views/list-shouts.client.view.html',
        controller: 'ShoutsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Shouts List'
        }
      })
      .state('shouts.create', {
        url: '/create',
        templateUrl: 'modules/shouts/client/views/form-shout.client.view.html',
        controller: 'ShoutsController',
        controllerAs: 'vm',
        resolve: {
          shoutResolve: newShout
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Shouts Create'
        }
      })
      .state('shouts.edit', {
        url: '/:shoutId/edit',
        templateUrl: 'modules/shouts/client/views/form-shout.client.view.html',
        controller: 'ShoutsController',
        controllerAs: 'vm',
        resolve: {
          shoutResolve: getShout
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Shout {{ shoutResolve.name }}'
        }
      })
      .state('shouts.view', {
        url: '/:shoutId',
        templateUrl: 'modules/shouts/client/views/view-shout.client.view.html',
        controller: 'ShoutsController',
        controllerAs: 'vm',
        resolve: {
          shoutResolve: getShout
        },
        data: {
          pageTitle: 'Shout {{ shoutResolve.name }}'
        }
      });
  }

  getShout.$inject = ['$stateParams', 'ShoutsService'];

  function getShout($stateParams, ShoutsService) {
    return ShoutsService.get({
      shoutId: $stateParams.shoutId
    }).$promise;
  }

  newShout.$inject = ['ShoutsService'];

  function newShout(ShoutsService) {
    return new ShoutsService();
  }
}());
