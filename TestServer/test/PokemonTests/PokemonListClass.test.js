'use strict';

const Pokemon = require('../../pokemons/PokemonsClass').Pokemon;
const Pokemonlist = require('../../pokemons/PokemonsClass').Pokemonlist;
const expect = require('chai').expect;

describe('Класс Pokemonlist', () => {
  let pokemonlistDraft;

  before(() => {
    pokemonlistDraft = new Pokemonlist();
  });

  describe('Метод add()', () => {
    it('Добавляет экземпляры класса Pokemon если передавать любые данные', () => {
      // Набор разных типов данных в случаном порядке
      var newPokemonNames = [
        'Bulbazar',
        234,
        [2, 54, 'Try'],
        true,
        {param: 1, name: 'Robert', class: 'Something'},
        undefined,
        null
      ];

      var newPokemonLevel = [
        null,
        [11, 'level'],
        undefined,
        {num: 12, str: 'Take'},
        false,
        'Barsik',
        81
      ];

      for (var i = 0; i < newPokemonNames.length; i++) {
        const newPokemonRapams = [newPokemonNames[i], newPokemonLevel[i]];

        pokemonlistDraft.add(...newPokemonRapams);
        expect(pokemonlistDraft[i]).is.instanceof(Pokemon);
      }
    });

    it('Добавляет новый экземпляр класса Pokemon при вызове с пустыми параметрами', () => {
      const oldPokemonListLenght = pokemonlistDraft.length;
      pokemonlistDraft.add();
      expect(pokemonlistDraft.length).is.equal(1 + oldPokemonListLenght);
    });
  });

  describe('Метод show()', () => {
    it('Работает не зависимо от того, из каких данных построен набор экземпляров класса Pokemon', () => {
      pokemonlistDraft.show();
    });

    it('Переданные данные не влияют на работу метода', () => {
      // Передаётся случайный набор разных типов данных
      pokemonlistDraft.show(33, 'string', null, undefined, [1, 2], {a: 1, b: 'c'});
    });
  });

  describe('Метод max()', () => {
    let pokemonlistCorrect = new Pokemonlist();
    let pokemonlistCorrectLenght = 15;

    before(() => {
      for (var i = 0; i < pokemonlistCorrectLenght; i++) {
        pokemonlistCorrect.add('Name Example', i);
      }
    });

    it('Работает вне зависимости от состава экземпляров класса Pokemon', () => {
      pokemonlistDraft.max();
    });

    it('Возвращает наибольшее число из поля level содержащихся экземпляров класса Pokemon', () => {
      const pokemonlistCorrectLevels = [];
      pokemonlistCorrect.forEach((pokemon) => pokemonlistCorrectLevels.push(pokemon.level));
      
      const maxLevelFromPokemonlistCorrect = Math.max(...pokemonlistCorrectLevels);
      
      expect(maxLevelFromPokemonlistCorrect).is.equal(pokemonlistCorrect.max().level);
    });
  });

});