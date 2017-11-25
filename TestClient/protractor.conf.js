module.exports.config = {
  allScriptsTimeout: 11000, // Таймаут, через сколько ms будет считаться, что тест завис
  seleniumAddress: 'http://localhost:4444/wd/hub', // Адрес силениум-сервера
  specs: [
    'test/e2e/**/*-spec.js'
  ],
  capabilities: {
    'browserName': 'chrome'
  },
  // multiCapabilities: [
  //   {
  //     'browserName': 'chrome'
  //   },
  //   {
  //     'browserName': 'firefox'
  //   },
  //   {
  //     'browserName': 'ie'
  //   }
  // ],
  baseUrl: 'http://localhost:3000/',
  frameworks: 'mocha',
  mochaOpts: {
    reporter: 'spec',
    slow: 10000,
    timeout: 10000
  },

  onPrepare: () => {
    const chai = require('chai');
    chai.use(require('chai-as-promised'));
  }
};