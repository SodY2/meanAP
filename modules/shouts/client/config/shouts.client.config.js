(function() {
    'use strict';

    angular
        .module('shouts')
        .run(menuConfig);

    menuConfig.$inject = ['Menus'];

    function menuConfig(menuService) {
        // Set top bar menu items
        menuService.addMenuItem('topbar', {
            title: 'Shouts',
            state: 'shouts',
            type: 'dropdown',
            roles: ['*']
        });

        // Add the dropdown list item
        menuService.addSubMenuItem('topbar', 'shouts', {
            title: 'List Shouts',
            state: 'shouts.list'
        });

        // Add the dropdown create item
        menuService.addSubMenuItem('topbar', 'shouts', {
            title: 'Create Shout',
            state: 'shouts.create',
            roles: ['user']
        });
    }
}());
