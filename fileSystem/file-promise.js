`use_strict`;
const { fileSystem, config } = require('./fsConfig');

const read = (path) => {
  return new Promise((resolve, reject) => {
    const readFileArgs = [
      path,
      config,
      (err, data) => {
        err ? reject(err) : resolve(data);
      }
    ];

    fileSystem.readFile(...readFileArgs);
  });
};

const write = (path, text) => {
  return new Promise((resolve, reject) => {
    const writeFileArgs = [
      path,
      text,
      reject
    ];

    fileSystem.writeFile(...writeFileArgs);
    resolve(path);
  });
};

module.exports = { read, write };