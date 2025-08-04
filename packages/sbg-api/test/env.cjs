const fs = require('fs-extra');
const path = require('upath');

const paths = [
  '/../../../test',
  path.resolve(__dirname + '/../../sbg-cli/test'),
  '/../../../../static-blog-generator-hexo/site',
  '/../../../../hexo-themes'
];

const testCwd = paths
  .map((p) => path.resolve(__dirname + p))
  .find((resolvedPath) => fs.existsSync(path.join(resolvedPath, '_config.yml')));

const fixturesCwd = path.resolve(__dirname, 'fixtures');

module.exports = { fixturesCwd, testCwd };
