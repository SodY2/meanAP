'use strict';

angular.module('shouts')
    .directive('shoutBox', ['Socket', 'Authentication', '$location', 'ShoutsService', '$state', function(Socket, Authentication, $location, ShoutsService, $state) {
        return {
            restrict: 'E',
            templateUrl: 'modules/shouts/client/views/list-shouts.client.view.html',
            controller: function($scope) {
                // If user is not signed in then redirect back home
                if (!Authentication.user) {
                    $location.path('/');
                }

                // Make sure the Socket is connected
                if (!Socket.socket) {
                    console.info("connect")
                    Socket.connect();
                }

                $scope.shouts = ShoutsService.query();

                $scope.save = function() {
                    var shout = new ShoutsService($scope.shout)
                    shout.$save().then(function() {
                        $scope.shouts = ShoutsService.query();
                        console.info("blq", Socket)
                        Socket.emit("shout.created", {});
                        $scope.shout = "";
                        $state.go('.');
                    });
                }

                // Add an event listener to the 'chatMessage' event
                Socket.on('shout.created', function() {
                    console.info("blq33333")
                    $scope.shouts = ShoutsService.query();

                    // $scope.messages.unshift(message);
                });

            }
        };
    }]);
