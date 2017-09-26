'use_strict';
const { Readable, Writable, Transform } = require('stream');
const encodingOption = { encoding: 'utf8'};

class NumGeneratorStream extends Readable {
  constructor(options) {
    super(options);
  }

  _read(size) {
    const num = getRandNumber();
    this.push(String(num));
  }
}

class ConsoleWriteStream extends Writable {
  constructor(options) {
    super(options);
  }

  _write(chunk, encoding, done) {
    const data = chunk.toString('utf8');
    console.log(data);
    done();
  }
}

class MakeLablesStream extends Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, done) {
    this.push('label: ' + chunk.toString('utf8'));
    done();
  }
}

const numbersGenerator = new NumGeneratorStream(encodingOption);
const writeData = new ConsoleWriteStream(encodingOption);
const makeLabels = new MakeLablesStream(encodingOption);

numbersGenerator
  .pipe(makeLabels)
  .pipe(writeData)

function getRandNumber() {
  let randNumber = Math.round(Math.random() * ((Math.random() * 25 - 3))); // some random logic
  if (randNumber === 0) {
    return getRandNumber();
  } else if (randNumber < 0) {
    return randNumber * (-1);
  }
  return randNumber;
}