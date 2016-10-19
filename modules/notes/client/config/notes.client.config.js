(function() {
    'use strict';

    angular
        .module('notes')
        .run(menuConfig);

    menuConfig.$inject = ['Menus'];

    function menuConfig(menuService) {
        // Set top bar menu items
        menuService.addMenuItem('topbar', {
            title: 'Notizen',
            state: 'notes',
            type: 'dropdown',
            roles: ['admin', 'leader']
        });

        // Add the dropdown list item
        menuService.addSubMenuItem('topbar', 'notes', {
            title: 'Notizen anzeigen',
            state: 'notes.list',
            roles: ['admin', 'leader']
        });

        // Add the dropdown create item
        menuService.addSubMenuItem('topbar', 'notes', {
            title: 'Notiz erstellen',
            state: 'notes.create',
            roles: ['admin', 'leader']
        });
    }
}());
