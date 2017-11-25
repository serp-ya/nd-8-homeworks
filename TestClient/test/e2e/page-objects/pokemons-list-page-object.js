module.exports = class PokemonsList {
  constructor() {
    this.url = '/#!/list';
    this.pokemonsCount = require('../../../app/data/pokemons.json').length;
  }

  getPage() {
    browser.get(this.url);
  }

  async addPokemonsToCart(howMuchToAdd) {
    try {
      const listBody = await element(by.tagName('ui-view'));
      const btnsList = listBody.all(by.tagName('button'));

      for (let i = 0; i < howMuchToAdd; i++) {
        btnsList.get(i).click();
      }

      const cartItemsCount = await element.all(by.repeater('(singlePokemonIndex, singlePokemonValue) in $ctrl.cartItems')).count();

      return cartItemsCount

    } catch (error) {
      return error;
    }
  }

  async getPokemonsOnPageCount() {
    try {
      return element.all(by.repeater('singlePokemon in vm.pokemons | filter:vm.myQuery | orderBy: vm.myOrderProperty')).count();

    } catch (error) {
      return error;
    }
  }
};