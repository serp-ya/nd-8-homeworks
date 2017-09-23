`use_strict`;
const { fileSystem, config } = require('./fsConfig');

const pathInfo = (path, callback) => {
  fileSystem.stat(path, (err, stats) => {
      if (err) {
        console.error(err);
      }

      const info = {};
      info.path = path;

      if (stats.isFile()) {
        info.type = 'file';
        info.content = fileSystem.readFileSync(path, config);

      } else if (stats.isDirectory()) {
        info.type = 'directory';
        info.childs = fileSystem.readdirSync(path, config);
      }

      callback(err, info);
    });
};

module.exports = pathInfo;