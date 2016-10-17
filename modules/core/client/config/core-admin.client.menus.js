'use strict';

angular.module('core.admin').run(['Menus',
    function(Menus) {
        Menus.addMenuItem('topbar', {
            title: 'Admin',
            state: 'admin',
            type: 'dropdown',
            roles: ['admin']
        });

        Menus.addSubMenuItem('topbar', 'admin', {
            title: 'News erstellen',
            state: 'news.create',
            roles: ['leader', 'admin']
        });
    }
]);
