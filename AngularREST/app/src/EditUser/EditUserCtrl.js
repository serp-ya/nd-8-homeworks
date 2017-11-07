'use strict'

userApp.controller('EditUserCtrl', function ($scope, UsersService, $routeParams) {
  $scope.user = UsersService.get({
    userId: $routeParams['userId']
  })

  $scope.updateUser = function () {
    $scope.user.$update({
      userId: $routeParams['userId']
    }, function (successResult) {
      // Окей!
      $scope.updateSuccess = true
    }, function (errorResult) {
      // Не окей..
      $scope.updateSuccess = false
    })
  }
})
