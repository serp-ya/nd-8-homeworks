'use strict';

const chaiHttp = require('chai-http');
const chai = require('chai');
const expect = chai.expect;

const server = require('../../index.js');
const rootUrl = 'http://localhost:3000';
const createRequestUrl = '/rest/v1/users/';

chai.use(chaiHttp);

describe('Создание пользователя', () => {
  let server;

  before(() => {
    server = chai.request(rootUrl);
  });

  it('Корректный запрос возвращает статус 200', (done) => {
    // В рамках API корректным считается запрос,
    // включающий 2 поля - name и score
    const correctNewUserData = {name: 'Turanga Leela', score: 31};

    server.post(createRequestUrl)
      .send(correctNewUserData)
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Запрос по некоррктному URL вернёт статус 404', (done) => {
    server.post(createRequestUrl + 'abra-kadabra')
      .end(function (err, res) {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('Вернёт статус 400 при неправильных передаваемых данных', (done) => {
    const notCorrectDataForSending = [
      {},
      {name: 'Leela'},
      {score: 30},
      'some string',
      41,
      null,
      undefined,
      true,
      false,
      [],
      [{}]
    ];

    notCorrectDataForSending.forEach(data => {
      server.post(createRequestUrl)
        .send({})
        .end(function (err, res) {
          expect(res).to.have.status(400);
        });
    });

    done();
  });
});