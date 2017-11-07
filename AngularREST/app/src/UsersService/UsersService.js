angular
  .module('UserApp')
  .factory('UsersService', function ($resource) {
    return $resource('https://jsonplaceholder.typicode.com/users/:userId/:userData', {
      userId: '@userId',
      userData: '@userData', // Чтобы не ограничивать запрос только постами
    }, {
      update: {
        method: 'PUT'
      }
    })
  })
