(function() {
    'use strict';

    angular
        .module('shouts')
        .run(menuConfig);

    menuConfig.$inject = ['Menus'];

    function menuConfig(menuService) {
        // Set top bar menu items
    }
}());
