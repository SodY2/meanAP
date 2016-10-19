'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication',
    function($scope, Authentication) {
        $scope.user = Authentication.user;
        $scope.popup2 = {
            opened: false
        };

        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.formats = ['dd.MM.yyyy'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['dd.MM.yyyy'];

    }
]);
