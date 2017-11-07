'use strict';

userApp.controller('UserListCtrl', function ($scope, $q, UsersService, PostsService) {

  const requests = [UsersService.getUsers(), PostsService.getPosts()];
  $q.all(requests)
    .then(([users, posts]) => {
      $scope.users = users.data;
      $scope.posts = posts.data;
      $scope.contentLoaded = true;
    })
    .catch(console.error);

});
