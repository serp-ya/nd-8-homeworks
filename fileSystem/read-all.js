`use_strict`;
const { fileSystem, config } = require('./fsConfig');

const readFile = require('./file-promise').read;

const readAll = (path) => {
  return new Promise((resolve, reject) => {
    const filesData = [];

    fileSystem.readdir(path, fillFilesDataArray);

    function fillFilesDataArray(err, files) {
      if (err) {
        reject(err);
      }

      Promise.all(files.map(fileName => readFile(path + fileName)))
        .then(res => {
          files.forEach((fileName, i) => {
            const data = {
              name: fileName,
              content: res[i]
            };

            filesData.push(data);
          });

          resolve(filesData);
        });
    }
  });
}

module.exports = readAll;