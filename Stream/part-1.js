'use_strict';
const { createReadStream, createWriteStream} = require('fs');
const cryptoHash = require('crypto').createHash('md5');

const fileStreamOptions = { encoding: 'utf8' };

const readFileStream = new createReadStream('./part-1-files/input.txt', fileStreamOptions);
const writeFileStream = new createWriteStream('./part-1-files/output.txt', fileStreamOptions);

readFileStream
  .pipe(cryptoHash)
  .pipe(process.stdout);

readFileStream
  .pipe(cryptoHash)
  .pipe(writeFileStream);