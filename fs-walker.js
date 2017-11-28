const fs = require("fs");

const fswalker = (function() {
  const _endsWithSlashWindows = val => RegExp(/\\$/).test(val);
  const _tryCatch = f => {
    try {
      return f();
    } catch (e) {
      return false;
    }
  };
  const _isDirectory = file => _tryCatch(() => fs.statSync(file).isDirectory());
  const _spy = val => {
    console.log(val);
    return val;
  };

  const _crawlRecursive = depth => (path, tree, level) => {
    if (level === depth) return tree;
    const files = _tryCatch(() => fs.readdirSync(path));
    if (!files) return tree;

    const listing = files.map(
      file => (_endsWithSlashWindows(path) ? path + file : path + "\\" + file)
    );

    const paths = listing
      .filter(_isDirectory)
      .map(dir => _crawlRecursive(depth)(dir, { dir }, level + 1));

    const size = listing
      .filter(file => !_isDirectory(file))
      .map(file => fs.statSync(file))
      .map(stat => stat.size)
      .reduce((memo, size) => memo + size, 0);
    return Object.assign({}, tree, { paths, size });
  };

  const _walk = (dir, depth) => _crawlRecursive(depth)(dir, { dir }, 0);

  return {
    Walk: _walk
  };
})();

module.exports = fswalker;
