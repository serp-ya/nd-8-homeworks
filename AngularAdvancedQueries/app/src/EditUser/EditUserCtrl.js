'use strict';

userApp.controller('EditUserCtrl', function($scope, Restangular, $routeParams) {

    Restangular.one('user', $routeParams['userId']).get().then(function(response) {
        $scope.user = response
    });

    $scope.updateUser = function() {

        $scope.user.put().then(function(successResult) {
            // Окей!
            $scope.updateSuccess = true;
        }, function(errorResult) {
            // Не окей..
            $scope.updateSuccess = false;
        });

    }

});
