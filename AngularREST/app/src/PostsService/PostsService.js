userApp.factory('PostsService', function ($resource) {
    return $resource('https://jsonplaceholder.typicode.com/posts/:postId', {
      postId: '@postId'
    })
});