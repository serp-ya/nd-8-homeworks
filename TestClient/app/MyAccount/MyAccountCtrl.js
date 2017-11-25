'use strict';

angular.module('myApp')
  .controller('MyAccountCtrl', function (logIn) {

    var vm = this;
    // Взятие сохранённого пользователя из сервиса
    // при обновелнии контроллера
    vm.currentUser = logIn.showUser();

    // Сохранение данных пользователя из формы,
    // обновление контроллера
    vm.singIn = function (data) {
      vm.currentUser = logIn.auth(data);
    };

  });