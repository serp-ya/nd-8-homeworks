'use strict'

userApp.controller('UserListCtrl', function ($scope, UsersService, PostsService) {

  $scope.users = UsersService.query();
  $scope.posts = PostsService.query();

});