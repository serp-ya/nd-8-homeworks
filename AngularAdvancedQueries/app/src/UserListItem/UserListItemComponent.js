'use strict';

userApp.component('userListItem', {

    bindings: {
        user: '<'
    },

    controller: function ($location) {
      // Функция открытия определенного пользователя по ID
      this.openUser = function (userId) {
        const pathToUser = `/users/${userId}`;
        $location.path(pathToUser);
      };

    },

    templateUrl: './src/UserListItem/UserListItem.html'

});
