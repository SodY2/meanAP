(function () {
  'use strict';

  angular
    .module('rules')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('rules', {
        abstract: true,
        url: '/rules',
        template: '<ui-view/>'
      })
      .state('rules.list', {
        url: '',
        templateUrl: 'modules/rules/client/views/list-rules.client.view.html',
        controller: 'RulesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Rules List'
        }
      })
      .state('rules.create', {
        url: '/create',
        templateUrl: 'modules/rules/client/views/form-rule.client.view.html',
        controller: 'RulesController',
        controllerAs: 'vm',
        resolve: {
          ruleResolve: newRule
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Rules Create'
        }
      })
      .state('rules.edit', {
        url: '/:ruleId/edit',
        templateUrl: 'modules/rules/client/views/form-rule.client.view.html',
        controller: 'RulesController',
        controllerAs: 'vm',
        resolve: {
          ruleResolve: getRule
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Rule {{ ruleResolve.name }}'
        }
      })
      .state('rules.view', {
        url: '/:ruleId',
        templateUrl: 'modules/rules/client/views/view-rule.client.view.html',
        controller: 'RulesController',
        controllerAs: 'vm',
        resolve: {
          ruleResolve: getRule
        },
        data: {
          pageTitle: 'Rule {{ ruleResolve.name }}'
        }
      });
  }

  getRule.$inject = ['$stateParams', 'RulesService'];

  function getRule($stateParams, RulesService) {
    return RulesService.get({
      ruleId: $stateParams.ruleId
    }).$promise;
  }

  newRule.$inject = ['RulesService'];

  function newRule(RulesService) {
    return new RulesService();
  }
}());
