'use strict'

userApp.controller('UserDetailCtrl', function ($scope, $routeParams, UsersService) {
  $scope.userLoaded = false;

  $scope.user = UsersService.get({
    userId: $routeParams['userId']
  }, function (successResult) {
    // Окей!
    $scope.notfoundError = false;
    $scope.userLoaded = true;
  }, function (errorResult) {
    // Не окей..
    $scope.notfoundError = true;
    $scope.userLoaded = true;
  });

  $scope.user.$promise.then(function (result) {
    // $scope.userLoaded = true
  });

  $scope.deleteUser = function (userId) {
    $scope.user.$delete({
      userId: userId
    }, function (successResult) {
      // Окей!
      $scope.deletionSuccess = true
    }, function (errorResult) {
      // Не окей..
      $scope.deletionError = true
    })
  };


  // Вывод постов пользователя
  $scope.posts = UsersService.query({
    userId: $routeParams['userId'],
    userData: 'posts'
  });
})
