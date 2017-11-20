'use strict';

const chaiHttp = require('chai-http');
const chai = require('chai');
const expect = chai.expect;

const server = require('../../index.js');
const rootUrl = 'http://localhost:3000';
const deleteRequestUrl = '/rest/v1/users/';

chai.use(chaiHttp);

// Удаление пользователей происходит по ID,
// по-этому получаю все ID
const usersJson = require('../../data/users');
const usersIds = usersJson.map(user => user.id);

describe('Удаление пользователя', () => {
  let server;

  before(() => {
    server = chai.request(rootUrl);
  });

  it('Корректный запрос возвращает статус 200', () => {
    const randomUserId = rand(0, --usersIds.length);

    server.delete(deleteRequestUrl + randomUserId)
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
      });
  });

  it('Запрос не по некорректному ID пользователя вернёт статус 400', (done) => {
    server.delete(deleteRequestUrl + 'abra-kadabra')
      .end(function (err, res) {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('Запрос не по верному URL вернёт статус 404', (done) => {
    server.delete(deleteRequestUrl)
      .end(function (err, res) {
        expect(res).to.have.status(404);
        done();
      });
  });
});

function rand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}