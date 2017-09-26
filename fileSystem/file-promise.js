`use_strict`;
const { fileSystem, config } = require('./fsConfig');

const read = (path) => {
  return new Promise((resolve, reject) => {
    fileSystem.readFile(path, config, (err, data) => {
          err ? reject(err) : resolve(data);
    });
  });
};

const write = (path, text) => {
  return new Promise((resolve, reject) => {
    fileSystem.writeFile(path, text, (err) => {
      if (err) {
        reject(err);
      }
      resolve(path);
    });
  });
};

module.exports = { read, write };