'use strict'

userApp.controller('CreateUserCtrl', function ($scope, UsersService) {
  $scope.newUser = {}

  $scope.createUser = function (myUser) {
    var newUserInstance = new UsersService(myUser)
    newUserInstance.$save({}, function (successResult) {
      // Окей!
      $scope.newUser = {}

      $scope.newUserId = successResult.id
      $scope.creationSuccess = true
    }, function (errorResult) {
      // Не окей..
      $scope.creationSuccess = false
    })
  }
})
