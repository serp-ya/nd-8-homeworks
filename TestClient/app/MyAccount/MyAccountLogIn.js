'use strict';

angular.module('myApp')
  .factory('logIn', function () {

    // Инициализация переменной пользователя
    let currentUser = {};

    return {
      // Метод сохранения пользователя
      auth(userData) {
        currentUser = userData;
        return currentUser;
      },

      // Метод отдачи пользователя
      showUser() {
        return currentUser;
      }
    }
  });