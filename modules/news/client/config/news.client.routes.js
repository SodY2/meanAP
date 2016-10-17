(function() {
    'use strict';

    angular
        .module('news')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider'];

    function routeConfig($stateProvider) {
        $stateProvider
            .state('news', {
                abstract: true,
                url: '/',
                template: '<ui-view/>'
            })
            .state('news.list', {
                url: '/',
                templateUrl: 'modules/news/client/views/list-news.client.view.html',
                controller: 'NewsListController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'News List'
                }
            })
            .state('news.create', {
                url: '/create',
                templateUrl: 'modules/news/client/views/form-news.client.view.html',
                controller: 'NewsController',
                controllerAs: 'vm',
                resolve: {
                    newsResolve: newNews
                },
                data: {
                    roles: ['user', 'admin'],
                    pageTitle: 'News Create'
                }
            })
            .state('news.edit', {
                url: '/:newsId/edit',
                templateUrl: 'modules/news/client/views/form-news.client.view.html',
                controller: 'NewsController',
                controllerAs: 'vm',
                resolve: {
                    newsResolve: getNews
                },
                data: {
                    roles: ['user', 'admin'],
                    pageTitle: 'Edit News {{ newsResolve.name }}'
                }
            })
            .state('news.view', {
                url: '/:newsId',
                templateUrl: 'modules/news/client/views/view-news.client.view.html',
                controller: 'NewsController',
                controllerAs: 'vm',
                resolve: {
                    newsResolve: getNews
                },
                data: {
                    pageTitle: 'News {{ newsResolve.name }}'
                }
            });
    }

    getNews.$inject = ['$stateParams', 'NewsService'];

    function getNews($stateParams, NewsService) {
        return NewsService.get({
            newsId: $stateParams.newsId
        }).$promise;
    }

    newNews.$inject = ['NewsService'];

    function newNews(NewsService) {
        return new NewsService();
    }
}());
