`use_strict`;
const { fileSystem, config } = require('./fsConfig');

const readFile = require('./file-promise').read;

const readDir = (path) => {
  return new Promise((resolve, reject) => {
    fileSystem.readdir(path, (err, files) => {
      err ? reject(err) : resolve(files);
    });
  });
};

const formatedReadFile = (path) => {
  return new Promise((resolve, reject) => {
    readFile(path)
      .then(data => {
        const formatedFileInfo = {
          name: path,
          content: data
        };

        resolve(formatedFileInfo);
      })
      .catch(resolve);
  });
};

const readAll = (path) => {
  return readDir(path)
    .then(filesList => {
      const formatedAllFiles = filesList.map(fileName => formatedReadFile(path + fileName));
      return Promise.all(formatedAllFiles);
    })
    .catch(console.error);
};

module.exports = readAll;