'use strict';

angular.module('myApp')
  .component('topMenu', {
    templateUrl: '/TopMenuComponent/topMenu.component.html',
    controller: function () {
      const vm = this;

      // Список пунктов меню
      vm.menuItems = [
        {
          sref: 'list',
          title: 'Список'
        },
        {
          sref: 'createNewPokemon',
          title: 'Добавить нового'
        },
        {
          sref: 'myAccount',
          title: 'Мой аккаунт'
        }
      ];
    }
  });