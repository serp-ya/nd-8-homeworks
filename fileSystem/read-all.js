`use_strict`;
const { fileSystem, config } = require('./fsConfig');

const readFile = require('./file-promise').read;

const readDir = (path) => {
  return new Promise((resolve, reject) => {
    fileSystem.readdir(path, (err, files) => {
      if (err) {
        reject(err);
      }
      resolve(files);
    })
  });
}

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
}

const readAll = (path) => {
  return new Promise((resolve, reject) => {
    readDir(path)
      .then(filesList => {
        const formatedAllFiles = filesList.map(fileName => formatedReadFile(path + fileName));
        Promise.all(formatedAllFiles).then(resolve);
      })
      .catch(reject);
  });
}

module.exports = readAll;