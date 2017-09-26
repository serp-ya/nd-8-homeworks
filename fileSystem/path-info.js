`use_strict`;
const { fileSystem, config } = require('./fsConfig');

const pathInfo = (path, callback) => {
  const info = {};

  fileSystem.stat(path, (err, stats) => {
    if (err) {
      callback(err);
      return;
    }
    info.path = path;

    if (stats.isFile()) {
      info.type = 'file';
      fileSystem.readFile(path, config, (err, data) => {
        if (err) {
          console.error(err);
          return;
        }

        info.content =  data;
        callback(null, info);
    });

    } else if (stats.isDirectory()) {
      info.type = 'directory';
      fileSystem.readdir(path, config, (err, files) => {
        if (err) {
          console.error(err);
          return;
        }

        info.childs =  files;
        callback(null, info);
      });
    }
  });
};

module.exports = pathInfo;