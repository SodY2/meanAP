'use strict';
angular.module('rules').run(['Menus',

    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', {
            title: 'Regeln',
            state: 'rules.list',
            roles: ['member', 'leader', 'admin']
        });
    }
]);
