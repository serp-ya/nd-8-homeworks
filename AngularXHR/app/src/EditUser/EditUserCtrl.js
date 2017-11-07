'use strict';

userApp.controller('EditUserCtrl', function ($scope, $routeParams, UsersService) {
  
  UsersService.getUser($routeParams['userId'])
    .then(function (response) {
      $scope.user = response.data;
      $scope.userNameField = response.data.username;
      $scope.nameField = response.data.name;

      $scope.userLoaded = true;
    })
    .catch(function (error) {
      console.error('Load error: ', error);
      $scope.loadError = true;
    });

  $scope.updateUser = function (userData) {

    UsersService.updateUser($scope.user.id, userData)
      .then(function (response) {
        if (response.status < 200 || 299 < response.status) {
          $scope.saveError = true;
          return;
        }
        $scope.userUpdated = true;
      })
      .catch(function (error) {
        console.error('Save error: ', error);
        $scope.saveError = true;
      });

  };

});