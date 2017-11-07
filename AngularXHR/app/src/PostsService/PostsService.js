angular
  .module('UserApp')
  .factory('PostsService', function ($http) {
    return {
      getPosts: function () {
        return $http.get('https://jsonplaceholder.typicode.com/posts')
      }

    }
  }

)
