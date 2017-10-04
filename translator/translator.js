const https = require('https');
const querystring = require('querystring');

function translateThis(text) {
  const apiUrl = 'https://translate.yandex.net/api/v1.5/tr.json/translate';
  let lang = 'ru-en';
  
  if (/[A-Za-z]/ig.test(text)) {
    lang = 'en-ru';
  }

  let URLParams = querystring.stringify({
    key: 'trnsl.1.1.20170924T220958Z.c68b126185f64636.0b53609cb4b3feffdcd9b68ab27384fa1c052cce',
    text: text,
    lang: lang,
    format: 'plain',
    options: 1
  });



  return new Promise((done, fail) => {
    https.get(apiUrl + '?' + URLParams, res => {
      let translation = '';

      res.on('response', res => {
        if (200 < res.statusCode || res.statusCode > 299) {
          throw new Error('Response code is not "OK"');
        }
      })
      .on('data', chunk => {
        translation += chunk;
      })
      .on('end', () => {
        done(translation);
      })
      .on('error', fail)
    });
  });
}

module.exports = translateThis;