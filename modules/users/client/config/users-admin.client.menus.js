'use strict';

// Configuring the Articles module
angular.module('users.admin').run(['Menus',
    function(Menus) {
        Menus.addSubMenuItem('topbar', 'admin', {
            title: 'Nutzerverwaltung',
            state: 'admin.users'
        });
    }
]);
