'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve',
    function($scope, $state, Authentication, userResolve) {
        $scope.authentication = Authentication;
        $scope.user = userResolve;

        userResolve.$promise.then(function() {
            $scope.user.selectedRang = $scope.user.clanrang[0];
            $scope.user.selectedRole = $scope.user.roles[0];
        })
        $scope.roles = ["user", "member", "leader", "admin"];
        $scope.clanrangs = ['Praktikant', 'Laufbursche | Vorl. Mitglied', 'Dealer | Vollmitglied', 'Hintermann', "Spitzel", "Altes Eisen", "Rechte Hand", "Vorstand"];

        $scope.remove = function(user) {
            if (confirm('Are you sure you want to delete this user?')) {
                if (user) {
                    user.$remove();

                    $scope.users.splice($scope.users.indexOf(user), 1);
                } else {
                    $scope.user.$remove(function() {
                        $state.go('admin.users');
                    });
                }
            }
        };

        $scope.update = function(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'userForm');
                return false;
            }

            var user = $scope.user;

            user.$update(function() {
                $state.go('admin.user', {
                    userId: user._id
                });
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.calculateAge = function calculateAge(birthday) {
            var birthd = new Date(birthday);
            var ageDifMs = Date.now() - birthd.getTime();
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        };

        $scope.changeRole = function(newRang) {
            $scope.user.roles = [];
            $scope.user.roles.push(newRang);
        }

        $scope.changeClanRang = function(newRang) {
            $scope.user.clanrang = [];
            $scope.user.clanrang.push(newRang);
        }

        $scope.$watch("user.selectedRole", function(newval, oldval) {
            if (newval !== oldval) {
                $scope.changeRole(newval)
            }
        })

        $scope.$watch("user.selectedRang", function(newval, oldval) {
            if (newval !== oldval) {
                $scope.changeClanRang(newval)
            }
        })
    }
]);
