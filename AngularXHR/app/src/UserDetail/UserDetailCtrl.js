'use strict';

userApp.controller('UserDetailCtrl', function ($scope, $routeParams, UsersService) {
  $scope.userLoaded = false;


  UsersService.getUser($routeParams['userId']).then(function (response) {
    $scope.user = response.data;
    $scope.userLoaded = true;
  });

  $scope.deleteUser = function (userId) {
    $scope.deletionError = false;
    $scope.deletionSuccess = false;

    UsersService.deleteUser(userId).then(function successCallback (response) {

      // Окей!
      $scope.deletionSuccess = true;
    }, function errorCallback (response) {

      // Не окей..
      $scope.deletionError = true;
    })
  }
});
