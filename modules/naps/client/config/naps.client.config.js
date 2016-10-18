'use strict';
angular.module('naps').run(['Menus',
    function(Menus) {
        Menus.addMenuItem('topbar', {
            title: 'Diplomatie',
            state: 'naps.list',
            roles: ['member', 'leader', 'admin']
        });

        // Add the dropdown create item
        Menus.addSubMenuItem('topbar', 'admin', {
            title: 'Diplomatieverwaltung',
            state: 'naps.create',
            roles: ['leader', 'admin']
        });
    }
]);
