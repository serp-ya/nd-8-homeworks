'use strict';

userApp.component('userDetail', {

  controller: function userDetailCtrl($routeParams, UsersService) {
    // Сохраняем ссылку на контекст вызова контроллера,
    // чтобы переиспользовать его в вложенных функциях
    const ctrl = this;

    // Остальной код взят из исходников
    ctrl.userLoaded = false;

    ctrl.user = UsersService.get({
      userId: $routeParams['userId']
    }, function (successResult) {
      // Окей!
      ctrl.notfoundError = false;
      ctrl.userLoaded = true;

      ctrl.activeTab = 1;
      ctrl.disableControlTab = true;
    }, function (errorResult) {
      // Не окей..
      ctrl.notfoundError = true;
      ctrl.userLoaded = true;
    });

    this.deleteUser = function(userId) {

      ctrl.user.$delete({
        userId: userId
      }, function(successResult) {
        // Окей!
        ctrl.deletionSuccess = true;
      }, function(errorResult) {
        // Не окей..
        ctrl.deletionError = true;
      });

    }
  },

  templateUrl: './src/UserDetail/UserDetailTemplate.html'

});