var userApp = angular.module('UserApp', ['ngRoute', 'btford.socket-io', 'ngMessages'])

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
        .when('/realtime/:userName', {
          templateUrl: 'src/PokemonRealtime/PokemonRealtime.html',
          controller: 'PokemonRealtimeCtrl'
        })
        .otherwise({
          redirectTo: '/'
        })
    }
  ])

  .factory('mySocket', function (socketFactory) {
    var myIoSocket = io.connect('https://netology-socket-io.herokuapp.com/')

    mySocket = socketFactory({
      ioSocket: myIoSocket
    })

    return mySocket
  })
