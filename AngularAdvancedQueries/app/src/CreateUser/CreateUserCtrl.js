'use strict';

userApp.controller('CreateUserCtrl', function($scope, UsersService, $mdToast) {

    $scope.newUser = {};

    $scope.createUser = function(myUser) {

        var newUserInstance = new UsersService(myUser);
        newUserInstance.$save({}, function(successResult) {
            // Окей!
            $scope.newUser = {};

            $mdToast.show(
                $mdToast.simple()
                .textContent('Привет, пользователь ' + successResult.id)
                .position('bottom right')
                .hideDelay(3000)
            );

        }, function(errorResult) {
            // Не окей..
        });

    }

});
