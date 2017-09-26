'use_strict';
const { Transform } = require('stream');
const { createReadStream, createWriteStream} = require('fs');
const cryptoHash = require('crypto').createHash('md5');
const pump = require('pump');

const fileStreamOptions = { encoding: 'utf8' };

const readFileStream = new createReadStream('./part-2-files/input.txt', fileStreamOptions);
const writeFileStream = new createWriteStream('./part-2-files/output.txt', fileStreamOptions);

class TransformHashToHex extends Transform {
  constructor(options) {
    super(options);
    this.hashStore = '';
  }

  _transform(chunk, encoding, callback) {
    cryptoHash.update(chunk);
    this.hashStore = cryptoHash.digest('hex');
    this.push(this.hashStore);
    console.log(this.hashStore);
    callback();
  }

  _flush(done) {
    delete this.hashStore;
    done();
  }
}

const transformHashStream = new TransformHashToHex();

pump(readFileStream, transformHashStream, writeFileStream, (e) => console.error);