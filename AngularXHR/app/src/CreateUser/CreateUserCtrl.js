'use strict'

userApp.controller('CreateUserCtrl', function ($scope, UsersService) {
  $scope.newUser = {}

  $scope.createUser = function (myUser) {
    $scope.creationSuccess = false

    UsersService.createUser(myUser).then(function (response) {
      $scope.newUser = {}

      $scope.newUserId = response.data.id
      $scope.creationSuccess = true
    })
  }
})
