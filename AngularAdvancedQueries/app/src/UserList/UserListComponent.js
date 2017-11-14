'use strict';

userApp.component('userList', {

    controller: function UserListCtrl(UsersService) {

        this.users = UsersService.query();

    },

    templateUrl: './src/UserList/UserList.html'

});
