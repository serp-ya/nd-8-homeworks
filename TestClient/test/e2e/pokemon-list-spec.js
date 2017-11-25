const expect = require('chai').expect;
const { PokemonsList } = require('./page-objects/');
const pokemonsList = new PokemonsList();

describe('Список покемонов', () => {
  beforeEach(() => {
    pokemonsList.getPage();
  });

  describe('Добавление покемонов в корзину', () => {
    for (let i = 0; i < 5; i++) {
      it(`Добавить ${i} покемона(ов) в корзину`, () => {
        const cartItemsCount = pokemonsList.addPokemonsToCart(i);
        return expect(cartItemsCount).to.eventually.is.equal(i);
      });
    }
  });

  describe('Количество отображаемых покемонов', () => {
    it('Выводим кол-во отображаемых покемонов', () => {
      const pokeCount = pokemonsList.getPokemonsOnPageCount();
      return expect(pokeCount).to.eventually.equal(pokemonsList.pokemonsCount);
    });
  });
});