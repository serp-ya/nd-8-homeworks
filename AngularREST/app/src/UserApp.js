var userApp = angular.module('UserApp', ['ngRoute', 'ngResource'])

angular.module('UserApp')

  .config(['$routeProvider',
    function config ($routeProvider) {
      $routeProvider
        .when('/users', {
          templateUrl: 'src/UserList/UserList.html',
          controller: 'UserListCtrl'
        })
        .when('/users/:userId', {
          templateUrl: 'src/UserDetail/UserDetail.html',
          controller: 'UserDetailCtrl'
        })
        .when('/edit/:userId', {
          templateUrl: 'src/EditUser/EditUser.html',
          controller: 'EditUserCtrl'
        })
        .when('/create', {
          templateUrl: 'src/CreateUser/CreateUser.html',
          controller: 'CreateUserCtrl'
        })
        .otherwise({
          redirectTo: '/'
        })
    }
  ])
