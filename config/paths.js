const fs = require('fs');
const path = require('path');

const APP_PATH = fs.realpathSync(process.cwd());

function resolvePath(relativePath) {
  return path.resolve(APP_PATH, relativePath);
}

module.exports = {
  root: APP_PATH,
  config: resolvePath('config'),
  shared: resolvePath('shared'),
  client: resolvePath('src'),
  server: resolvePath('server'),
  build: resolvePath('build'),
  assets: resolvePath('assets'),
  modules: resolvePath('node_modules'),
};
