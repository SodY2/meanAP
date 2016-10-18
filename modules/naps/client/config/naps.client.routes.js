(function() {
    'use strict';

    angular
        .module('naps')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider'];

    function routeConfig($stateProvider) {
        $stateProvider
            .state('naps', {
                abstract: true,
                url: '/naps',
                controller: 'NapsListController',
                controllerAs: 'vm',
                templateUrl: 'modules/naps/client/views/list-overview.client.view.html',
            })
            .state('naps.list', {
                url: '',
                templateUrl: 'modules/naps/client/views/list-naps.client.view.html',
                data: {
                    pageTitle: 'Naps List'
                }
            })
            .state('naps.assis', {
                url: '',
                templateUrl: 'modules/naps/client/views/list-assis.client.view.html',
                data: {
                    pageTitle: 'Assis List'
                }
            })
            .state('naps.create', {
                url: '/create',
                templateUrl: 'modules/naps/client/views/form-nap.client.view.html',
                controller: 'NapsController',
                controllerAs: 'vm',
                resolve: {
                    napResolve: newNap
                },
                data: {
                    roles: ['user', 'admin'],
                    pageTitle: 'Naps Create'
                }
            })
            .state('naps.edit', {
                url: '/:napId/edit',
                templateUrl: 'modules/naps/client/views/form-nap.client.view.html',
                controller: 'NapsController',
                controllerAs: 'vm',
                resolve: {
                    napResolve: getNap
                },
                data: {
                    roles: ['user', 'admin'],
                    pageTitle: 'Edit Nap {{ napResolve.name }}'
                }
            })
            .state('naps.view', {
                url: '/:napId',
                templateUrl: 'modules/naps/client/views/view-nap.client.view.html',
                controller: 'NapsController',
                controllerAs: 'vm',
                resolve: {
                    napResolve: getNap
                },
                data: {
                    pageTitle: 'Nap {{ napResolve.name }}'
                }
            });
    }

    getNap.$inject = ['$stateParams', 'NapsService'];

    function getNap($stateParams, NapsService) {
        return NapsService.get({
            napId: $stateParams.napId
        }).$promise;
    }

    newNap.$inject = ['NapsService'];

    function newNap(NapsService) {
        return new NapsService();
    }
}());
