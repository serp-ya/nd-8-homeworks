'use strict';

const Pokemon = require('../../pokemons/PokemonsClass').Pokemon;
const expect = require('chai').expect;

describe('Класс Pokemon', () => {
  // В этом наборе тестов специально не стал использовать
  // хуку before, т.к. мне нужен экземпляр класса на этапе
  // чтения файла, а не перед непосредственным выполнением
  // тестов, т.к. я провожу тесты по ключам полученного
  // экземпляра класса в цикле ниже
  let pokemon = new Pokemon();

  describe('Метод show()', () => {
    it('Является экземпляром класса Function', () => {
      expect(pokemon.show).is.instanceof(Function);
    });

    it('Ничего не возвращает', () => {
      const showFunctionResult = pokemon.show();
      expect(showFunctionResult).is.undefined;
    });

    Object.keys(pokemon).forEach(pokemonField => {

      it(`Не меняет поле ${pokemonField} экземпляра класса`, () => {
        const initialPokemonField = pokemon[pokemonField];
        pokemon.show();

        expect(pokemon[pokemonField]).is.equal(initialPokemonField);
      });

      it(`Работает, если поле ${pokemonField} экземпляра класса не передано`, () => {
        const copyOfPokemon = Object.assign({}, pokemon);
        delete copyOfPokemon[pokemonField];

        copyOfPokemon.show = pokemon.show;
        copyOfPokemon.show();
      });

    });
  });

});